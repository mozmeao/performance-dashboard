/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const fs = require('fs');
const path = require('path');
const indexPath = `./dashboard/summary/index.json`;

/**
 * Writes a index.json file.
 */
function write(data) {
    fs.writeFileSync(indexPath, JSON.stringify(data), 'utf8');
}

/**
 * Removes index.json file.
 */
function remove() {
    let filePath = path.resolve(indexPath);

    if (fs.existsSync(filePath)) {
        fs.unlink(indexPath);
    }
}

/**
 * Get index.json file data. Returns an empty object if file does not yet exist.
 * @param {String} file.
 * @returns {Object} data.
 */
function get(file) {
    let filePath = path.resolve(file);
    let data = {
        sites: []
    };

    if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath));
    }

    return data;
}

/**
 * Adds a file name to index.json data.
 * @param {String} fileName.
 */
function update(fileName) {
    let data = get(indexPath);
    data.sites.push(fileName);
    write(data);
}

module.exports = {
    write: write,
    remove: remove,
    get: get,
    update: update
};
