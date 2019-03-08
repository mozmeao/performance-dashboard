/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { formatTime, formatBytes } from '../utils.js';

const wpt = {

    renderGraph(dataset) {
        const loadGraph = document.getElementById('load-graph');
        const bytesInGraph = document.getElementById('bytes-in-graph');
        const requestsGraph = document.getElementById('requests-graph');
        const dialogTitle = document.getElementById('dialog-title');

        dialogTitle.innerHTML = `<h3>${dataset.url}</h3>`;

        window.d3.json(dataset.src, function(data) {
            let loadData = [[], [], [], [], [], []];
            let requestData = [];
            let bytesInData = [];
            let d = {
                height: 200,
                left: 100,
                right: 100
            };

            data = window.MG.convert.date(data, 'date', '%Y-%m-%dT%H:%M');

            data.forEach(entry => {
                const date = entry.date;

                // if there was an error fetching the test, skip the iteration.
                if (entry.runError && entry.runError.statusCode) {
                    return;
                }

                // if for some reason WPT returned no data, skip the iteration.
                if (Object.keys(entry.metrics).length === 0) {
                    return;
                }

                loadData[0].push({
                    'date': date,
                    'id': entry.id,
                    'value': entry.metrics.firstByte ? parseInt(entry.metrics.firstByte) : 0
                });

                loadData[1].push({
                    'date': date,
                    'id': entry.id,
                    'value': entry.metrics.startRender ? parseInt(entry.metrics.startRender) : 0
                });

                loadData[2].push({
                    'date': date,
                    'id': entry.id,
                    'value': entry.metrics.firstInteractive ? parseInt(entry.metrics.firstInteractive) : 0
                });

                loadData[3].push({
                    'date': date,
                    'id': entry.id,
                    'value': entry.metrics.documentComplete ? parseInt(entry.metrics.documentComplete) : 0
                });

                loadData[4].push({
                    'date': date,
                    'id': entry.id,
                    'value': entry.metrics.fullyLoaded ? parseInt(entry.metrics.fullyLoaded) : 0
                });

                loadData[5].push({
                    'date': date,
                    'id': entry.id,
                    'value': entry.metrics.speedIndex ? parseInt(entry.metrics.speedIndex) : 0
                });

                bytesInData.push({
                    'date': date,
                    'id': entry.id,
                    'value': entry.metrics.bytesIn ? parseInt(entry.metrics.bytesIn) : 0
                });

                requestData.push({
                    'date': date,
                    'id': entry.id,
                    'value': entry.metrics.requests ? parseInt(entry.metrics.requests) : 0
                });
            });

            window.MG.data_graphic({
                area: false,
                title: 'Page Speed',
                data: loadData,
                full_width: true,
                height: d.height,
                left: d.left,
                right: d.right,
                target: loadGraph,
                y_label: 'MS',
                legend: ['First Byte', 'Start Render', 'First Interactive', 'Doc Complete', 'Fully Loaded', 'Speed Index'],
                legend_target: '.legend.load-times'
            });

            window.MG.data_graphic({
                area: true,
                title: 'Bytes In',
                data: bytesInData,
                full_width: true,
                height: d.height,
                left: d.left,
                right: d.right,
                target: bytesInGraph
            });

            window.MG.data_graphic({
                area: true,
                title: 'Requests',
                data: requestData,
                full_width: true,
                height: d.height,
                left: d.left,
                right: d.right,
                y_label: 'Total',
                target: requestsGraph
            });

            window.d3.selectAll('#load-graph path').on('click', function(data) {
                const id = data.id;

                if (id) {
                    window.location.href = `https://www.webpagetest.org/results.php?test=${id}`;
                }
            });

            window.d3.selectAll('#bytes-in-graph rect').on('click', function(data) {
                const id = data.id;

                if (id) {
                    window.location.href = `https://www.webpagetest.org/results.php?test=${id}`;
                }
            });

            window.d3.selectAll('#requests-graph rect').on('click', function(data) {
                const id = data.id;

                if (id) {
                    window.location.href = `https://www.webpagetest.org/results.php?test=${id}`;
                }
            });
        });
    },

    renderRow: function(name, page) {
        const docComplete = formatTime(page.metrics.documentComplete);
        const firstByte = formatTime(page.metrics.firstByte);
        const firstInteractive = formatTime(page.metrics.firstInteractive);
        const fullyLoaded = formatTime(page.metrics.fullyLoaded);
        const pageWeight = formatBytes(page.metrics.bytesIn);
        const speedIndex = formatTime(page.metrics.speedIndex);
        const startRender = formatTime(page.metrics.startRender);

        return `
            <tr>
                <td><a href="${page.url}">${page.url}</a></td>
                <td>${firstByte}</td>
                <td>${startRender}</td>
                <td>${firstInteractive}</td>
                <td>${docComplete}</td>
                <td>${fullyLoaded}</td>
                <td>${pageWeight}</td>
                <td>${page.metrics.requests}</td>
                <td>${speedIndex}</td>
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
                    <th scope="col">First Byte</th>
                    <th scope="col">Start Render</th>
                    <th scope="col">First interactive</th>
                    <th scope="col">Document Complete</th>
                    <th scope="col">Fully Loaded</th>
                    <th scope="col">Page Weight</th>
                    <th scope="col">Requests</th>
                    <th scope="col">Speed Index</th>
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
