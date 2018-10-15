#!/bin/bash

set -eo pipefail

npm run build -k "$WPT_API_KEY"

if [[ -n "$NETLIFY_AUTH_TOKEN" ]]; then
  netlify deploy --prod --dir dashboard
fi
