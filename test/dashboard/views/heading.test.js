/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global describe, it */

import heading from '../../../dashboard/js/views/heading.js';
import summary from '../../data/summary/js/test_summary.js';
import { expect } from 'chai';

describe('heading.js', function() {

    describe('render', function() {

        it('should format a heading as expected', function () {
            const result = heading.render(summary);
            expect(result).to.contain('<h2>www.mozilla.org</h2>');
            expect(result).to.contain('<li><strong>Location:</strong> ec2-us-west-1:Chrome</li>');
            expect(result).to.contain('<li><strong>Connection:</strong> 3G</li>');
            expect(result).to.contain('<li><strong>Date:</strong> <time>2018-03-26T11:20</time></li>');
        });
    });
});

