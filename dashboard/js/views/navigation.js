/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { getDisplayName } from '../utils.js';

const navigation = {

    render: function(data) {
        const options = data.sites.map(site => {
            const name = getDisplayName(site);
            return `<option value="${site}">${name}</option>`;
        }).join('');

        return `
            <form>
                <label for="website-select">Select a website:</label>
                <select id="website-select">
                    <option selected disabled>-- Choose --</option>
                    ${options}
                </select>
            </form>
        `;
    }
};

export default navigation;
