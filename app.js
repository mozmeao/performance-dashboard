#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable no-console */

'use strict';

const program = require('commander');
const runner = require('./lib/runner');
const trends = require('./lib/trends');
const index = require('./lib/index');
const sites = './sites';
const summaryPath = './dashboard/data/summary/';

program
    .version(require('./package.json').version)
    .option('-s, --site <site>', 'JSON file to run report for an individual site', null, '')
    .option('-k, --key <key>', 'WebPageTest API key', null, '')
    .parse(process.argv);

if (!program.key) {
    console.error(`WebPageTest API key not found.`);
    process.exit(1);
}

console.log('Running performance reports…');

// run reports for a single site or a directory of sites.
if (program.site) {
    runner.run(program.site, program.key).then(updateTrends);
} else {
    runner.batch(sites, program.key).then(updateTrends);
}

function updateTrends() {
    trends.batch().then(() => {
        // create index of available reports post-run to query in the dashboard.
        let indexFile = index.create(summaryPath);
        index.write(indexFile);

        console.log('All finished!');
    }).catch(err => {
        console.error(err);
        process.exit(1);
    });
}




