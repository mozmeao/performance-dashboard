/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable no-console */

'use strict';

const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const summary = require('./summary');
const index = require('./index');
const reportsDir = './dashboard/reports';

/**
 * Starts a batch run of Lighthouse reports for all the websites contained in the given directory.
 * @param {String} directoryPath.
 */
function batch(directoryPath) {
    let sites = path.resolve(directoryPath);

    fs.readdir(sites, (err, files) => {
        if (err) {
            console.error(`Could not read from the ${sites} directory.`, err);
            process.exit(1);
        }

        // remove existing index.json file before creating fresh reports.
        index.remove();

        files.forEach((file) => {
            let result = run(`${sites}/${file}`);

            if (result) {
                summary.write(result);
                index.update(file);
            }
        });
    });
}

/**
 * Generate Lighthouse reports for a website.
 * @param {String} filePath.
 * @returns {Object} website report summary.
 */
function run(filePath) {
    let site;

    if (fs.existsSync(filePath) && path.extname(filePath) === '.json') {
        site = JSON.parse(fs.readFileSync(filePath));

        // clear the output directory before generating a new report.
        let reportPath = `${reportsDir}/${site.name}`;
        shell.rm('-rf', reportPath);
        shell.mkdir('-p', reportPath);

        console.log(`Running performance reports for ${site.name}.`);

        let date = new Date(Date.now()).toISOString();

        let pages = summary.format(site.pages).map(page => {
            let filePath = `${reportsDir}/${site.name}/${page.name}`;
            let report = runLighthouse(page, filePath);

            if (report) {
                page.scores = summary.getScores(`${filePath}.report.json`);
                page.trends = summary.getTrends(date, page);
            }

            return page;
        });

        return {
            'name': site.name,
            'date': date,
            'pages': pages
        };
    }

    return false;
}

/**
 * Run the Lighthouse CLI against an individual web page.
 * @param {Object} page.
 * @param {String} filePath.
 * @returns {Object} Lighthouse report.
 */
function runLighthouse(page, filePath) {
    let lighthouse = getLighthouse();
    let cmd = `${page.url} --output json --output html --output-path ${filePath} --quiet`;

    console.log(`Analyzing '${page.url}'`);
    let report = shell.exec(`${lighthouse} ${cmd}`);

    if (report.code !== 0) {
        console.warn(`Analysis failed for ${report.stderr}`);
        process.exit(1);
    }

    return report;
}

/**
 * Resolve the Lighthouse CLI.
 * @returns Lighthouse CLI path.
 */
function getLighthouse() {
    let lighthouse = path.resolve(`${__dirname}/../node_modules/lighthouse/lighthouse-cli/index.js`);
    if (!fs.existsSync(lighthouse)) {
        console.error(`Failed to find Lighthouse CLI.`);
        process.exit(1);
    }
    return lighthouse;
}

module.exports = {
    batch: batch,
    run: run
};
