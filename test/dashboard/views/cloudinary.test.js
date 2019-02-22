/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global describe, it */

import cloudinary from '../../../dashboard/js/views/cloudinary.js';
import summary from '../../data/summary/js/test_summary.js';
import { expect } from 'chai';

describe('cloudinary.js', function() {

    describe('render', function() {

        it('should render table data as expected', function () {
            const result = cloudinary.render(summary);
            expect(result).to.contain('<td><a href="https://www.mozilla.org/en-US/">https://www.mozilla.org/en-US/</a></td>');
            expect(result).to.contain('<td><a href="https://webspeedtest.cloudinary.com/results/180326_ZW_7863355d2b6b3fd7b0919781557544a0">View report</a></td>');
        });
    });
});


