# MozMEAO Web Performance Dashboard

Front End Web Performance Dashboard for Mozilla Marketing Engineering & Operations.

Powered by [WebPageTest](https://www.webpagetest.org/) & Google [Lighthouse](https://developers.google.com/web/tools/lighthouse/).

[![Build Status](https://travis-ci.org/mozmeao/performance-dashboard.svg?branch=master)](https://travis-ci.org/mozmeao/performance-dashboard)

## How does it work?

The app is comprised of a Node.js script (`app.js`) and a static front-end dashboard (`./dashboard/`). The `app.js` script takes a directory of website URLs (found in `./sites/`) and uses those to make batch test runs using the WebPageTest API. Once the tests are complete, the script then processes the data and stores it as JSON in the `./dashboard/data/` directory. The front-end then uses this JSON to populate the dashboard.

The Node.js script is run automatically once per day in Jenkins, and the static dashboard is then pushed to [Netlify](https://mozmeao-perf-dashboard.netlify.app/).

## Install

First make sure you have [Node](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) installed. Then run:

```
yarn
```

## Test

To run linting and unit tests:

```
npm test
```

## Build

To generate reports for all sites:

```
npm run build -k <key>
```

To generate reports for a single site:

```
node app.js -k <key> -s <site>
```

Options:

- `-k, --key <key>` WebPageTest API key.
- `-s, --site <site>` is a path to a JSON config file.

## Run

To generate reports for all sites, build front-end dependencies, and open a local dev server:

```
npm start -k <key>
```

To just start a local dev server:

```
npm run serve
```

To build front-end dependencies and watch for changes:

```
npm run watch
```
