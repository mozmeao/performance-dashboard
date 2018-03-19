/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable no-console */

'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rp = require('request-promise-native');
const localPath = './dashboard/data/trends';
const remotePath = 'https://mozmeao-perf-dashboard.netlify.com/data/trends';
const summaryPath = './dashboard/data/summary/';
const trendsLimit = 365; // Limit trend data to 1 year.

/**
 * Generate trend filename for a given url.
 * @param {String} url.
 */
function getTrendName(url) {
    return url.replace(/^https?:\/\//, '').replace(/[/?#:*$@!.]/g, '_');
}

/**
 * Get remote URL for page trend data.
 * @param {String} reportName.
 * @param {String} fileName.
 */
function getRemoteFilePath(reportName, fileName) {
    return `${remotePath}/${reportName}/${fileName}.trend.json`;
}

/**
 * Get local URL for page trend data.
 * @param {String} reportName.
 * @param {String} fileName.
 */
function getLocalFilePath(reportName, fileName) {
    return `${localPath}/${reportName}/${fileName}.trend.json`;
}

/**
 * Updates trend data for all existing summary reports.
 * @returns {Promise}
 */
function batch() {
    let summary = path.resolve(summaryPath);

    console.log('Runing trend reports…');

    if (!fs.existsSync(summary)) {
        console.error(`Path does not exist: ${summary}.`);
        process.exit(1);
    }

    let files = fs.readdirSync(summary);

    // Filter out any possible bad actors.
    let list = files.filter(file => path.extname(file) === '.json' && file !== 'index.json');

    let sites = list.map(site => {
        return JSON.parse(fs.readFileSync(`${summaryPath}/${site}`));
    });

    // For each summary report…
    let trendsArr = sites.map(site => {
        return new Promise((resolve, reject) => {

            // Update trend data for each page…
            let pagesArr = site.pages.map(page => {

                return new Promise((resolve, reject) => {
                    let trendName = getTrendName(page.url);

                    // Append current page scores to existing page trends.
                    update(trendName, site.name, site.date, page).then(() => {
                        resolve();
                    }).catch((err) => {
                        reject(err);
                    });
                });
            });

            Promise.all(pagesArr).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    });

    // Return only once all trend reports have been processed.
    return Promise.all(trendsArr).then(() => {
        console.log('Trend reports complete…');
    }).catch(err => {
        console.error(`Trend reports failed: ${err}`);
        process.exit(1);
    });
}

/**
 * Trim trends array using a set limit.
 * @param {Array} trends.
 * @param {Number} limit.
 * @returns {Array} trends.
 */
function trim(trends, limit) {
    let l = typeof limit === 'number' ? limit : trends.length;

    if (trends.length > l) {
        return trends.slice(trends.length - l);
    }

    return trends;
}

/**
 * Add current scores to an array of existing trend data.
 * @param {Array} existing trend data.
 * @param {Object} current report scores.
 * @returns {Array} updated trend data.
 */
function add(existing, current) {
    existing = existing ? existing : [];
    existing.push(current);
    return trim(existing, trendsLimit);
}

/**
 * Fetches existing trend data from remote server and appends to current data,
 * before saving the result to local file system.
 * @param {String} fileName for existing trand report.
 * @param {String} report name.
 * @param {String} report date yyyy-mm-dd-hh:mm.
 * @param {Object} current page report object.
 * @returns {Promise}
 */
function update(fileName, name, date, page) {
    return new Promise((resolve, reject) => {
        let options = {
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true,
            resolveWithFullResponse: true,
            simple: false,
            uri: getRemoteFilePath(name, fileName)
        };

        let current = {
            'id': page.id,
            'date': date,
            'scores': page.scores,
            'metrics': page.metrics
        };

        rp(options).then(response => {
            // if trend data already exists, append current scores.
            if (response.statusCode === 200) {
                write(fileName, name, add(response.body, current));
                console.log(`- Trend updated: ${fileName}.json`);
                resolve();
            }
            // else if existing trend data is 404, create a new trend data set.
            else if (response.statusCode === 404) {
                write(fileName, name, add(null, current));
                console.log(`- Trend created: ${fileName}.json`);
                resolve();
            }
            // else something unintended is happening, so reject.
            else {
                reject(`${options.uri} responded with statusCode: ${response.statusCode}`);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

/**
 * Write trend data to local file system.
 * @param {String} trendPath.
 * @param {Object} data to write to file.
 */
function write(fileName, reportName, data) {
    let dirPath = `${localPath}/${reportName}`;

    // Make sure path exists before writing data.
    if (!fs.existsSync(dirPath)) {
        mkdirp.sync(dirPath);
    }

    fs.writeFileSync(getLocalFilePath(reportName, fileName), JSON.stringify(data), 'utf8');
}

module.exports = {
    getTrendName: getTrendName,
    getRemoteFilePath: getRemoteFilePath,
    getLocalFilePath: getLocalFilePath,
    batch: batch,
    trim: trim,
    add: add,
    update: update,
    write: write
};
