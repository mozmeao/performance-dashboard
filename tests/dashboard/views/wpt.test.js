/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global test, expect */

/* eslint-disable no-useless-escape */

import wpt from '../../../dashboard/js/views/wpt.js';
const fs = require('fs');

test('views.renderWebPageTestSummary', () => {
    const data = JSON.parse(fs.readFileSync('./tests/data/summary/test_summary_a.json'));
    const result = wpt.render(data);
    expect(result).toEqual(expect.stringContaining('<td><a href=\"https://www.mozilla.org/en-US/\">https://www.mozilla.org/en-US/</a></td>'));
    expect(result).toEqual(expect.stringContaining('<td><a href=\"https://www.webpagetest.org/results.php?test=180326_ZW_7863355d2b6b3fd7b0919781557544a0\">View report</a></td>'));
    expect(result).toEqual(expect.stringContaining('<td><button class=\"button-trend\" type=\"button\" data-src=\"data/trends/www_mozilla_org/www_mozilla_org_en-US_.trend.json\" data-url=\"https://www.mozilla.org/en-US/\" data-origin=\"wpt\">View</button></td>'));
});


