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
                    <option selected disabled>Select a website</option>
                    ${sites}
                </select>
            </form>
        `;
    }

    function renderSelectOption(name, value) {
        return `<option value="${value}">${name}</option>`;
    }

    function renderReportTable(name, date, rows) {
        return `
            <table>
                <caption>
                    <h2>${name}</h2>
                    <time>${date}</time>
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
                ${scores}
                <td><a href="/reports/${name}/${page.html}">View report</a></td>
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

            displayReport(renderReportTable(name, site.date, rows));
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
