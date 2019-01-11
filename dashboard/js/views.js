/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
    'use strict';

    const views = {

        getDisplayName: function(fileName) {
            const prefix = fileName.substr(0, fileName.lastIndexOf('.')); // strip .json file extension if exists.
            const name = prefix ? prefix : fileName;
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

            const k = 1024;
            const dm = decimals || 2;
            const sizes = ['b', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
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

            const milliseconds = ms % 1000;
            const seconds = Math.floor((ms / 1000) % 60);
            const minutes = Math.floor((ms / (60 * 1000)) % 60);

            if (minutes > 0) {
                return `${minutes}:${seconds}.${milliseconds}s`;
            } else {
                return `${seconds}.${milliseconds}s`;
            }
        },

        renderHeading: function(site) {
            const name = views.getDisplayName(site.name);

            return `
            <header>
                <h2>${name}</h2>
                <ul class="meta">
                    <li><strong>Location:</strong> ${site.location}</li>
                    <li><strong>Connection:</strong> ${site.connection}</li>
                    <li><strong>Date:</strong> <time>${site.date}</time></li>
                </ul>
            </header>
            `;
        },

        renderCloudinarySummary: function(site) {
            const rows = site.pages.map(page => views.renderCloudinaryData(page)).join('');

            return `
                <table>
                    <caption>
                        <h2>Cloudinary</h2>
                    </caption>
                    <thead>
                    <tr>
                        <th scope="col">Page</th>
                        <th scope="col">Image Weight Analysis</th>
                    </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            `;
        },

        renderCloudinaryData: function(page) {
            return `
                <tr>
                    <td><a href="${page.url}">${page.url}</a></td>
                    <td><a href="https://webspeedtest.cloudinary.com/results/${page.id}">View report</a></td>
                </tr>
            `;
        },

        renderLighthouseScore: function(score) {
            return `
                <meter value="${score}" min="0" max="100" low="50" high="80" optimum="100">${score}</meter> ${score}
            `;
        },

        renderLightHouseData: function(name, page) {
            let scores = {};

            Object.keys(page.scores).forEach((key) => {
                scores[key] = views.renderLighthouseScore(page.scores[key]);
            });

            return `
                <tr>
                    <td><a href="${page.url}">${page.url}</a></td>
                    <td>${scores.performance}</td>
                    <td>${scores.pwa}</td>
                    <td>${scores.accessibility}</td>
                    <td>${scores.bestpractices}</td>
                    <td>${scores.seo}</td>
                    <td><a href="${page.lighthouse}">View report</a></td>
                    <td><button class="button-trend" type="button" data-src="data/trends/${name}/${page.trend}" data-url="${page.url}" data-origin="lighthouse">View</button></td>
                </tr>
            `;
        },

        renderLighthouseSummary: function(site) {
            const rows = site.pages.map(page => views.renderLightHouseData(site.name, page)).join('');

            return `
                <table>
                    <caption>
                        <h2>Lighthouse</h2>
                    </caption>
                    <thead>
                    <tr>
                        <th scope="col">Page</th>
                        <th scope="col">Performance</th>
                        <th scope="col">PWA</th>
                        <th scope="col">Accessibility</th>
                        <th scope="col">Best Practices</th>
                        <th scope="col">SEO</th>
                        <th scope="col">Report</th>
                        <th scope="col">Trend</th>
                    </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            `;
        },

        renderWebPageTestData: function(name, page) {
            const docComplete = views.formatTime(page.metrics.documentComplete);
            const fullyLoaded = views.formatTime(page.metrics.fullyLoaded);
            const pageWeight = views.formatBytes(page.metrics.bytesIn);

            return `
                <tr>
                    <td><a href="${page.url}">${page.url}</a></td>
                    <td>${docComplete}</td>
                    <td>${fullyLoaded}</td>
                    <td>${pageWeight}</td>
                    <td>${page.metrics.requests}</td>
                    <td><a href="${page.summary}">View report</a></td>
                    <td><button class="button-trend" type="button" data-src="data/trends/${name}/${page.trend}" data-url="${page.url}" data-origin="wpt">View</button></td>
                </tr>
            `;
        },

        renderWebPageTestSummary: function(site) {
            const rows = site.pages.map(page => views.renderWebPageTestData(site.name, page)).join('');

            return `
                <table>
                    <caption>
                        <h2>Web Page Test</h2>
                    </caption>
                    <thead>
                    <tr>
                        <th scope="col">Page</th>
                        <th scope="col">Document Complete</th>
                        <th scope="col">Fully Loaded</th>
                        <th scope="col">Page Weight</th>
                        <th scope="col">Requests</th>
                        <th scope="col">Report</th>
                        <th scope="col">Trend</th>
                    </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            `;
        },

        renderNavigationMenu: function(data) {
            const options = data.sites.map(site => {
                const name = views.getDisplayName(site);
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
