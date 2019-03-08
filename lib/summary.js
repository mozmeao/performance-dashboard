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
 * @returns {String} yyyy-mm-ddThh:mm.
*/
function getReportDate(d) {
    let date = d ? new Date(d) : new Date(Date.now());
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let mins = date.getMinutes();

    if (day < 10) {
        day = `0${day}`;
    }

    if (month < 10) {
        month = `0${month}`;
    }

    if (hours < 10) {
        hours = `0${hours}`;
    }

    if (mins < 10) {
        mins = `0${mins}`;
    }

    return `${year}-${month}-${day}T${hours}:${mins}`;
}

/**
 * Gets the performance scores for a given report.
 * @param {Object} report.
 * @returns {Object} scores.
 */
function getScores(report) {
    return Object.keys(report.categories).reduce(function(acc, key) {
        acc[report.categories[key].id.replace('-', '')] = Math.round(report.categories[key].score * 100);
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
    let name = getReportName(page.data.url);

    let result = {
        id: page.data.id ? page.data.id : null,
        url: page.data.url,
        runError: page.data.runError ? page.data.runError: null,
        lighthouse: '#',
        trend: `${name}.trend.json`,
        scores: {
            'accessibility': 0,
            'bestpractices': 0,
            'performance': 0,
            'pwa': 0,
            'seo': 0
        },
        metrics: {
            'bytesIn': 0,
            'documentComplete': 0,
            'firstInteractive': 0,
            'fullyLoaded': 0,
            'requests': 0,
            'speedIndex': 0,
            'startRender': 0,
            'ttfb': 0
        }
    };

    if (!page.data.runError) {
        result.metrics.bytesIn = page.data.average.firstView.bytesIn;
        result.metrics.documentComplete = page.data.average.firstView.loadTime;
        result.metrics.firstByte = page.data.average.firstView.TTFB;
        result.metrics.firstInteractive = page.data.average.firstView.FirstInteractive ? page.data.average.firstView.FirstInteractive : page.data.average.firstView.LastInteractive;
        result.metrics.fullyLoaded = page.data.average.firstView.fullyLoaded;
        result.metrics.requests = page.data.average.firstView.requestsFull;
        result.metrics.speedIndex = page.data.average.firstView.SpeedIndex;
        result.metrics.startRender = page.data.average.firstView.render;
        result.summary = page.data.summary.replace('http://', 'https://');
    }

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
