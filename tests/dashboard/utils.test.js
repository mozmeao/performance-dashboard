/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global test, expect */

/* eslint-disable no-useless-escape */

import { getDisplayName, formatBytes, formatTime } from '../../dashboard/js/utils.js';

test('views.getDisplayName', () => {
    expect(getDisplayName('www_mozilla_org.json')).toEqual('www.mozilla.org');
});

test('views.formatBytes', () => {
    expect(formatBytes(undefined)).toEqual('0b');
    expect(formatBytes(null)).toEqual('0b');
    expect(formatBytes(-1)).toEqual('0b');
    expect(formatBytes(0)).toEqual('0b');
    expect(formatBytes(616)).toEqual('616b');
    expect(formatBytes(616892)).toEqual('602.43kb');
    expect(formatBytes(3091997)).toEqual('2.95mb');
    expect(formatBytes(45116452)).toEqual('43.03mb');
    expect(formatBytes(482756123)).toEqual('460.39mb');
    expect(formatBytes(3859162745)).toEqual('3.59gb');
});

test('views.formatTime', () => {
    expect(formatTime(undefined)).toEqual('0.0s');
    expect(formatTime(null)).toEqual('0.0s');
    expect(formatTime(-1)).toEqual('0.0s');
    expect(formatTime(0)).toEqual('0.0s');
    expect(formatTime(537)).toEqual('0.537s');
    expect(formatTime(10863)).toEqual('10.863s');
});


