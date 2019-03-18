/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const lighthouse = {

    renderGraph(dataset) {
        const performanceGraph = document.getElementById('performance-graph');

        window.d3.json(dataset.src, function(data) {
            let perfData = [[], [], [], [], []];
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
            });

            window.MG.data_graphic({
                area: false,
                title: 'Lighthouse Scores',
                data: perfData,
                full_width: true,
                height: d.height,
                left: d.left,
                right: d.right,
                target: performanceGraph,
                legend: ['Performance', 'PWA', 'Accessibility', 'Best Practices', 'SEO'],
                legend_target: '.legend.performance'
            });

            window.d3.selectAll('#performance-graph path').on('click', lighthouse.openReport);
        });
    },

    openReport: function(data) {
        const id = data.id;

        if (id) {
            const tab = window.open(`https://www.webpagetest.org/lighthouse.php?test=${id}`, '_blank');
            tab.focus();
        }
    },

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
                <th scope="row"><a href="${page.url}" target="_blank" rel="noopener noreferer">${page.url}</a></th>
                <td>${scores.performance}</td>
                <td>${scores.pwa}</td>
                <td>${scores.accessibility}</td>
                <td>${scores.bestpractices}</td>
                <td>${scores.seo}</td>
                <td><a class="mzp-c-button mzp-t-small" href="${page.lighthouse}" target="_blank" rel="noopener noreferer">Open</a></td>
                <td><button class="mzp-c-button mzp-t-secondary mzp-t-small button-trend" type="button" data-src="data/trends/${name}/${page.trend}" data-url="${page.url}" data-origin="lighthouse">Open</button></td>
            </tr>
        `;
    },

    render: function(site) {
        const rows = site.pages.map(page => lighthouse.renderRow(site.name, page)).join('');

        return `
            <div class="c-table-container">
                <table class="mzp-u-data-table">
                    <caption>
                        <h3>Lighthouse</h3>
                    </caption>
                    <thead>
                    <tr>
                        <td></td>
                        <th scope="col">Performance</th>
                        <th scope="col">PWA</th>
                        <th scope="col">Accessibility</th>
                        <th scope="col">Best Practices</th>
                        <th scope="col">SEO</th>
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

export default lighthouse;
