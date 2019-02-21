/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const cloudinary = {

    renderRow: function(page) {
        return `
            <tr>
                <td><a href="${page.url}">${page.url}</a></td>
                <td><a href="https://webspeedtest.cloudinary.com/results/${page.id}">View report</a></td>
            </tr>
        `;
    },

    render: function(site) {
        const rows = site.pages.map(page => cloudinary.renderRow(page)).join('');

        return `
            <table>
                <caption>
                    <h2>Cloudinary</h2>
                </caption>
                <thead>
                <tr>
                    <th scope="col">Page</th>
                    <th scope="col">Image Weight Analysis</th>
                </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    }
};

export default cloudinary;
