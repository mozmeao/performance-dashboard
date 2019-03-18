/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { formatTime, formatBytes } from '../utils.js';

const wpt = {

    renderGraph(dataset) {
        const loadGraph = document.getElementById('load-graph');
        const bytesInGraph = document.getElementById('bytes-in-graph');
        const requestsGraph = document.getElementById('requests-graph');

        window.d3.json(dataset.src, function(data) {
            let loadData = [[], [], [], [], [], []];
            let requestData = [];
            let bytesInData = [];
            let d = {
                height: 200
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
                    'value': entry.metrics.firstByte ? parseFloat(formatTime(entry.metrics.firstByte)) : 0
                });

                loadData[1].push({
                    'date': date,
                    'id': entry.id,
                    'value': entry.metrics.startRender ? parseFloat(formatTime(entry.metrics.startRender)) : 0
                });

                loadData[2].push({
                    'date': date,
                    'id': entry.id,
                    'value': entry.metrics.firstInteractive ? parseFloat(formatTime(entry.metrics.firstInteractive)) : 0
                });

                loadData[3].push({
                    'date': date,
                    'id': entry.id,
                    'value': entry.metrics.documentComplete ? parseFloat(formatTime(entry.metrics.documentComplete)) : 0
                });

                loadData[4].push({
                    'date': date,
                    'id': entry.id,
                    'value': entry.metrics.fullyLoaded ? parseFloat(formatTime(entry.metrics.fullyLoaded)) : 0
                });

                loadData[5].push({
                    'date': date,
                    'id': entry.id,
                    'value': entry.metrics.speedIndex ? parseFloat(formatTime(entry.metrics.speedIndex)) : 0
                });

                bytesInData.push({
                    'date': date,
                    'id': entry.id,
                    'value': entry.metrics.bytesIn ? parseFloat(entry.metrics.bytesIn) : 0
                });

                requestData.push({
                    'date': date,
                    'id': entry.id,
                    'value': entry.metrics.requests ? parseFloat(entry.metrics.requests) : 0
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
                target: requestsGraph
            });

            window.d3.selectAll('#load-graph path').on('click', wpt.openReport);
            window.d3.selectAll('#bytes-in-graph rect').on('click', wpt.openReport);
            window.d3.selectAll('#requests-graph rect').on('click', wpt.openReport);
        });
    },

    openReport: function(data) {
        const id = data.id;

        if (id) {
            const tab = window.open(`https://www.webpagetest.org/results.php?test=${id}`, '_blank');
            tab.focus();
        }
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
                <th scope="row"><a href="${page.url}" target="_blank" rel="noopener noreferer">${page.url}</a></th>
                <td>${firstByte}</td>
                <td>${startRender}</td>
                <td>${firstInteractive}</td>
                <td>${docComplete}</td>
                <td>${fullyLoaded}</td>
                <td>${pageWeight}</td>
                <td>${page.metrics.requests}</td>
                <td>${speedIndex}</td>
                <td><a class="mzp-c-button mzp-t-small" href="${page.summary}" target="_blank" rel="noopener noreferer">Open</a></td>
                <td><button class="mzp-c-button mzp-t-secondary mzp-t-small button-trend" type="button" data-src="data/trends/${name}/${page.trend}" data-url="${page.url}" data-origin="wpt">Open</button></td>
            </tr>
        `;
    },

    render: function(site) {
        const rows = site.pages.map(page => wpt.renderRow(site.name, page)).join('');

        return `
            <div class="c-table-container">
                <table class="mzp-u-data-table">
                    <caption>
                        <h3>Web Page Test</h3>
                    </caption>
                    <thead>
                    <tr>
                        <td></td>
                        <th scope="col">First Byte</th>
                        <th scope="col">Start Render</th>
                        <th scope="col">First Interactive</th>
                        <th scope="col">Document Complete</th>
                        <th scope="col">Fully Loaded</th>
                        <th scope="col">Page Weight</th>
                        <th scope="col">Requests</th>
                        <th scope="col">Speed Index</th>
                        <th scope="col">Report</th>
                        <th scope="col">Graph</th>
                    </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }
};

export default wpt;
