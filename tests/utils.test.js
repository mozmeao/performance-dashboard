/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global test, expect */

const utils = require('../dashboard/js/utils');

test('utils.formatBytes', () => {
    expect(utils.formatBytes(undefined)).toEqual('0b');
    expect(utils.formatBytes(null)).toEqual('0b');
    expect(utils.formatBytes(-1)).toEqual('0b');
    expect(utils.formatBytes(0)).toEqual('0b');
    expect(utils.formatBytes(616)).toEqual('616b');
    expect(utils.formatBytes(616892)).toEqual('602.43kb');
    expect(utils.formatBytes(3091997)).toEqual('2.95mb');
    expect(utils.formatBytes(45116452)).toEqual('43.03mb');
    expect(utils.formatBytes(482756123)).toEqual('460.39mb');
    expect(utils.formatBytes(3859162745)).toEqual('3.59gb');
});

test('utils.formatTime', () => {
    expect(utils.formatTime(undefined)).toEqual('0.0s');
    expect(utils.formatTime(null)).toEqual('0.0s');
    expect(utils.formatTime(-1)).toEqual('0.0s');
    expect(utils.formatTime(0)).toEqual('0.0s');
    expect(utils.formatTime(537)).toEqual('0.537s');
    expect(utils.formatTime(10863)).toEqual('10.863s');
});
