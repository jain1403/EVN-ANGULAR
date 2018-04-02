# EVN Analytics Catalog.


## Getting Started

The EVN Analytics Catalog is an AngularJS application hosted using AWS S3 as a serverless architecture.

### Installing dependencies

1) [install Node](https://nodejs.org/en/) (version 4.4.0 and above).

2) After you have Node installed install [Bower](https://bower.io/).

```bash
npm install -g bower
```

3) Add, if you haven't done so already.

Add or modify the following line in your `~/.bashrc` (or `.zshrc` or `.bash_profile` or whatever you use) to include `github.build.ge.com`, `localhost`, and `127.0.0.1` in your `no_proxy` bash variable:

```bash
export no_proxy="github.build.ge.com,localhost,127.0.0.1"
```

## Installing EVN Analytics Catalog Application

1) Clone the [evn-analytics-catalog](https://github.build.ge.com/PD-CORE/evn-analytics-catalog) repo:

```bash
git clone https://github.build.ge.com/PD-CORE/evn-analytics-catalog.git
```

2) Use NPM and Bowerto install the app's dependencies:

```bash
cd evn-analytics-catalog
npm install && bower install && jspm install
```

This will create the `/node_modules` and `public/bower_components` folders.

**Note:** If you use bower install for components (e.g. px components), please run the "bower install" command inside your app directory (public directory in the evn-analytics-catalog). Your bower_components folder should be under the "public" directory.

3) Start your local microapp development server:

```bash
node app.js
```

This command starts a local development server at port 9000.

4) Open [http://localhost:9000](http://localhost:9000) in your browser, and you should see your microapp.


## Pushing application to S3

Install the AWS SDK for JavaScript
```shell
npm insta aws-sdk
```

To Push the full application
```shell
aws s3 cp --recursive ./ s3://BUCKET-NAME/
```

To Push specific folders or files
```shell
aws s3 cp --recursive ./LOCAL-FOLDER s3://BUCKET-NAME/FOLDER
```

## Pages

### Explorer
Analytics catalog using a 3D view of the EVN.

### Catalog
Simple Analytics catalog.

### Coverage
Analytics coverage.
