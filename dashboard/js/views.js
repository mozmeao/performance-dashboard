/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
    'use strict';

    var views = {

        getDisplayName: function(fileName) {
            let prefix = fileName.substr(0, fileName.lastIndexOf('.')); // strip .json file extension if exists.
            let name = prefix ? prefix : fileName;
            return name.replace(/_/g, '.');
        },

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
        },

        renderTableRow: function(name, page, scores) {
            let docComplete = views.formatTime(page.metrics.documentComplete);
            let fullyLoaded = views.formatTime(page.metrics.fullyLoaded);
            let pageWeight = views.formatBytes(page.metrics.bytesIn);

            return `
                <tr>
                    <td><a href="${page.url}">${page.url}</a></td>
                    <td>${docComplete}</td>
                    <td>${fullyLoaded}</td>
                    <td>${pageWeight}</td>
                    <td>${page.metrics.requests}</td>
                    ${scores}
                    <td><a href="${page.summary}">View report</a></td>
                    <td><a href="${page.lighthouse}">View report</a></td>
                    <td><button class="button-trend" type="button" data-src="data/trends/${name}/${page.trend}" data-url="${page.url}">View</button></td>
                </tr>
            `;
        },

        renderScore: function(score) {
            return `
                <meter value="${score}" min="0" max="100" low="50" high="80" optimum="100">${score}</meter> ${score}
            `;
        },

        renderTable: function(site) {
            let name = views.getDisplayName(site.name);
            let rows = site.pages.map(page => {
                let scores = '';

                Object.keys(page.scores).forEach((key) => {
                    let score = views.renderScore(page.scores[key]);
                    scores += `<td>${score}</td>`;
                });

                return views.renderTableRow(site.name, page, scores);
            }).join('');

            return `
                <table>
                    <caption>
                        <h2>${name}</h2>
                        <div class="meta">Location: ${site.location}, Connection: ${site.connection}, Date: <time>${site.date}</time></div>
                    </caption>
                    <thead>
                    <tr>
                        <th scope="col">Page</th>
                        <th scope="col">Document Complete</th>
                        <th scope="col">Fully Loaded</th>
                        <th scope="col">Page Weight</th>
                        <th scope="col">Requests</th>
                        <th scope="col">Performance</th>
                        <th scope="col">PWA</th>
                        <th scope="col">Accessibility</th>
                        <th scope="col">Best Practices</th>
                        <th scope="col">SEO</th>
                        <th scope="col">WebPageTest</th>
                        <th scope="col">Lighthouse</th>
                        <th scope="col">Trend</th>
                    </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            `;
        },

        renderNavigationMenu: function(data) {
            let options = data.sites.map(site => {
                let name = views.getDisplayName(site);
                return `<option value="${site}">${name}</option>`;
            }).join('');

            return `
                <form>
                    <label for="website-select">Select a website:</label>
                    <select id="website-select">
                        <option selected disabled>-- Choose --</option>
                        ${options}
                    </select>
                </form>
            `;
        }
    };

    // attempt to export for CommonJS
    try {
        module.exports = views;
    } catch (e) {
        window.views = views;
    }

})();
