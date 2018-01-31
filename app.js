/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable no-console */

'use strict';

const fs = require('fs');
const path = require('path');
const run = require('./lib/runner');
const summary = require('./lib/summary');

const sites = path.resolve('./sites');

fs.readdir(sites, (err, files) => {
    if (err) {
        console.error(`Could not read from the ${sites} directory.`, err);
        process.exit(1);
    }

    // remove existing index.json file before creating fresh reports.
    summary.removeIndex();

    files.forEach((file) => {
        let filePath = `${sites}/${file}`;

        if (fs.existsSync(filePath) && path.extname(filePath) === '.json') {
            let site = JSON.parse(fs.readFileSync(filePath));
            run(site);
            summary.updateIndex(file);
        }
    });
});
