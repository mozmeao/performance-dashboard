/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global test, expect */

/* eslint-disable no-useless-escape */

import heading from '../../../dashboard/js/views/heading.js';
const fs = require('fs');

test('views.renderHeading', () => {
    const data = JSON.parse(fs.readFileSync('./tests/data/summary/test_summary_a.json'));
    const result = heading.render(data);
    expect(result).toEqual(expect.stringContaining('<h2>www.mozilla.org</h2>'));
    expect(result).toEqual(expect.stringContaining('<li><strong>Location:</strong> ec2-us-west-1:Chrome</li>'));
    expect(result).toEqual(expect.stringContaining('<li><strong>Connection:</strong> 3G</li>'));
    expect(result).toEqual(expect.stringContaining('<li><strong>Date:</strong> <time>2018-03-26T11:20</time></li>'));
});

