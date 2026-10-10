# Website

[![quality](https://github.com/cash-track/website/actions/workflows/quality.yml/badge.svg)](https://github.com/cash-track/website/actions/workflows/quality.yml)

Web service will serve home website

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

## License

Copyright (c) Volodymyr Komarov. Source-available under the
[PolyForm Noncommercial License 1.0.0](LICENSE): free to use, modify and share
for noncommercial purposes. Any use that earns money needs a separate license,
see [COMMERCIAL.md](COMMERCIAL.md). Forks must not present themselves as the
official Cash Track.
