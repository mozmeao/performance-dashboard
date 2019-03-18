/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const cloudinary = {

    renderRow: function(page) {
        return `
            <tr>
                <th scope="row"><a href="${page.url}" target="_blank" rel="noopener noreferer">${page.url}</a></th>
                <td><a class="mzp-c-button mzp-t-small" href="https://webspeedtest.cloudinary.com/results/${page.id}" target="_blank" rel="noopener noreferer">Open</a></td>
            </tr>
        `;
    },

    render: function(site) {
        const rows = site.pages.map(page => cloudinary.renderRow(page)).join('');

        return `
            <div class="c-table-container">
                <table class="mzp-u-data-table">
                    <caption>
                        <h3>Cloudinary</h3>
                    </caption>
                    <thead>
                    <tr>
                        <td></td>
                        <th scope="col">Report</th>
                    </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }
};

export default cloudinary;
