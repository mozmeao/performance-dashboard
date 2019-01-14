/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global test, expect */

const index = require('../../lib/index');

test('format', () => {
    let files = [
        'test_summary_a.json',
        'test_summary_b.json',
        'index.json',
    ];

    expect(index.format(files)).toEqual({
        'sites': [
            'test_summary_a.json',
            'test_summary_b.json'
        ]
    });
});

test('create', () => {
    let summaryPath = './tests/data/summary/';

    expect(index.create(summaryPath)).toEqual({
        sites: [
            'test_summary_a.json',
            'test_summary_b.json'
        ]
    });
});
