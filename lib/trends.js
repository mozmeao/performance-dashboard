/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const trendsLimit = 100;

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
 * Updates trend data for a given page object.
 * @param {String} date of current page report in ISO format.
 * @param {Object} current page report object.
 */
function update(date, page) {
    let trends = page.trends ? page.trends : [];
    let current = {
        'date': date,
        'scores': page.scores
    };
    trends.push(current);
    trends = trim(trends, trendsLimit);

    return trends;
}

module.exports = {
    update: update,
    trim: trim
};
