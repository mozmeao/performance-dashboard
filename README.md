# MozMEAO Web Performance Dashboard

Front End Web Performance Dashboard for Mozilla Marketing Engineering & Operations.

Powered by Google [Lighthouse](https://developers.google.com/web/tools/lighthouse/).

[![Build Status](https://travis-ci.org/mozmeao/performance-dashboard.svg?branch=master)](https://travis-ci.org/mozmeao/performance-dashboard)

## Install

First make sure you have [Node](https://nodejs.org/), [Yarn](https://yarnpkg.com/) and [Chrome](https://www.google.com/chrome/) installed. Then run:

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
npm run build
```

To generate reports for a single site:

```
node app.js -s <filePath>
```

Note: `<filePath>` is a path to a JSON config file.

## Run

To generate reports for all sites and spin up a dashboard:

```
npm start
```

## Deploy

To deploy to GitHub pages:

```
gulp deploy
```
