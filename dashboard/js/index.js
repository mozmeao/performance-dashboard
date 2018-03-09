/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
    'use strict';

    async function fetchSummary(fileName) {
        try {
            let response = await fetch(`data/summary/${fileName}`);
            let data = await response.json();
            return data;
        } catch(e) {
            throw new Error(`fetchSummary() ${e}`);
        }
    }

    function getDisplayName(fileName) {
        let prefix = fileName.substr(0, fileName.lastIndexOf('.')); // strip .json file extension if exists.
        let name = prefix ? prefix : fileName;
        return name.replace(/_/g, '.');
    }

    function renderSelectMenu(sites) {
        return `
            <form>
                <label for="website-select">Select a website:</label>
                <select id="website-select">
                    <option selected disabled>-- Choose --</option>
                    ${sites}
                </select>
            </form>
        `;
    }

    function renderSelectOption(name, value) {
        return `<option value="${value}">${name}</option>`;
    }

    function renderMetaData(date) {
        return `<div class="meta"><strong>Location:</strong> ec2-us-west-2, <strong>Browser:</strong> Chrome, <strong>Connection:</strong> 3G, <strong>Date:</strong> <time>${date}</time></div>`;
    }

    function renderReportTable(name, meta, rows) {
        return `
            <table>
                <caption>
                    <h2>${name}</h2>
                    ${meta}
                </caption>
                <thead>
                <tr>
                    <th scope="col">Page</th>
                    <th scope="col">Document Complete</th>
                    <th scope="col">Fully Loaded</th>
                    <th scope="col">Requests</th>
                    <th scope="col">Performance</th>
                    <th scope="col">PWA</th>
                    <th scope="col">Accessibility</th>
                    <th scope="col">Best Practices</th>
                    <th scope="col">SEO</th>
                    <th scope="col">WebPageTest</th>
                    <th scope="col">Lighthouse</th>
                </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    }

    function renderReportTableRow(name, page, scores) {
        return `
            <tr>
                <td><a href="${page.url}">${page.url}</a></td>
                <td>${page.metrics.documentComplete}ms</td>
                <td>${page.metrics.fullyLoaded}ms</td>
                <td>${page.metrics.requests}</td>
                ${scores}
                <td><a href="${page.summary}">View report</a></td>
                <td><a href="${page.lighthouse}">View report</a></td>
            </tr>
        `;
    }

    function renderScore(name, score) {
        return `
            <td><meter value="${score}" min="0" max="100" low="50" high="80" optimum="100">${score}</meter> ${score}</td>
        `;
    }

    function displayNavigation(menu) {
        document.querySelector('nav').insertAdjacentHTML('beforeend', menu);

        document.getElementById('website-select').addEventListener('change', (e) => {
            e.preventDefault();
            displayWebsiteReport(e.target.value);
        });
    }

    function displayReport(table) {
        document.querySelector('.dashboard').innerHTML = table;
    }

    function displayWebsiteReport(report) {
        fetchSummary(report).then(site => {
            let name = getDisplayName(site.name);
            let rows = site.pages.map(page => {
                let scores = '';

                Object.entries(page.scores).forEach(([key, value]) => {
                    scores += renderScore(key, value);
                });

                return renderReportTableRow(site.name, page, scores);
            }).join('');

            let meta = renderMetaData(site.date);
            let table = renderReportTable(name, meta, rows);

            displayReport(table);
        });
    }

    fetchSummary('index.json').then(data => {
        let options = data.sites.map(site => {
            let name = getDisplayName(site);
            return renderSelectOption(name, site);
        }).join('');

        let menu = renderSelectMenu(options);

        displayNavigation(menu);
    });

})();
