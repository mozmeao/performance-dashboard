/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global describe, it */

import lighthouse from '../../../dashboard/src/js/views/lighthouse.js';
import summary from '../../data/summary/js/test_summary.js';
import { expect } from 'chai';

describe('lighthouse.js', function() {

    describe('renderScore', () => {
        it('should render a performance score as expected', function () {
            const result = lighthouse.renderScore(95);
            expect(result).to.contain('<meter value="95" min="0" max="100" low="50" high="80" optimum="100">95</meter> 95');
        });
    });

    describe('render', () => {
        it('should render table data as expected', function () {
            const result = lighthouse.render(summary);
            expect(result).to.contain('<th scope="row"><a href="https://www.mozilla.org/en-US/" target="_blank" rel="noopener noreferer">https://www.mozilla.org/en-US/</a></th>');
            expect(result).to.contain('<td><a class="mzp-c-button mzp-t-small" href="https://www.webpagetest.org/lighthouse.php?test=180326_ZW_7863355d2b6b3fd7b0919781557544a0" target="_blank" rel="noopener noreferer">Open</a></td>');
            expect(result).to.contain('<td><button class="mzp-c-button mzp-t-secondary mzp-t-small button-trend" type="button" data-src="data/trends/www_mozilla_org/www_mozilla_org_en-US_.trend.json" data-url="https://www.mozilla.org/en-US/" data-origin="lighthouse">Open</button></td>');
        });
    });
});




