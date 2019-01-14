/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { formatTime, formatBytes } from '../utils.js';


const wpt = {

    renderRow: function(name, page) {
        const docComplete = formatTime(page.metrics.documentComplete);
        const fullyLoaded = formatTime(page.metrics.fullyLoaded);
        const pageWeight = formatBytes(page.metrics.bytesIn);

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

    render: function(site) {
        const rows = site.pages.map(page => wpt.renderRow(site.name, page)).join('');

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
    }
};

export default wpt;

