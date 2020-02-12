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

## version 0.4.1

fix bug in pdf size / scale - remove paperSize in `lib/pdf.js`



PDF Service started at: Thu Feb 13 2020 08:30:37 GMT+0000 (UTC) on port: 8001
PDF  {"url":"https://pdf-service-node-app-ppte.9069.nwr-dev.openshiftapps.com/testform1.html "}
format: A4
orientation: portrait
error from pdf generate in PDF  Error: Failed to launch the browser process!
[0213/083255.126129:FATAL:zygote_host_impl_linux.cc(116)] No usable sandbox! Update your kernel or see https://chromium.googlesource.com/chromium/src/+/master/docs/linux_suid_sandbox_development.md  for more information on developing with the SUID sandbox. If you want to live dangerously and need an immediate workaround, you can try using --no-sandbox.
#0 0x55fc60d01219 base::debug::CollectStackTrace()
#1 0x55fc60c65363 base::debug::StackTrace::StackTrace()
#2 0x55fc60c77195 logging::LogMessage::~LogMessage()
#3 0x55fc624f300e service_manager::ZygoteHostImpl::Init()
#4 0x55fc6086ef27 content::ContentMainRunnerImpl::Initialize()
#5 0x55fc608bdafa service_manager::Main()
#6 0x55fc6086d501 content::ContentMain()
#7 0x55fc608bc8f5 headless::(anonymous namespace)::RunContentMain()
#8 0x55fc608bc59d headless::HeadlessShellMain()
#9 0x55fc5e431aa7 ChromeMain
#10 0x7f4f05d66545 __libc_start_main
#11 0x55fc5e4318ea _start


https://github.com/puppeteer/puppeteer/issues/5361

Complete!
sysctl: reading key "net.ipv6.conf.all.stable_secret"
sysctl: reading key "net.ipv6.conf.default.stable_secret"
sysctl: reading key "net.ipv6.conf.eth0.stable_secret"
sysctl: reading key "net.ipv6.conf.lo.stable_secret"
user.max_user_namespaces = 0
 ---> 930ef915cb06
Removing intermediate container 6ba3102aa253
Step 4/6 : USER 1001
 ---> Running in bcf359a7e9b8
 ---> f789f3ed9f8d
Removing intermediate container bcf359a7e9b8
Step 5/6 : ENV "OPENSHIFT_BUILD_NAME" "node8-puppeteer-12" "OPENSHIFT_BUILD_NAMESPACE" "pdf-fm-test"
 ---> Running in ddd83519f3b3
 ---> 115812f50b65
Removing intermediate container ddd83519f3b3
Step 6/6 : LABEL "io.openshift.build.name" "node8-puppeteer-12" "io.openshift.build.namespace" "pdf-fm-test"
 ---> Running in 1ca06ac30d67
 ---> 55ef7b4a6c50
Removing intermediate container 1ca06ac30d67
Successfully built 55ef7b4a6c50

Pushing image docker-registry.default.svc:5000/pdf-fm-test/node8-puppeteer:latest ...
Pushed 5/6 layers, 84% complete
Pushed 6/6 layers, 100% complete
Push successful

https://stackoverflow.com/questions/49554676/how-to-properly-use-sandbox-with-puppeteer-on-linux-and-stop-getting-insecure