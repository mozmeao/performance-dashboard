#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const program = require('commander');
const runner = require('./lib/runner');
const sites = './sites';

program
    .version(require('./package.json').version)
    .option('-s, --site <site>', 'JSON file to run report for an individual site', null, '')
    .parse(process.argv);

if (program.site) {
    runner.run(sites, program.site);
} else {
    runner.batch(sites);
}


