/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const fs = require('fs');
const path = require('path');
const trends = require('./trends');
const summaryPath = './dashboard/summary';

/**
 * Creates a report name for a given page based on the URL.
 * @param {String} url.
 * @param {String} date yyyy-mm-dd.
 * @returns {String} report name.
 */
function getReportName(url, date) {
    return url.replace(/^https?:\/\//, '').replace(/[/?#:*$@!.]/g, '_') + date.replace(/-/g, '_');
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
 * Formats a set of pages for use in a summary report.
 * @param {Array} pages.
 * @param {String} date.
 * @returns {Array} of page objects.
 */
function format(pages, date) {
    return pages.map(url => {
        let name = getReportName(url, date);

        return {
            url,
            name: name,
            json: `${name}.report.json`,
            html: `${name}.report.html`
        };
    });
}

/**
 * Gets the performance scores for a given report.
 * @param {String} reportPath.
 * @returns {Object} scores.
 */
function getScores(reportPath) {
    let filePath = path.resolve(reportPath);
    let report = JSON.parse(fs.readFileSync(filePath));

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
        fs.mkdirSync(summaryPath);
    }

    fs.writeFileSync(filePath, JSON.stringify(report), 'utf8');
}

/**
 * Convenience method to retrieve trends for a given page.
 * @param {String} date of current page report in ISO format.
 * @param {Object} current page report object.
 * @returns {Array} performance trends.
 */
function getTrends(date, page) {
    return trends.update(date, page);
}

module.exports = {
    getReportName: getReportName,
    getReportDate: getReportDate,
    format: format,
    getScores: getScores,
    write: write,
    getTrends: getTrends
};
