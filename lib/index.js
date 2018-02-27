/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Writes a index.json file.
 */
function write(path, data) {
    fs.writeFileSync(path, JSON.stringify(data), 'utf8');
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
 * Adds a site to index.json array and removes duplicates.
 * @param {Object} index.json data.
 * @param {String} file name to add.
 * @returns {Object}
 */
function add(data, name) {
    data.sites.push(name);
    // remove any duplicates from array.
    data.sites = [...new Set(data.sites)];
    return data;
}

/**
 * Adds a file name to index.json data.
 * @param {String} file name to add.
 * @param {String} path to index.json.
 */
function update(name, path) {
    let index = get(path);
    write(path, add(index, name));
}

module.exports = {
    write: write,
    get: get,
    add: add,
    update: update
};
