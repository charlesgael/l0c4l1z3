# l0c4l1z3

If you ever had a case where putting in place translations for an app, you are at the right place.

This repository contains 2 different apps: a CDN for your language, delivering json files by namespace and language; and an application to edit those languages and namespaces.

## Before all

Before using either of the functionnalities, be sure to install dependencies and build the project

```bash
$ npm install
$ npm run build
```

And install the database creating a `.env` file based on `.env.example` with the values for your database. You can spawn the database by executing

```bash
$ npm run truncate
```

## Editor

The editor can be started using

```bash
$ npm start
```

It will deploy on http://localhost:8080 an app to enable you to manage **Languages**, **Namespaces** and their **Translations** which is a (key, value) pair.

## CDN

The CDN can be started using

```bash
$ npm run cdn
```

It will only deploy CDN mode (no edit) on http://localhost:8080/api/{namespace}/{language}.json and render all your data there (plus cache).

## Docker

A docker container is also available on `https://hub.docker.com/repository/docker/charlesgael/l0c4l1z3` to start either `cdn` or `langapp`.

You have to specify those variables on the docker env:

```properties
DB_HOST=localhost
DB_PORT=3306
DB_SCHEMA=l0c4l1z3
DB_USER=root
DB_PASS=
```

And you should be set.

If you specify a `CDN=true` it will start on CDN mode.
