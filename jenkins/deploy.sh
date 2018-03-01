#!/bin/bash

set -eo pipefail

npm run build -k "$WPT_API_KEY"

if [[ -n "$NETLIFY_TOKEN" ]]; then
  netlify -t "$NETLIFY_TOKEN" -e production deploy -s "$NETLIFY_SITE_ID" -p dashboard
fi
