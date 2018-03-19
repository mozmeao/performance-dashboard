/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
    'use strict';

    var utils = {

        /**
         * Converts bytes to a more human readable value.
         * @param {Number} bytes.
         * @param {Number} decimals. Optional parameter defaults to 2.
         * @returns {String}.
         */
        formatBytes: function(bytes, decimals) {
            if (typeof bytes !== 'number' || bytes <= 0) {
                return '0b';
            }

            let k = 1024;
            let dm = decimals || 2;
            let sizes = ['b', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'];
            let i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
        },

        /**
         * Converts milliseconds to a more human readable value.
         * @param {Number} ms.
         * @returns {String}.
         */
        formatTime: function(ms) {
            if (typeof ms !== 'number' || ms <= 0) {
                return '0.0s';
            }

            let milliseconds = ms % 1000;
            let seconds = Math.floor((ms / 1000) % 60);
            let minutes = Math.floor((ms / (60 * 1000)) % 60);

            if (minutes > 0) {
                return `${minutes}:${seconds}.${milliseconds}s`;
            } else {
                return `${seconds}.${milliseconds}s`;
            }
        }
    };

    // attempt to export for CommonJS
    try {
        module.exports = utils;
    } catch (e) {
        window.utils = utils;
    }
})();
