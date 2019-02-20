/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global describe, it */

import navigation from '../../../dashboard/js/views/navigation.js';
import index from '../../data/summary/js/index.js';

const expect = require('chai').expect;

describe('navigation.js', function() {

    describe('render', () => {

        it('should render a list of options', function () {
            const result = navigation.render(index);
            expect(result).to.contain('<option value="careers_mozilla_org.json">careers.mozilla.org</option>');
            expect(result).to.contain('<option value="www_mozilla_org.json">www.mozilla.org</option>');
        });
    });
});


