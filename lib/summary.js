/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable no-console */

'use strict';

const fs = require('fs');
const path = require('path');
const summaryPath = './dashboard/summary';

/**
 * Creates a report name for a given page based on the URL.
 * @param {String} url.
 * @returns {String} report name.
 */
function getReportName(url) {
    return url.replace(/^https?:\/\//, '').replace(/[/?#:*$@!.]/g, '_');
}

/**
 * Formats a set of pages for use in a summary report.
 * @param {Array} pages.
 * @returns {Array} of page objects.
 */
function format(pages) {
    return pages.map(url => {
        let name = getReportName(url);

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
    fs.writeFileSync(filePath, JSON.stringify(report), 'utf8');
}

module.exports = {
    getReportName: getReportName,
    format: format,
    getScores: getScores,
    write: write
};
