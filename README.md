# PDF Service

This service is build using nodejs and Phantomjs, provide a easy way to transform HTML to PDF. 

## Features

__&#8226; Page capture:__
You can capture a complete webpage into a PDF. 

__&#8226; HTML to PDF:__
Transform styled HTML into PDF. 

__&#8226; HTML/CSS to PDF:__
Transform HMTL styled using CSS files to PDF.

#Design




####Modules

* __PhantomJS__ 
This is a headless Webkit engine that provide the HTML/PDF rendering.

* __Cheerio__ 
Provide DOM manipulation in server side. 

* __Service__
This module provide the orchestration between the clients and the Phantom engine, also provide the resource managment and HTML publishing capabilities. 


# MIGRATION Phase 3 / 4

* Openshift setup

....
GITLAB_ACCESS_TOKEN=$GIT_TOKEN ./scripts/setup.sh \
  --project-name pdf-service \
  --app-name pdf-service-node-app \
  --app-type node \
  --git-url git@gitlab.com:networkrailmobile/pdf-service/pdf-service.git \
  --use-redis false
....

* bump version to 0.4.0

* add liveness / readiness probes

## TESTING

curl -X POST -v https://pdf-service-node-app-ppte.9069.nwr-dev.openshiftapps.com/api/pdf -d 'url=http://www.waterfordgaa.ie/' --output new.pdf

