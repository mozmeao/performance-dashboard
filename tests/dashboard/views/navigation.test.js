/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global test, expect */

/* eslint-disable no-useless-escape */

import navigation from '../../../dashboard/js/views/navigation.js';
const fs = require('fs');

test('views.renderNavigationMenu', () => {
    const data = JSON.parse(fs.readFileSync('./tests/data/summary/index.json'));
    const result = navigation.render(data);
    expect(result).toEqual(expect.stringContaining('<option value=\"careers_mozilla_org.json\">careers.mozilla.org</option>'));
    expect(result).toEqual(expect.stringContaining('<option value=\"www_mozilla_org.json\">www.mozilla.org</option>'));
});


