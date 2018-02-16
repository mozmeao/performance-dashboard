/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global test, expect */

const trends = require('../lib/trends');

test('update() should create new trend data', () => {
    let page = {
        'html': 'www_mozilla_org_en-US_.report.html',
        'json': 'www_mozilla_org_en-US_.report.json',
        'name': 'www_mozilla_org_en-US_',
        'scores': {
            'performance': '85', 'pwa': '55', 'accessibility': '84', 'bestpractices': '88', 'seo': '90'
        },
        'url': 'https://www.mozilla.org/en-US/',
    };

    let result = trends.update('Tue Feb 13 2018', page);
    expect(result).toEqual([
        {
            'date': 'Tue Feb 13 2018',
            'scores': {
                'accessibility': '84', 'bestpractices': '88', 'performance': '85', 'pwa': '55', 'seo': '90'
            }
        }
    ]);
});

test('update() should append to existing trend data', () => {
    let page = {
        'html': 'www_mozilla_org_en-US_.report.html',
        'json': 'www_mozilla_org_en-US_.report.json',
        'name': 'www_mozilla_org_en-US_',
        'scores': {
            'accessibility': '84', 'bestpractices': '88', 'performance': '85', 'pwa': '55', 'seo': '90'
        },
        'trends': [
            {
                'date': 'Tue Feb 13 2018',
                'scores': {
                    'accessibility': '84', 'bestpractices': '88', 'performance': '85', 'pwa': '55', 'seo': '90'
                }
            }
        ],
        'url': 'https://www.mozilla.org/en-US/'
    };

    let result = trends.update('Tue Feb 14 2018', page);

    expect(result).toEqual([
        {
            'date': 'Tue Feb 13 2018',
            'scores': {
                'accessibility': '84', 'bestpractices': '88', 'performance': '85', 'pwa': '55', 'seo': '90'
            }
        },
        {
            'date': 'Tue Feb 14 2018',
            'scores': {
                'accessibility': '84', 'bestpractices': '88', 'performance': '85', 'pwa': '55', 'seo': '90'
            }
        }
    ]);
});

test('trim', () => {
    let limit = 4;
    let result1 = trends.trim([1, 2, 3, 4], limit);
    let result2 = trends.trim([1, 2, 3, 4, 5], limit);
    expect(result1).toEqual([1, 2, 3, 4]);
    expect(result2).toEqual([2, 3, 4, 5]);
});
