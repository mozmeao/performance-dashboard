/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Converts summary filename into a more human readable display name.
 * @param {String}} filename.
 * @returns {String}.
 */
function getDisplayName(fileName) {
    const prefix = fileName.substr(0, fileName.lastIndexOf('.')); // strip .json file extension if exists.
    const name = prefix ? prefix : fileName;
    return name.replace(/_/g, '.');
}

/**
 * Converts bytes to a more human readable value.
 * @param {Number} bytes.
 * @param {Number} decimals. Optional parameter defaults to 0.
 * @returns {String}.
 */
function formatBytes(bytes, decimals) {
    if (typeof bytes !== 'number' || bytes <= 0) {
        return '0 B';
    }

    const k = 1024;
    const dm = decimals || 1;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Converts milliseconds to a more human readable value.
 * @param {Number} ms.
 * @returns {String}.
 */
function formatTime(ms) {
    if (typeof ms !== 'number' || ms <= 0) {
        return '0.0s';
    }

    const milliseconds = ms % 1000;
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (60 * 1000)) % 60);

    if (minutes > 0) {
        return `${minutes}:${seconds}.${milliseconds}s`;
    } else {
        return `${seconds}.${milliseconds}s`;
    }
}

/**
 * Fetches a summary json file.
 * @param {String} filename.
 * @returns {JSON}.
 */
async function fetchSummary(fileName) {
    try {
        const response = await fetch(`data/summary/${fileName}`);
        const data = await response.json();
        return data;
    } catch(e) {
        throw new Error(`fetchSummary() ${e}`);
    }
}

export { getDisplayName, formatBytes, formatTime, fetchSummary };
