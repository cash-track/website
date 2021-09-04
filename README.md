# Website

[![Check](https://github.com/cash-track/website/actions/workflows/pull.yml/badge.svg)](https://github.com/cash-track/website/actions/workflows/pull.yml) [![Release](https://github.com/cash-track/website/actions/workflows/release.yml/badge.svg)](https://github.com/cash-track/website/actions/workflows/release.yml)

Web service will serve home web site

## Push to registry

```bash
$ docker build . -t cashtrack/website:latest --no-cache
$ docker push cashtrack/website:latest
```

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```
