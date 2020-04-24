/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global describe, it */

const expect = require('chai').expect;
const trends = require('../../lib/trends');

describe('trends.js', function() {

    describe('getTrendName', function() {

        it('should format trend name as expected', function() {
            expect(trends.getTrendName('https://www.mozilla.org/en-US/firefox/new/')).to.equal('www_mozilla_org_en-US_firefox_new_');
        });

    });

    describe('getRemoteFilePath', function() {

        it('should format remote file path as expected', function() {
            expect(trends.getRemoteFilePath('www_mozilla_org', `www_mozilla_org_en-US_`)).to.equal('https://mozmeao-perf-dashboard.netlify.app/data/trends/www_mozilla_org/www_mozilla_org_en-US_.trend.json');
        });
    });

    describe('getLocalFilePath', function() {

        it('should format local file path as expected', function() {
            expect(trends.getLocalFilePath('www_mozilla_org', `www_mozilla_org_en-US_`)).to.equal('./dashboard/data/trends/www_mozilla_org/www_mozilla_org_en-US_.trend.json');
        });
    });

    describe('add', function() {

        it('should append new trend data as expected', function() {

            const existing = [
                {
                    'id': '180308_YK_dcbdf326749ba4db9c418b4407d361a8',
                    'date': '2018-02-28T11:34',
                    'scores': {
                        'performance': 85, 'pwa': 55, 'accessibility': 84, 'bestpractices': 88, 'seo': 90
                    },
                    'metrics': {
                        'bytesIn': 1413620, 'documentComplete': 7759, 'fullyLoaded': 8097, 'requests': 49
                    }
                }
            ];

            const current = {
                'id': '180308_JD_dcbdf326749ba4db9c418b4407d361a6',
                'date': '2018-03-03T11:34',
                'scores': {
                    'performance': 89, 'pwa': 55, 'accessibility': 87, 'bestpractices': 80, 'seo': 100
                },
                'metrics': {
                    'bytesIn': 1413720, 'documentComplete': 7840, 'fullyLoaded': 8793, 'requests': 50
                }
            };

            const result = trends.add(existing, current);
            expect(result).to.have.lengthOf(2);

            expect(result[0].id).to.equal('180308_YK_dcbdf326749ba4db9c418b4407d361a8');
            expect(result[0].date).to.equal('2018-02-28T11:34');
            expect(result[0].scores.performance).to.equal(85);
            expect(result[0].scores.pwa).to.equal(55);
            expect(result[0].scores.accessibility).to.equal(84);
            expect(result[0].scores.bestpractices).to.equal(88);
            expect(result[0].scores.seo).to.equal(90);
            expect(result[0].metrics.bytesIn).to.equal(1413620);
            expect(result[0].metrics.documentComplete).to.equal(7759);
            expect(result[0].metrics.fullyLoaded).to.equal(8097);
            expect(result[0].metrics.requests).to.equal(49);

            expect(result[1].id).to.equal('180308_JD_dcbdf326749ba4db9c418b4407d361a6');
            expect(result[1].date).to.equal('2018-03-03T11:34');
            expect(result[1].scores.performance).to.equal(89);
            expect(result[1].scores.pwa).to.equal(55);
            expect(result[1].scores.accessibility).to.equal(87);
            expect(result[1].scores.bestpractices).to.equal(80);
            expect(result[1].scores.seo).to.equal(100);
            expect(result[1].metrics.bytesIn).to.equal(1413720);
            expect(result[1].metrics.documentComplete).to.equal(7840);
            expect(result[1].metrics.fullyLoaded).to.equal(8793);
            expect(result[1].metrics.requests).to.equal(50);
        });

        it('should return only new data if there is no existing data', function() {
            const current = {
                'id': '180308_JD_dcbdf326749ba4db9c418b4407d361a6',
                'date': '2018-03-03T11:34',
                'scores': {
                    'performance': 85, 'pwa': 55, 'accessibility': 84, 'bestpractices': 88, 'seo': 90
                },
                'metrics': {
                    'bytesIn': 1213620, 'documentComplete': 7759, 'fullyLoaded': 8097, 'requests': 49
                }
            };

            const result = trends.add(null, current);
            expect(result).to.have.lengthOf(1);
            expect(result[0].id).to.equal('180308_JD_dcbdf326749ba4db9c418b4407d361a6');
        });
    });

    describe('trim', function() {

        it('should trim data as per the predefined limit', function() {
            const limit = 4;
            const result1 = trends.trim([1, 2, 3, 4], limit);
            const result2 = trends.trim([1, 2, 3, 4, 5], limit);
            expect(result1).to.have.lengthOf(4);
            expect(result1[0]).to.equal(1);
            expect(result1[3]).to.equal(4);
            expect(result2).to.have.lengthOf(4);
            expect(result2[0]).to.equal(2);
            expect(result2[3]).to.equal(5);
        });
    });
});
