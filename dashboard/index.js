(function() {
    'use strict';

    async function fetchSummary(fileName) {
        try {
            let response = await fetch(`summary/${fileName}`);
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

    function generateTableRow(name, page) {
        return `
            <tr>
                <td><a rel="noopener noreferrer" target="_blank" href="${page.url}">${page.url}</a></td>
                <td><a download href="/reports/${name}/${page.json}">Download</a></td>
                <td><a href="/reports/${name}/${page.html}">View report</a></td>
                <td><meter value="${page.scores.performance}" min="0" max="100" low="80" optimum="100">${page.scores.performance}</meter> ${page.scores.performance}</td>
                <td><meter value="${page.scores.pwa}" min="0" max="100" low="80" optimum="100">${page.scores.pwa}</meter> ${page.scores.pwa}</td>
                <td><meter value="${page.scores.accessibility}" min="0" max="100" low="80" optimum="100">${page.scores.accessibility}</meter> ${page.scores.accessibility}</td>
                <td><meter value="${page.scores.bestpractices}" min="0" max="100" low="80" optimum="100">${page.scores.bestpractices}</meter> ${page.scores.bestpractices}</td>
                <td><meter value="${page.scores.seo}" min="0" max="100" low="80" optimum="100">${page.scores.seo}</meter> ${page.scores.seo}</td>
            </tr>
        `;
    }

    function updateDashboard(table) {
        document.querySelector('.dashboard').insertAdjacentHTML('beforeend', table);
    }

    fetchSummary('index.json').then(data => {
        data.sites.forEach(site => {
            fetchSummary(site).then(site => {
                let rows = site.pages.map(page => {
                    return generateTableRow(site.name, page);
                }).join('');

                updateDashboard(generateTable(site, rows));
            });
        });
    });

})();
