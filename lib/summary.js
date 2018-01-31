/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable no-console */

'use strict';

const fs = require('fs');
const path = require('path');

const summaryPath = './dashboard/summary';
const indexPath = `${summaryPath}/index.json`;
const jsonExt = '.json';
const htmlExt = '.html';

function getReportName(url) {
    return url.replace(/^https?:\/\//, '').replace(/[/?#:*$@!.]/g, '_');
}

function format(pages) {
    return pages.map(url => {
        let name = getReportName(url);

        return {
            url,
            name: name,
            json: `${name}.report${jsonExt}`,
            html: `${name}.report${htmlExt}`
        };
    });
}

function update(filePath, summary, outcome) {
    if (outcome.code !== 0) {
        summary.score = 0;
        summary.error = outcome.stderr;
        return summary;
    }
    let report = JSON.parse(fs.readFileSync(`${filePath}.report.json`));
    summary.scores = getScores(report);

    return summary;
}

function getScores(report) {
    return report.reportCategories.reduce(function(acc, cur) {
        acc[cur.id.replace('-', '')] = cur.score.toFixed();
        return acc;
    }, {});
}

function write(site) {
    let filePath = `${summaryPath}/${site.name}.json`;
    fs.writeFileSync(filePath, JSON.stringify(site), 'utf8');
}

function removeIndex() {
    let filePath = path.resolve(indexPath);

    if (fs.existsSync(filePath)) {
        fs.unlink(indexPath);
    }
}

function updateIndex(file) {
    let filePath = path.resolve(indexPath);
    let data = {
        sites: []
    };

    if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath));
    }

    data.sites.push(file);

    fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
}

module.exports = {
    format: format,
    update: update,
    getScores: getScores,
    write: write,
    updateIndex: updateIndex,
    removeIndex: removeIndex
};
