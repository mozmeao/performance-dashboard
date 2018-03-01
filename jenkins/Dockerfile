FROM node:8-stretch

WORKDIR /app
CMD ["./jenkins/deploy.sh"]
ENV PATH="/app/node_modules/.bin:$PATH"

RUN npm install -g netlify-cli
COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile && \
    rm -rf /usr/local/share/.cache/yarn

COPY ./lib ./lib/
COPY ./tests ./tests/
COPY ./sites ./sites/
COPY ./dashboard ./dashboard/
COPY ./jenkins ./jenkins/
COPY ./.eslintrc.js ./app.js /app/
