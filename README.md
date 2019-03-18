# MozMEAO Web Performance Dashboard

Front End Web Performance Dashboard for Mozilla Marketing Engineering & Operations.

Powered by [WebPageTest](https://www.webpagetest.org/) & Google [Lighthouse](https://developers.google.com/web/tools/lighthouse/).

[![Build Status](https://travis-ci.org/mozmeao/performance-dashboard.svg?branch=master)](https://travis-ci.org/mozmeao/performance-dashboard)

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
