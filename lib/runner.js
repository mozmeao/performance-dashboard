/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable no-console */

'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const WebPageTest = require('webpagetest');
const summary = require('./summary');
const dataPath = './dashboard/data';
const reportPath = `${dataPath}/reports`;

/**
 * Starts a batch run of reports for all the websites contained in the given directory.
 * @param {String} directoryPath.
 * @param {String} WebPageTest API key.
 * @returns {Promise}.
 */
function batch(directoryPath, key) {
    let sites = path.resolve(directoryPath);

    if (!fs.existsSync(sites)) {
        console.error(`Path does not exist: ${sites}.`);
        process.exit(1);
    }

    let files = fs.readdirSync(sites);

    // filter out any invalid files.
    let sitesArr = files.filter((file) => {
        let filePath = `${sites}/${file}`;
        return fs.existsSync(filePath) && path.extname(filePath) === '.json';
    });

    let results = sitesArr.map(file => {
        return new Promise((resolve, reject) => {
            let filePath = `${sites}/${file}`;
            run(filePath, key).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    });

    return Promise.all(results).then(() => {
        console.log('Performance reports complete…');
    }).catch((err) => {
        console.error(`Performance reports failed: ${err}`);
        process.exit(1);
    });
}

/**
 * Generate reports for a given website.
 * @param {String} filePath to site JSON file.
 * @param {String} WebPageTest API key.
 * @returns {Promise}.
 */
function run(filePath, key) {
    let wpt = new WebPageTest('https://www.webpagetest.org', key);
    let site = JSON.parse(fs.readFileSync(filePath));
    let reportSitePath = `${reportPath}/${site.name}`;

    // Make sure paths exists before writing reports.
    if (!fs.existsSync(reportSitePath)) {
        mkdirp.sync(reportSitePath);
    }

    let pagesArr = site.pages.map(page => {
        return new Promise((resolve) => {
            let options = {
                location: site.location,
                connectivity: site.connection,
                pollResults: 5,
                timeout: 7200, // default 2 hour time out for high wait times.
                firstViewOnly: true,
                lighthouse: true
            };

            wpt.runTest(page, options, (err, data) => {
                if (err) {
                    console.log(`- Failed: ${page} [${site.location}:${site.connection}]`);
                    resolve({
                        'data': {
                            'url': page,
                            'runError': err
                        }
                    });
                    return;
                }
                console.log(`- Complete: ${page} [${site.location}:${site.connection}]`);
                resolve(data);
            });
        });
    });

    return Promise.all(pagesArr).then((pages) => {
        let result = {
            name: site.name,
            location: site.location,
            connection: site.connection,
            date: summary.getReportDate(),
            pages: []
        };

        result.pages = pages.map(page => {
            saveReport(site, page, result.date);
            return summary.format(page);
        });

        summary.write(result);

    }).catch((err) => {
        console.error(err);
        process.exit(1);
    });
}

/**
 * Saves a JSON report to the file system.
 * @param {Object} site.
 * @param {Object} page.
 * @param {String} date yyyy-mm-ddThh:mm.
 */
function saveReport(site, page, date) {
    let filePath = `${reportPath}/${site.name}`;
    let name = summary.getReportName(page.data.url);
    let fullName = name + date.replace(/[-T:]/g, '_');

    if (!fs.existsSync(filePath)) {
        mkdirp.sync(filePath);
    }

    fs.writeFileSync(`${filePath}/${fullName}.report.json`, JSON.stringify(page), 'utf8');
}

module.exports = {
    batch: batch,
    run: run
};
