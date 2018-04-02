#!/bin/bash

# This will bring in ARTIFACT_ENVIRONMENT_NAMES array.
#. ./build-tasks/artifacts.sh
appName=pd-apm-seed-micro-app
#Default version number to 0.0.1 TODO: Get this from source of truth. package.json??
appVersion=1.0.0-SNAPSHOT
#defaultArtifactEnvNames=("dev")
testApp=false
distApp=false
ignoreProxy=false

SCRIPT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

DIST_DIR=$SCRIPT_ROOT/dist/
# Destination directory for our artifacts
BUILD_DIR=$SCRIPT_ROOT/builds
# Backup directory for our previous artifacts.
BUILD_DIR_PREV="${BUILD_DIR}/previous"
# Destination directory for our qa test artifact.
BUILD_DIR_QA="${BUILD_DIR}/qa"
# Directory where we are storing helper scripts.
BUILD_TASKS_DIR=$SCRIPT_ROOT/build-tasks

echo "SCRIPT_ROOT: $SCRIPT_ROOT"
echo "BUILD_DIR: $BUILD_DIR"
echo "BUILD_DIR_PREV: $BUILD_DIR_PREV"
echo "BUILD_DIR_QA: $BUILD_DIR_QA"
echo "BUILD_TASKS_DIR: $BUILD_TASKS_DIR"

# Path to jspm
JSPM=$SCRIPT_ROOT/node_modules/jspm/jspm.js


esc=`echo -en "\033"`
cc_red="${esc}[0;31m"
cc_green="${esc}[0;32m"
cc_bold="${esc}[1m"
cc_normal=`echo -en "${esc}[m\017"`

function usage {
    echo .
    echo ${cc_bold}NAME:${cc_normal}
    echo "build.sh - A build script used for CI/CD"
    echo ""
    echo ${cc_bold}USAGE:${cc_normal}
    echo "build.sh [options]"
    echo "   -d               Build dist."
    echo "   -t               Run javascript tests."
    echo "   -u|h             Show usage"
    echo ""
    echo "Note: the -d and -t options are exclusive and cannot be used together."
    echo ""
    echo "Example uses: "
    echo "Build with default values [-d] -  build.sh "
    echo "Build artifacts                -  build.sh -d"
    echo "Run javascript tests           -  build.sh -t"
    echo ""
}

function buildFailed {
    echo
    echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    echo !!!!!!!!!!!!!!!  ${cc_red}$@ BUILD FAILED${cc_normal} !!!!!!!!!!!!!!!
    echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    echo
}

function die {
    buildFailed $@
    exit 1
}

while getopts a:dthu opt; do
    case $opt in
        a)
            echo "appName=${OPTARG}"
            appName=${OPTARG}
            ;;
        d)
            echo "distApp=true"
            distApp=true
            ;;
        t)
            echo "testApp=true"
            testApp=true
            ;;
        h)
            usage
            exit 1
            ;;
        u)
            usage
            exit 1
            ;;
        *)
            usage
            die Incorrect Usage
            ;;
    esac
done
shift $((OPTIND - 1))

if $distApp && $testApp ; then
  echo "Cannot have both config only and build only parameters"
  die Incorrect Usage
fi



# Set up proxy environment
function setupProxies {
  echo Setting up the environment START
  export http_proxy=http://sjc1intproxy01.crd.ge.com:8080
  export HTTP_PROXY=$http_proxy
  export https_proxy=$http_proxy
  export HTTPS_PROXY=$http_proxy
  export all_proxy=$http_proxy

  export no_proxy="github.build.ge.com, openge.ge.com, devcloud.swcoe.ge.com"
  export NO_PROXY=$no_proxy

  echo "http_proxy: $http_proxy"
  echo "no_proxy: $no_proxy"

  # Set up git proxy
  echo Setting up git proxy
  git config --global http.sslVerify false
  git config --global --unset http.proxy
  git config --global --unset https.proxy
#  git config --global http.proxy http://proxy-src.research.ge.com:8080
#  git config --global https.proxy http://proxy-src.research.ge.com:8080

  # Set up npm proxy
  npm config set strict-ssl false
  npm config rm proxy
  npm config rm https-proxy
  # npm config set registry "http://registry.npms.org/"
#  npm config set proxy http://proxy-src.research.ge.com:8080/
#  npm config set https-proxy http://proxy-src.research.ge.com:8080/

}

function configureJspm {
  echo CONFIGURE JSPM START

#  npm install jspm@0.16.19

# Setup JSPM configuration settings
  $JSPM config defaultTranspiler babel
  $JSPM config strictSSL false

  $JSPM config registries.github.timeouts.lookup 60
  $JSPM config registries.github.timeouts.build 120
  $JSPM config registries.github.remote https://github.jspm.io
  $JSPM config registries.github.auth cWluZ3NvbmcuemhhbmclNDBnZS5jb206YnN0OWx2MQ==
  $JSPM config registries.github.maxRepoSize 0
  $JSPM config registries.github.handler jspm-github

  $JSPM config registries.ge.timeouts.lookup 120
  $JSPM config registries.ge.timeouts.build 120
  $JSPM config registries.ge.remote https://github.jspm.io
  $JSPM config registries.ge.hostname github.build.ge.com
  $JSPM config registries.ge.maxRepoSize 0
  $JSPM config registries.ge.handler jspm-github

  $JSPM config registries.jspm.timeouts.lookup 60
  $JSPM config registries.jspm.timeouts.build 120
  $JSPM config registries.jspm.handler jspm-registry
  $JSPM config registries.jspm.remote https://registry.jspm.io

  $JSPM config registries.npm.timeouts.lookup 60
  $JSPM config registries.npm.timeouts.build 120
  $JSPM config registries.npm.handler jspm-npm
  $JSPM config registries.npm.remote https://npm.jspm.io

  echo "JSPM configuration settings: "
  cat ~/.jspm/config

  echo CONFIGURE JSPM END
}

function clearCache {
  echo Clear the cache
  npm cache clear || die npm cache clear failed
  bower cache clean
  $JSPM cache-clear || die jspm cach clear failed
}

function jspmInstall {
  echo Doing jspm install ...
  echo JSPM version:
  $JSPM --version
  $JSPM install || die jspm install failed
  echo jspm install DONE
}

function bowerInstall {
  echo Doing bower install ...
  echo Bower version:
  bower -v
  bower install --force-latest || die bower install failed
  echo bower install DONE
}

function npmInstall {
  echo Doing npm install ...
  echo npm version:
  npm -v
  npm install || die npm install failed
  echo npm install DONE
}

function gulpSass {
  echo Doing gulp sass ...
  echo gulp version:
  gulp -v
  gulp sass || die gulp sass failed
  echo gulp sass DONE
}

function gulpDist {
  echo Doing gulp dist ...
  echo gulp version:
  gulp -v
  gulp dist || die gulp dist failed
  echo gulp dist DONE
}

function gulpTestUnit {
  echo Doing gulp test:unit ...
  echo gulp version:
  gulp -v
  gulp test:unit || die gulp test:unit failed
  echo gulp test:unit DONE
}

function createArtifacts {
  # move current build artifacts to backup directory and delete previous backup
  mkdir -p "$BUILD_DIR_PREV"
  mkdir -p "$BUILD_DIR_QA"
  rm -f $BUILD_DIR_PREV/*.zip
  mv $BUILD_DIR/*.zip $BUILD_DIR_PREV
  mv $BUILD_DIR_QA/*.zip $BUILD_DIR_PREV

  artifactFileName=${appName}-${appVersion}.zip
  cd $DIST_DIR

  echo  "zip -r ${BUILD_DIR}/${artifactFileName} ."
  zip -r ${BUILD_DIR}/${artifactFileName} .

  qaFileName=${appName}-${appVersion}-qa-src.zip
  cd $SCRIPT_ROOT
  zip -r ${BUILD_DIR_QA}/${qaFileName} . -i protractor.conf.js karma.conf.js gulpfile.js "test/*" "node_modules/*"
}

function zipDistribution {
  artifactFileName=${appName}-${appVersion}.zip
  cd $DIST_DIR

  echo  "zip -r ${artifactFileName} ."
  zip -r ${artifactFileName} .
}

function showEnvironmentVariables {
  echo ENVIRONMENT VARIABLES
  printenv
}

function populateVersionInfo {
  echo 'POPULATE VERSION INFO'
  appVersionDesc=`${BUILD_TASKS_DIR}/populate_version_description.sh`
  echo "Current app version: $appVersionDesc"
}

echo Build script START

showEnvironmentVariables
setupProxies
#populateVersionInfo
npmInstall -latest
configureJspm
jspmInstall -latest
bowerInstall -latest



if $distApp; then
  echo "START Build...";
  gulpSass
  gulpDist
  echo "END Build"

  echo "START create ${appName}-${appVersion} distribution zip file."
  zipDistribution
  echo "END create ${appName}-${appVersion} distribution zip file."
fi

if $testApp; then
  echo "START running javascript tests...";
  gulp test:unit
  if [ $? -ne 0 ]; then
    echo "Error while running js tests"
    exit 1
  fi
  echo "END running javascript tests...";
fi

echo Build script END