/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable no-console */

'use strict';

const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const summary = require('./summary');

const reportsDir = './dashboard/reports';

function run(site) {
    const reportPath = `${reportsDir}/${site.name}`;
    const lighthouse = lighthousePath();

    // clear the output directory before generating a new report.
    shell.rm('-rf', reportPath);
    shell.mkdir('-p', reportPath);

    console.log(`Running performance reports for ${site.name}.`);

    let date = new Date(Date.now()).toDateString();

    let pages = summary.format(site.pages).map(page => {
        let filePath = `${reportPath}/${page.name}`;
        let cmd = `${page.url} --output json --output html --output-path ${filePath} --quiet`;

        console.log(`Analyzing '${page.url}'`);

        let outcome = shell.exec(`${lighthouse} ${cmd}`);
        let result = summary.update(filePath, page, outcome, date);

        if (result.error) {
            console.warn(`Analysis failed for ${result.url}`);
        }

        return result;
    });

    summary.write({
        'name': site.name,
        'date': date,
        'pages': pages
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

module.exports = run;
