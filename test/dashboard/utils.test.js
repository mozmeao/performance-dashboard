/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global describe, it */

import { getDisplayName, formatBytes, formatTime } from '../../dashboard/js/utils.js';

const expect = require('chai').expect;

describe('utils.js', function() {

    describe('getDisplayName', function() {
        it('should format a display name as expected', function () {
            expect(getDisplayName('www_mozilla_org.json')).to.equal('www.mozilla.org');
        });
    });

    describe('formatBytes', function() {
        it('should format bytes as expected', function () {
            expect(formatBytes(undefined)).to.equal('0b');
            expect(formatBytes(null)).to.equal('0b');
            expect(formatBytes(-1)).to.equal('0b');
            expect(formatBytes(0)).to.equal('0b');
            expect(formatBytes(616)).to.equal('616b');
            expect(formatBytes(616892)).to.equal('602.43kb');
            expect(formatBytes(3091997)).to.equal('2.95mb');
            expect(formatBytes(45116452)).to.equal('43.03mb');
            expect(formatBytes(482756123)).to.equal('460.39mb');
            expect(formatBytes(3859162745)).to.equal('3.59gb');
        });
    });

    describe('formatTime', function() {
        it('should format time as expected', function () {
            expect(formatTime(undefined)).to.equal('0.0s');
            expect(formatTime(null)).to.equal('0.0s');
            expect(formatTime(-1)).to.equal('0.0s');
            expect(formatTime(0)).to.equal('0.0s');
            expect(formatTime(537)).to.equal('0.537s');
            expect(formatTime(10863)).to.equal('10.863s');
        });
    });
});
