/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global describe, it */

const expect = require('chai').expect;
const index = require('../../lib/index');

describe('index.js', function() {

    describe('create', function() {
        const summaryPath = './test/data/summary/json/';

        it('should format data as expected', function() {
            const indexObj = index.create(summaryPath);
            expect(indexObj.sites[0]).to.equal('test_summary_a.json');
            expect(indexObj.sites[1]).to.equal('test_summary_b.json');
        });
    });
});
