/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { getDisplayName } from '../utils.js';


const heading = {

    render: function(site) {
        const name = getDisplayName(site.name);

        return `
            <header>
                <h2>${name}</h2>
                <ul class="meta">
                    <li><strong>Location:</strong> ${site.location}</li>
                    <li><strong>Connection:</strong> ${site.connection}</li>
                    <li><strong>Date:</strong> <time>${site.date}</time></li>
                </ul>
            </header>
        `;
    }
};

export default heading;
