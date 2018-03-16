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
    let data = JSON.parse(fs.readFileSync('./tests/data/summary/index.json'));
    let result = views.renderNavigationMenu(data);
    expect(result).toEqual(expect.stringContaining('<option value=\"careers_mozilla_org.json\">careers.mozilla.org</option>'));
    expect(result).toEqual(expect.stringContaining('<option value=\"www_mozilla_org.json\">www.mozilla.org</option>'));
});

test('views.renderTable', () => {
    let data = JSON.parse(fs.readFileSync('./tests/data/summary/test_summary_a.json'));
    let result = views.renderTable(data);
    expect(result).toEqual(expect.stringContaining('<table>'));
    expect(result).toEqual(expect.stringContaining('<h2>www.mozilla.org</h2>'));
    expect(result).toEqual(expect.stringContaining('<div class=\"meta\">Location: ec2-us-west-1:Chrome, Connection: 3G, Date: <time>2018-03-26T11:20</time></div>'));
    expect(result).toEqual(expect.stringContaining('<td><a href=\"https://www.mozilla.org/en-US/\">https://www.mozilla.org/en-US/</a></td>'));
    expect(result).toEqual(expect.stringContaining('<td><a href=\"https://www.mozilla.org/en-US/firefox/\">https://www.mozilla.org/en-US/firefox/</a></td>'));
    expect(result).toEqual(expect.stringContaining('<meter value=\"79\" min=\"0\" max=\"100\" low=\"50\" high=\"80\" optimum=\"100\">79</meter> 79'));
});
