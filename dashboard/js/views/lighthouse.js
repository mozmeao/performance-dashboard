/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const lighthouse = {

    renderScore: function(score) {
        return `
            <meter value="${score}" min="0" max="100" low="50" high="80" optimum="100">${score}</meter> ${score}
        `;
    },

    renderRow: function(name, page) {
        let scores = {};

        Object.keys(page.scores).forEach((key) => {
            scores[key] = lighthouse.renderScore(page.scores[key]);
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

    render: function(site) {
        const rows = site.pages.map(page => lighthouse.renderRow(site.name, page)).join('');

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
    }
};

export default lighthouse;

