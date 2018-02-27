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
const indexPath = `./dashboard/summary/index.json`;

/**
 * Starts a batch run of reports for all the websites contained in the given directory.
 * @param {String} directoryPath.
 */
function batch(directoryPath) {
    let sites = path.resolve(directoryPath);

    fs.readdir(sites, (err, files) => {
        if (err) {
            console.error(`Could not read from the ${sites} directory.`, err);
            process.exit(1);
        }

        files.forEach(file => {
            run(sites, file);
        });
    });
}

/**
 * Run reports against a single site using the JSON file provided.
 * @param {String} filePath to directory.
 * @param {String} fileName of JSON file.
 */
function run(filePath, fileName) {
    let result = getReport(`${filePath}/${fileName}`);

    if (result) {
        summary.write(result);
        index.update(fileName, indexPath);
    }
}

/**
 * Generate Lighthouse reports for a website.
 * @param {String} filePath to site JSON file.
 * @returns {Object} website report summary.
 */
function getReport(filePath) {

    if (fs.existsSync(filePath) && path.extname(filePath) === '.json') {
        let site = JSON.parse(fs.readFileSync(filePath));
        let reportPath = `${reportsDir}/${site.name}/`;

        // Make sure paths exists before writing reports.
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir);
        }

        if (!fs.existsSync(reportPath)) {
            fs.mkdirSync(reportPath);
        }

        console.log(`Running performance reports for ${site.name}.`);

        let date = summary.getReportDate();

        let pages = summary.format(site.pages, date).map(page => {
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
 * Runs the Lighthouse CLI against a single web page.
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
 * @returns path to executable.
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
