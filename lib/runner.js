/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable no-console */

'use strict';

const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

const reportPath = './dashboard/report';
const summary = 'summary.json';
const jsonExt = '.json';
const htmlExt = '.html';

function run(data) {
    const summaryPath = `${reportPath}/${summary}`;
    const lighthouse = lighthousePath();

    // clear the output directory before generating a new report.
    shell.rm('-rf', reportPath);
    shell.mkdir('-p', reportPath);

    console.log(`Running performance reports.`);

    let sites = data.map(site => {
        let date = new Date(Date.now()).toDateString();

        let reports = reportInfo(site.pages).map(page => {
            let filePath = `${reportPath}/${page.name}`;
            let cmd = `${page.url} --output json --output html --output-path ${filePath} --quiet`;
            let outcome = shell.exec(`${lighthouse} ${cmd}`);
            let summary = updateSummary(filePath, page, outcome);

            console.log(`Analyzing '${page.url}'`);

            if (summary.error) {
                console.warn(`Analysis failed for ${summary.url}`);
            }

            return summary;
        });

        return {
            'name': site.name,
            'date': date,
            'reports': reports
        };
    });

    fs.writeFileSync(summaryPath, JSON.stringify(sites), 'utf8');
}

function reportInfo(pages) {
    return pages.map(url => {
        let name = url.replace(/^https?:\/\//, '').replace(/[/?#:*$@!.]/g, '_');
        
        return {
            url,
            name,
            json: `${name}.report${jsonExt}`,
            html: `${name}.report${htmlExt}`
        };
    });
}

function lighthousePath() {
    let lighthouse = path.resolve(`${__dirname}/../node_modules/lighthouse/lighthouse-cli/index.js`);
    if (!fs.existsSync(lighthouse)) {
        console.error(`Failed to find Lighthouse CLI.`); // eslint-disable-line no-console
        process.exit(1);
    }
    return lighthouse;
}

function updateSummary(filePath, summary, outcome) {
    if (outcome.code !== 0) {
        summary.score = 0;
        summary.error = outcome.stderr;
        return summary;
    }
    let report = JSON.parse(fs.readFileSync(`${filePath}.report.json`));
    summary.scores = getScores(report);
    return summary;
}

function getScores(report) {
    return report.reportCategories.reduce(function(acc, cur) {
        acc[cur.id.replace('-', '')] = cur.score.toFixed();
        return acc;
    }, {});
}
 
module.exports = run;