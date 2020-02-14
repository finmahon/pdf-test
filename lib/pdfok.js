'use strict';

const puppeteer = require('puppeteer');

const TMPFile = require('./temp');

const DEFAULT_DEPLOY_FOLDER = 'pdf_cache';

// let _browser = null;
const files = [];

let pdfCreator = {}

pdfCreator.generate = function (url, pageFormat, orientation,  cb) {

  let tmpFile = new TMPFile(DEFAULT_DEPLOY_FOLDER, true);
  let _page;

  (async () => {
    try {
      let browser;
      console.log('puppeteer ', pageFormat)
      if (pageFormat==='A3') {
        console.log('non format ')
        browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      } else {
        console.log(' format ')
         browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'] });
      }
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });

      tmpFile.setFile(new Date().getTime() + '.pdf');
      files.push(tmpFile);


      await page.pdf({ path: tmpFile.getAbsolutePath(), format: pageFormat || 'A4' });

      await browser.close();
      return cb(null, {
        finish: true,
        filename: tmpFile.getAbsolutePath()
      });
    } catch (e) {
      return cb(e);
    }
  })();


  // client.then(function (client) {
  //   _cli = client;
  //   return _cli.createPage()
  // })
  //   .then(function (page) {
  //     _page = page;

  //     if (pageFormat) {
  //       console.log('pageFormat ', pageFormat)
  //       return _page.property('paperSize', {
  //         format: pageFormat || 'A4',
  //         orientation: orientation || 'portrait',
  //       });
  //     } else if (zoomFactor) {
  //       console.log('zoomFactor ', zoomFactor)
  //       return _page.property('zoomFactor', zoomFactor);
  //     }else if (width) {
  //       console.log('width ', width, height)
  //       return _page.property('paperSize', {
  //         width: width,
  //         height: height,
  //       });
  //     }
  //     return _page

  //   })
  //   .then(function () {
  //     return _page.open(url);
  //   })
  //   .then(function (status) {
  //     console.log('open status = ', status);
  //     tmpFile.setFile(new Date().getTime() + '.pdf');

  //     files.push(tmpFile);
  //     return _page.render(tmpFile.getAbsolutePath());
  //   })
  //   .then(function (render) {
  //     _page.close();
  //     return cb(null, {
  //       finish: true,
  //       filename: tmpFile.getAbsolutePath()
  //     });
  //   })
  //   .catch(function (e) {
  //     console.log(e);
  //     cb(e, null);
  //   });
};

pdfCreator.clean = function (cb) {

  const callback = cb || function (f) {
    console.log('pdf.clean:', f.getFile());
  };

  files.forEach(function (file) {
    file.remove(2000);
    files.splice(0, 1);
    callback(file);
  });
};

module.exports = pdfCreator;