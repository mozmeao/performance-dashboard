(function() {
    'use strict';

    async function fetchSummary() {
        try {
            let response = await fetch('/report/summary.json');
            let data = await response.json();
            return data;
        } catch(e) {
            throw new Error(`fetchSummary() ${e}`);
        }
    }

    function generateTable(site, rows) {
        return `
            <table>
                <caption>
                    <h2>${site.name}</h2>
                    <time>${site.date}</time>
                </caption>
                <thead>
                <tr>
                    <th scope="col">Page</th>
                    <th scope="col">JSON</th>
                    <th scope="col">HTML Report</th>
                    <th scope="col">Performance</th>
                    <th scope="col">PWA</th>
                    <th scope="col">Accessibility</th>
                    <th scope="col">Best Practices</th>
                    <th scope="col">SEO</th>
                </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    }

    function generateTableRow(report) {
        return `
            <tr>
                <td><a rel="noopener noreferrer" target="_blank" href="${report.url}">${report.url}</a></td>
                <td><a download href="/report/${report.json}">Download</a></td>
                <td><a href="/report/${report.html}">View report</a></td>
                <td><meter value="${report.scores.performance}" min="0" max="100" low="80" optimum="100">${report.scores.performance}</meter> ${report.scores.performance}</td>
                <td><meter value="${report.scores.pwa}" min="0" max="100" low="80" optimum="100">${report.scores.pwa}</meter> ${report.scores.pwa}</td>
                <td><meter value="${report.scores.accessibility}" min="0" max="100" low="80" optimum="100">${report.scores.accessibility}</meter> ${report.scores.accessibility}</td>
                <td><meter value="${report.scores.bestpractices}" min="0" max="100" low="80" optimum="100">${report.scores.bestpractices}</meter> ${report.scores.bestpractices}</td>
                <td><meter value="${report.scores.seo}" min="0" max="100" low="80" optimum="100">${report.scores.seo}</meter> ${report.scores.seo}</td>
            </tr>
        `;
    }

    function updateDashboard(tables) {
        document.querySelector('.dashboard').innerHTML = tables;
    }

    fetchSummary().then(data => {
        let tables = data.map(site => {
            let rows = site.reports.map(report => {
                return generateTableRow(report);
            }).join('');

            return generateTable(site, rows);
        }).join('');

        updateDashboard(tables);
    });

})();
