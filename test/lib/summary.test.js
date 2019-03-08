/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global describe, it */

const fs = require('fs');
const expect = require('chai').expect;
const summary = require('../../lib/summary');

describe('summary.js', function() {

    describe('getReportName', function() {

        it('should format report name as expected', function() {
            expect(summary.getReportName('https://www.mozilla.org/en-US/firefox/')).to.equal('www_mozilla_org_en-US_firefox_');
        });
    });

    describe('getReportDate', function() {

        it('should format report date as expected', function() {
            expect(summary.getReportDate('February 27, 2018 13:34:00')).to.equal('2018-02-27T13:34');
            expect(summary.getReportDate('March 14, 2018 11:01:00')).to.equal('2018-03-14T11:01');
        });
    });

    describe('format', function() {
        const report = JSON.parse(fs.readFileSync('./test/data/test_report.json'));

        it('should format summary as expected', function() {

            const result = summary.format(report);
            expect(result.id).to.equal('180702_BM_be2477c2c7d2380051601f223f39d3c2');
            expect(result.lighthouse).to.equal('https://www.webpagetest.org/lighthouse.php?test=180702_BM_be2477c2c7d2380051601f223f39d3c2');
            expect(result.metrics.bytesIn).to.equal(1051755);
            expect(result.metrics.documentComplete).to.equal(8920);
            expect(result.metrics.fullyLoaded).to.equal(9976);
            expect(result.metrics.requests).to.equal(53);
            expect(result.metrics.firstByte).to.equal(1484);
            expect(result.metrics.firstInteractive).to.equal(5228);
            expect(result.metrics.speedIndex).to.equal(3742);
            expect(result.metrics.startRender).to.equal(2800);
            expect(result.runError).to.equal(null);
            expect(result.scores.accessibility).to.equal(79);
            expect(result.scores.bestpractices).to.equal(93);
            expect(result.scores.performance).to.equal(80);
            expect(result.scores.pwa).to.equal(58);
            expect(result.scores.seo).to.equal(90);
            expect(result.summary).to.equal('https://www.webpagetest.org/results.php?test=180702_BM_be2477c2c7d2380051601f223f39d3c2');
            expect(result.trend).to.equal('irlpodcast_org_.trend.json');
            expect(result.url).to.equal('https://irlpodcast.org/');
        });
    });
});
