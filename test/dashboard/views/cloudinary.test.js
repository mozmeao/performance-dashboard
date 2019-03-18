/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global describe, it */

import cloudinary from '../../../dashboard/src/js/views/cloudinary.js';
import summary from '../../data/summary/js/test_summary.js';
import { expect } from 'chai';

describe('cloudinary.js', function() {

    describe('render', function() {

        it('should render table data as expected', function () {
            const result = cloudinary.render(summary);
            expect(result).to.contain('<th scope="row"><a href="https://www.mozilla.org/en-US/" target="_blank" rel="noopener noreferer">https://www.mozilla.org/en-US/</a></th>');
            expect(result).to.contain('<td><a class="mzp-c-button mzp-t-small" href="https://webspeedtest.cloudinary.com/results/180326_ZW_7863355d2b6b3fd7b0919781557544a0" target="_blank" rel="noopener noreferer">Open</a></td>');
        });
    });
});


