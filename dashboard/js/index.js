/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function(utils, views) {
    'use strict';

    let dialog = document.querySelector('dialog');
    let dialogTitle = document.getElementById('dialog-title');
    let performanceGraph = document.getElementById('performance-graph');
    let loadGraph = document.getElementById('load-graph');
    let bytesInGraph = document.getElementById('bytes-in-graph');
    let requestsGraph = document.getElementById('requests-graph');

    async function fetchSummary(fileName) {
        try {
            let response = await fetch(`data/summary/${fileName}`);
            let data = await response.json();
            return data;
        } catch(e) {
            throw new Error(`fetchSummary() ${e}`);
        }
    }

    function bindEvents() {
        document.querySelector('.dashboard').addEventListener('click', handleDashboardClick);

        document.getElementById('website-select').addEventListener('change', (e) => {
            e.preventDefault();
            displayWebsiteReport(e.target.value);
        });
    }

    function handleDashboardClick(e) {
        if (e.target.className === 'button-trend') {
            showDialog(e.target.dataset);
        }
    }

    function renderPerformanceGraphs(dataset) {
        dialogTitle.innerHTML = `<h3>${dataset.url}</h3>`;

        window.d3.json(dataset.src, function(data) {
            let perfData = [[], [], [], [], []];
            let loadData = [[], []];
            let requestData = [];
            let bytesInData = [];
            let d = {
                height: 200,
                left: 120,
                right: 120,
                width: 700
            };

            data = window.MG.convert.date(data, 'date', '%Y-%m-%dT%H:%M');

            data.forEach(entry => {
                let date = entry.date;

                // if for some reason WPT returned no data, skip the iteration.
                if (Object.keys(entry.metrics).length === 0) {
                    return;
                }

                perfData[0].push({
                    'date': date,
                    'id': entry.id,
                    'value': parseInt(entry.scores.performance)
                });
                perfData[1].push({
                    'date': date,
                    'id': entry.id,
                    'value': parseInt(entry.scores.pwa)
                });
                perfData[2].push({
                    'date': date,
                    'id': entry.id,
                    'value': parseInt(entry.scores.accessibility)
                });
                perfData[3].push({
                    'date': date,
                    'id': entry.id,
                    'value': parseInt(entry.scores.bestpractices)
                });
                perfData[4].push({
                    'date': date,
                    'id': entry.id,
                    'value': parseInt(entry.scores.seo)
                });

                loadData[0].push({
                    'date': date,
                    'id': entry.id,
                    'value': parseInt(entry.metrics.documentComplete)
                });

                loadData[1].push({
                    'date': date,
                    'id': entry.id,
                    'value': parseInt(entry.metrics.fullyLoaded)
                });

                bytesInData.push({
                    'date': date,
                    'id': entry.id,
                    'value': parseInt(entry.metrics.bytesIn)
                });

                requestData.push({
                    'date': date,
                    'id': entry.id,
                    'value': parseInt(entry.metrics.requests)
                });
            });

            window.MG.data_graphic({
                area: false,
                title: 'Scores',
                data: perfData,
                width: d.width,
                height: d.height,
                left: d.left,
                right: d.right,
                y_label: '%',
                target: performanceGraph,
                legend: ['Performance', 'PWA', 'Accessibility', 'Best Practices', 'SEO']
            });

            window.MG.data_graphic({
                area: false,
                title: 'Load times',
                data: loadData,
                width: d.width,
                height: d.height,
                left: d.left,
                right: d.right,
                target: loadGraph,
                y_label: 'MS',
                legend: ['Doc Complete', 'Fully Loaded']
            });

            window.MG.data_graphic({
                area: false,
                title: 'Bytes In',
                data: bytesInData,
                width: d.width,
                height: d.height,
                left: d.left,
                right: d.right,
                target: bytesInGraph
            });

            window.MG.data_graphic({
                area: false,
                title: 'Requests',
                data: requestData,
                width: d.width,
                height: d.height,
                left: d.left,
                right: d.right,
                y_label: 'Total',
                target: requestsGraph
            });

            window.d3.selectAll('#performance-graph path').on('click', function(data) {
                const id = data.id;

                if (id) {
                    window.location.href = `https://www.webpagetest.org/lighthouse.php?test=${id}`;
                }
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
    }

    function showDialog(dataset) {
        renderPerformanceGraphs(dataset);
        window.dialogPolyfill.registerDialog(dialog);
        dialog.showModal();
    }

    function displayWebsiteReport(report) {
        fetchSummary(report).then(site => {
            let table = views.renderTable(site);
            document.querySelector('.dashboard').innerHTML = table;
        });
    }

    fetchSummary('index.json').then(data => {
        let menu = views.renderNavigationMenu(data);
        document.querySelector('nav').insertAdjacentHTML('beforeend', menu);

        bindEvents();
    });

})(window.utils, window.views);
