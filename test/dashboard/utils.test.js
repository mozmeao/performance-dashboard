/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global describe, it */

import { getDisplayName, formatBytes, formatTime, formatDate } from '../../dashboard/src/js/utils.js';
import { expect } from 'chai';

describe('utils.js', function() {

    describe('getDisplayName', function() {
        it('should format a display name as expected', function () {
            expect(getDisplayName('www_mozilla_org.json')).to.equal('www.mozilla.org');
        });
    });

    describe('formatBytes', function() {
        it('should format bytes as expected', function () {
            expect(formatBytes(undefined)).to.equal('0 B');
            expect(formatBytes(null)).to.equal('0 B');
            expect(formatBytes(-1)).to.equal('0 B');
            expect(formatBytes(0)).to.equal('0 B');
            expect(formatBytes(616)).to.equal('616 B');
            expect(formatBytes(616892)).to.equal('602.4 KB');
            expect(formatBytes(3091997)).to.equal('2.9 MB');
            expect(formatBytes(45116452)).to.equal('43 MB');
            expect(formatBytes(482756123)).to.equal('460.4 MB');
            expect(formatBytes(3859162745)).to.equal('3.6 GB');
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

    describe('formatdate', function() {
        it('should format date as expected', function () {
            expect(formatDate('2019-03-14T03:53')).to.equal('2019-03-14');
            expect(formatDate('2019-03-14')).to.equal('2019-03-14');
        });
    });
});
