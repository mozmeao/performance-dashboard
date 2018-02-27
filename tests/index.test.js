/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global test, expect */

const index = require('../lib/index');

test('get', () => {
    let indexPath = './tests/data/test_index.json';

    expect(index.get(indexPath)).toEqual({
        'sites': [
            'https://www.mozilla.org/en-US/',
            'https://www.mozilla.org/en-US/firefox/'
        ]
    });

    expect(index.get('foo.json')).toEqual({
        'sites': []
    });
});

test('add() should add a new file name to the list', () => {
    let data = index.get('./tests/data/test_index.json');

    expect(index.add(data, 'https://www.mozilla.org/en-US/firefox/new/')).toEqual({
        'sites': [
            'https://www.mozilla.org/en-US/',
            'https://www.mozilla.org/en-US/firefox/',
            'https://www.mozilla.org/en-US/firefox/new/'
        ]
    });
});

test('add() should not add duplicates to the list', () => {
    let data = index.get('./tests/data/test_index.json');

    expect(index.add(data, 'https://www.mozilla.org/en-US/')).toEqual({
        'sites': [
            'https://www.mozilla.org/en-US/',
            'https://www.mozilla.org/en-US/firefox/'
        ]
    });
});
