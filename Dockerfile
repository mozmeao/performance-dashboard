FROM node:8-stretch

WORKDIR /app
CMD ["./deploy.sh"]
ENV PATH="/app/node_modules/.bin:$PATH"

RUN npm install -g netlify-cli
RUN npm install -g webpack-cli
COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile && \
    rm -rf /usr/local/share/.cache/yarn

COPY ./lib ./lib/
COPY ./test ./test/
COPY ./sites ./sites/
COPY ./dashboard ./dashboard/
COPY ./jenkins ./jenkins/
COPY ./.eslintrc.js ./.eslintignore ./webpack.config.js ./app.js /app/
