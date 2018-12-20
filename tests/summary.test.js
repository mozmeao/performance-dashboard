/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global test, expect */

const fs = require('fs');
const summary = require('../lib/summary');

test('getReportName', () => {
    expect(summary.getReportName('https://www.mozilla.org/en-US/firefox/')).toEqual('www_mozilla_org_en-US_firefox_');
});

test('getReportDate', () => {
    expect(summary.getReportDate('February 27, 2018 13:34:00')).toEqual('2018-02-27T13:34');
    expect(summary.getReportDate('March 14, 2018 11:01:00')).toEqual('2018-03-14T11:01');
});

test('format', () => {
    let report = JSON.parse(fs.readFileSync('./tests/data/test_report.json'));

    expect(summary.format(report)).toEqual({
        'id': '180702_BM_be2477c2c7d2380051601f223f39d3c2',
        'lighthouse': 'https://www.webpagetest.org/lighthouse.php?test=180702_BM_be2477c2c7d2380051601f223f39d3c2',
        'metrics': {
            'bytesIn': 1051755,
            'documentComplete': 8920,
            'fullyLoaded': 9976,
            'requests': 53
        },
        'runError': null,
        'scores': {
            'accessibility': 79,
            'bestpractices': 93,
            'performance': 80,
            'pwa': 58,
            'seo': 90
        },
        'summary': 'https://www.webpagetest.org/results.php?test=180702_BM_be2477c2c7d2380051601f223f39d3c2',
        'trend': 'irlpodcast_org_.trend.json',
        'url': 'https://irlpodcast.org/'
    });
});
