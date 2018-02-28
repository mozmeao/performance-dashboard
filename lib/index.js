/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable no-console */

'use strict';

const fs = require('fs');
const path = require('path');
const indexPath = `./dashboard/summary/index.json`;

/**
 * Writes a index.json file.
 * @param {Object} data.
 */
function write(data) {
    fs.writeFileSync(indexPath, JSON.stringify(data), 'utf8');
}

/**
 * Format index.json file and remove self refernece.
 * @param {Array} files.
 * @returns {Object}.
 */
function format(files) {
    return {
        sites: files.filter(file => file !== 'index.json')
    };
}

/**
 * Reads summary directory and creates a list of summary files.
 * @param {String} summaryPath.
 * @returns {Object}.
 */
function create(summaryPath) {
    let summary = path.resolve(summaryPath);

    if (!fs.existsSync(summary)) {
        console.error(`Path does not exist: ${summary}.`);
        process.exit(1);
    }

    let files = fs.readdirSync(summary);
    let list = files.filter(file => path.extname(file) === '.json');
    return format(list);
}

module.exports = {
    write: write,
    create: create,
    format: format
};
