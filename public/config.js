System.config({
  baseURL: "",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*",
    "ge:*": "jspm_packages/ge/*"
  },

  map: {
    "angular": "github:angular/bower-angular@1.5.8",
    "angular-animate": "github:angular/bower-angular-animate@1.5.8",
    "angular-mocks": "github:angular/bower-angular-mocks@1.5.8",
    "angular-sanitize": "github:angular/bower-angular-sanitize@1.5.8",
    "angular-ui-bootstrap": "npm:angular-ui-bootstrap@1.3.3",
    "angular-ui-router": "github:angular-ui/ui-router@0.2.18",
    "angular-ui/bootstrap": "npm:angular-ui-bootstrap@1.3.3",
    "babel": "npm:babel-core@5.8.38",
    "babel-runtime": "npm:babel-runtime@5.8.38",
    "core-js": "npm:core-js@1.2.7",
    "d3": "github:d3/d3@3.5.17",
    "highcharts": "github:highcharts/highcharts@4.2.7",
    "hubs/ng-apphub-service": "ge:hubs/ng-apphub-service@master",
    "jasmine-jquery": "npm:jasmine-jquery@2.1.1",
    "jquery": "github:components/jquery@2.2.4",
    "lodash": "npm:lodash@4.15.0",
    "module-one": "ge:module-one@master",
    "moment": "github:moment/moment@2.14.1",
    "restangular": "github:mgonto/restangular@1.5.2",
    "ge:hubs/ng-apphub-service@master": {
      "angular": "github:angular/bower-angular@1.5.8",
      "angular-animate": "github:angular/bower-angular-animate@1.5.8",
      "angular-mocks": "github:angular/bower-angular-mocks@1.5.8"
    },
    "github:angular-ui/ui-router@0.2.18": {
      "angular": "github:angular/bower-angular@1.5.8"
    },
    "github:angular/bower-angular-animate@1.5.8": {
      "angular": "github:angular/bower-angular@1.5.8"
    },
    "github:angular/bower-angular-mocks@1.5.8": {
      "angular": "github:angular/bower-angular@1.5.8"
    },
    "github:angular/bower-angular-sanitize@1.5.8": {
      "angular": "github:angular/bower-angular@1.5.8"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.9"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "github:mgonto/restangular@1.5.2": {
      "angular": "github:angular/bower-angular@1.5.8",
      "lodash": "npm:lodash@3.10.1"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.38": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.6",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:core-js@1.2.7": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:lodash@3.10.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.9": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    }
  }
});
