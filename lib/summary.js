/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const dataPath = './dashboard/data';
const summaryPath = `${dataPath}/summary`;

/**
 * Creates a report name for a given page based on the URL.
 * @param {String} url.
 * @returns {String} report name.
 */
function getReportName(url) {
    return url.replace(/^https?:\/\//, '').replace(/[/?#:*$@!.]/g, '_');
}

/**
 * Creates a runtime report date.
 * @param {Number} number of milliseconds elapsed since UNIX epoch.
 * @returns {String} yyyy-mm-dd.
*/
function getReportDate(d) {
    let date = d ? new Date(d) : new Date(Date.now());
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (day < 10) {
        day = `0${day}`;
    }

    if (month < 10) {
        month = `0${month}`;
    }

    return `${year}-${month}-${day}`;
}

/**
 * Gets the performance scores for a given report.
 * @param {Object} report.
 * @returns {Object} scores.
 */
function getScores(report) {
    return report.reportCategories.reduce(function(acc, cur) {
        acc[cur.id.replace('-', '')] = cur.score.toFixed();
        return acc;
    }, {});
}

/**
 * Writes a report to JSON file.
 * @param {Object} report.
 */
function write(report) {
    let filePath = `${summaryPath}/${report.name}.json`;

    // Make sure path exists before writing summary file.
    if (!fs.existsSync(summaryPath)) {
        mkdirp.sync(summaryPath);
    }

    fs.writeFileSync(filePath, JSON.stringify(report), 'utf8');
}

/**
 * Format summary for a given page report.
 * @param {Object} page.
 * @returns {Object} page summary.
 */
function format(page) {
    let result = {
        url: page.data.url,
        summary: page.data.summary.replace('http://', 'https://'),
        lighthouse: '#',
        scores: {
            'accessibility': '0',
            'bestpractices': '0',
            'performance': '0',
            'pwa': '0',
            'seo': '0'
        },
        metrics: {
            'documentComplete': page.data.average.firstView.loadTime,
            'fullyLoaded': page.data.average.firstView.fullyLoaded,
            'requests': page.data.average.firstView.requests
        }
    };

    // check that Lighthouse data was returned in test report.
    if (page.data.lighthouse) {
        result.lighthouse = page.data.summary.replace('results.php', 'lighthouse.php').replace('http://', 'https://');
        result.scores = getScores(page.data.lighthouse);
    }

    return result;
}

module.exports = {
    getReportName: getReportName,
    getReportDate: getReportDate,
    getScores: getScores,
    write: write,
    format: format
};
