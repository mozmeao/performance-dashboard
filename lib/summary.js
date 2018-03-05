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

module.exports = {
    getReportName: getReportName,
    getReportDate: getReportDate,
    getScores: getScores,
    write: write
};
