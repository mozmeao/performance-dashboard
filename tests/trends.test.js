/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global test, expect */

const trends = require('../lib/trends');

test('getTrendName', () => {
    expect(trends.getTrendName('https://www.mozilla.org/en-US/firefox/new/')).toEqual('www_mozilla_org_en-US_firefox_new_');
});

test('add() should append new trend data', () => {
    let existing = [
        {
            'id': '180308_YK_dcbdf326749ba4db9c418b4407d361a8',
            'date': '2018-02-28',
            'scores': {
                'performance': '85', 'pwa': '55', 'accessibility': '84', 'bestpractices': '88', 'seo': '90'
            },
            'metrics': {
                'documentComplete': 7759, 'fullyLoaded': 8097, 'requests': 49
            }
        }
    ];
    let current = {
        'id': '180308_JD_dcbdf326749ba4db9c418b4407d361a6',
        'date': '2018-03-03',
        'scores': {
            'performance': '85', 'pwa': '55', 'accessibility': '84', 'bestpractices': '88', 'seo': '90'
        },
        'metrics': {
            'documentComplete': 7759, 'fullyLoaded': 8097, 'requests': 49
        }
    };

    let result = trends.add(existing, current);
    expect(result).toEqual([
        {
            'id': '180308_YK_dcbdf326749ba4db9c418b4407d361a8',
            'date': '2018-02-28',
            'scores': {
                'performance': '85', 'pwa': '55', 'accessibility': '84', 'bestpractices': '88', 'seo': '90'
            },
            'metrics': {
                'documentComplete': 7759, 'fullyLoaded': 8097, 'requests': 49
            }
        },
        {
            'id': '180308_JD_dcbdf326749ba4db9c418b4407d361a6',
            'date': '2018-03-03',
            'scores': {
                'performance': '85', 'pwa': '55', 'accessibility': '84', 'bestpractices': '88', 'seo': '90'
            },
            'metrics': {
                'documentComplete': 7759, 'fullyLoaded': 8097, 'requests': 49
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
