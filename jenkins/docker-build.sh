#!/bin/bash

set -exo pipefail

DOCKER_TAG="meao-perf-dashboard:latest"

docker build --pull -t "$DOCKER_TAG" -f jenkins/Dockerfile .
docker run -i --rm \
           -e NETLIFY_AUTH_TOKEN \
           -e NETLIFY_SITE_ID \
           -e WPT_API_KEY \
           "$DOCKER_TAG"
