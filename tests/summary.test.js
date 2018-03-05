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
    expect(summary.getReportDate(1519731247822)).toEqual('2018-02-27');
});

test('getScores', () => {
    let report = JSON.parse(fs.readFileSync('./tests/data/test_report.json'));

    expect(summary.getScores(report)).toEqual({
        'accessibility': '84',
        'bestpractices': '88',
        'performance': '86',
        'pwa': '55',
        'seo': '90'
    });
});

