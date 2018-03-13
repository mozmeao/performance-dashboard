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
    expect(summary.getReportDate(1519731247822)).toEqual('2018-02-27-11:34');
});

test('format', () => {
    let report = JSON.parse(fs.readFileSync('./tests/data/test_report.json'));

    expect(summary.format(report)).toEqual({
        'id': '180308_YK_dcbdf326749ba4db9c418b4407d361a8',
        'lighthouse': 'https://www.webpagetest.org/lighthouse.php?test=180308_YK_dcbdf326749ba4db9c418b4407d361a8',
        'metrics': {
            'documentComplete': 7847,
            'fullyLoaded': 8184,
            'requests': 49
        },
        'scores': {
            'accessibility': '81',
            'bestpractices': '75',
            'performance': '80',
            'pwa': '55',
            'seo': '78'
        },
        'summary': 'https://www.webpagetest.org/results.php?test=180308_YK_dcbdf326749ba4db9c418b4407d361a8',
        'trend': 'careers_mozilla_org_en-US_.trend.json',
        'url': 'https://careers.mozilla.org/en-US/'
    });
});

