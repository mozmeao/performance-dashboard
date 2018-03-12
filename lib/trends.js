/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const trendsLimit = 365;
const trendsPath = './dashboard/data/trends/';

/**
 * Generate trend filename for a given url.
 * @param {String} url.
 */
function getTrendName(url) {
    return url.replace(/^https?:\/\//, '').replace(/[/?#:*$@!.]/g, '_');
}

/**
 * Writes trend report files for a list of web pages.
 * @param {Object} site report.
 */
function write(report) {
    report.pages.forEach(page => {
        let siteTrendPath = `${trendsPath}/${report.name}/`;

        // Make sure paths exists before writing trends.
        if (!fs.existsSync(siteTrendPath)) {
            mkdirp.sync(siteTrendPath);
        }

        let siteTrendName = getTrendName(page.url);
        let filePath = `${siteTrendPath}${siteTrendName}.trend.json`;
        let data = update(filePath, report.name, report.date, page);
        fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
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
 * Fetches existing trend data for a given web page.
 * @param {String} filePath
 * @param {Object} current page report object.
 */
function get(filePath) {
    if (!fs.existsSync(filePath)) {
        return [];
    } else {
        return JSON.parse(fs.readFileSync(filePath));
    }
}

/**
 * Adds current score to an array of existing trend data.
 * @param {Array} existing trend data.
 * @param {Object} current report score.
 */
function add(existing, current) {
    existing.push(current);
    return trim(existing, trendsLimit);
}

/**
 * Updates trend data for a given page object.
 * @param {String} site name.
 * @param {String} date of current page report in ISO format.
 * @param {Object} current page report object.
 */
function update(filePath, siteName, date, page) {
    let trends = get(filePath, siteName, page);
    let current = {
        'id': page.id,
        'date': date,
        'scores': page.scores,
        'metrics': page.metrics
    };
    return add(trends, current);
}

module.exports = {
    getTrendName: getTrendName,
    write: write,
    trim: trim,
    get: get,
    add: add,
    update: update
};
