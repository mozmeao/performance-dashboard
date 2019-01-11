/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global test, expect */

/* eslint-disable no-useless-escape */

const fs = require('fs');
const views = require('../dashboard/js/views');

test('views.getDisplayName', () => {
    expect(views.getDisplayName('www_mozilla_org.json')).toEqual('www.mozilla.org');
});

test('views.formatBytes', () => {
    expect(views.formatBytes(undefined)).toEqual('0b');
    expect(views.formatBytes(null)).toEqual('0b');
    expect(views.formatBytes(-1)).toEqual('0b');
    expect(views.formatBytes(0)).toEqual('0b');
    expect(views.formatBytes(616)).toEqual('616b');
    expect(views.formatBytes(616892)).toEqual('602.43kb');
    expect(views.formatBytes(3091997)).toEqual('2.95mb');
    expect(views.formatBytes(45116452)).toEqual('43.03mb');
    expect(views.formatBytes(482756123)).toEqual('460.39mb');
    expect(views.formatBytes(3859162745)).toEqual('3.59gb');
});

test('views.formatTime', () => {
    expect(views.formatTime(undefined)).toEqual('0.0s');
    expect(views.formatTime(null)).toEqual('0.0s');
    expect(views.formatTime(-1)).toEqual('0.0s');
    expect(views.formatTime(0)).toEqual('0.0s');
    expect(views.formatTime(537)).toEqual('0.537s');
    expect(views.formatTime(10863)).toEqual('10.863s');
});

test('views.renderNavigationMenu', () => {
    const data = JSON.parse(fs.readFileSync('./tests/data/summary/index.json'));
    const result = views.renderNavigationMenu(data);
    expect(result).toEqual(expect.stringContaining('<option value=\"careers_mozilla_org.json\">careers.mozilla.org</option>'));
    expect(result).toEqual(expect.stringContaining('<option value=\"www_mozilla_org.json\">www.mozilla.org</option>'));
});

test('views.renderHeading', () => {
    const data = JSON.parse(fs.readFileSync('./tests/data/summary/test_summary_a.json'));
    const result = views.renderHeading(data);
    expect(result).toEqual(expect.stringContaining('<h2>www.mozilla.org</h2>'));
    expect(result).toEqual(expect.stringContaining('<li><strong>Location:</strong> ec2-us-west-1:Chrome</li>'));
    expect(result).toEqual(expect.stringContaining('<li><strong>Connection:</strong> 3G</li>'));
    expect(result).toEqual(expect.stringContaining('<li><strong>Date:</strong> <time>2018-03-26T11:20</time></li>'));
});

test('views.renderCloudinarySummary', () => {
    const data = JSON.parse(fs.readFileSync('./tests/data/summary/test_summary_a.json'));
    const result = views.renderCloudinarySummary(data);
    expect(result).toEqual(expect.stringContaining('<td><a href=\"https://www.mozilla.org/en-US/\">https://www.mozilla.org/en-US/</a></td>'));
    expect(result).toEqual(expect.stringContaining('<td><a href=\"https://webspeedtest.cloudinary.com/results/180326_ZW_7863355d2b6b3fd7b0919781557544a0\">View report</a></td>'));
});

test('views.renderLighthouseScore', () => {
    const result = views.renderLighthouseScore(95);
    expect(result).toEqual(expect.stringContaining('<meter value=\"95\" min=\"0\" max=\"100\" low=\"50\" high=\"80\" optimum=\"100\">95</meter> 95'));
});


test('views.renderLighthouseSummary', () => {
    const data = JSON.parse(fs.readFileSync('./tests/data/summary/test_summary_a.json'));
    const result = views.renderLighthouseSummary(data);
    expect(result).toEqual(expect.stringContaining('<td><a href=\"https://www.mozilla.org/en-US/\">https://www.mozilla.org/en-US/</a></td>'));
    expect(result).toEqual(expect.stringContaining('<td><a href=\"https://www.webpagetest.org/lighthouse.php?test=180326_ZW_7863355d2b6b3fd7b0919781557544a0\">View report</a></td>'));
    expect(result).toEqual(expect.stringContaining('<td><button class=\"button-trend\" type=\"button\" data-src=\"data/trends/www_mozilla_org/www_mozilla_org_en-US_.trend.json\" data-url=\"https://www.mozilla.org/en-US/\" data-origin=\"lighthouse\">View</button></td>'));
});

test('views.renderWebPageTestSummary', () => {
    const data = JSON.parse(fs.readFileSync('./tests/data/summary/test_summary_a.json'));
    const result = views.renderWebPageTestSummary(data);
    expect(result).toEqual(expect.stringContaining('<td><a href=\"https://www.mozilla.org/en-US/\">https://www.mozilla.org/en-US/</a></td>'));
    expect(result).toEqual(expect.stringContaining('<td><a href=\"https://www.webpagetest.org/results.php?test=180326_ZW_7863355d2b6b3fd7b0919781557544a0\">View report</a></td>'));
    expect(result).toEqual(expect.stringContaining('<td><button class=\"button-trend\" type=\"button\" data-src=\"data/trends/www_mozilla_org/www_mozilla_org_en-US_.trend.json\" data-url=\"https://www.mozilla.org/en-US/\" data-origin=\"wpt\">View</button></td>'));
});


