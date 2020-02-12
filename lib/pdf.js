'use strict';

const puppeteer = require('puppeteer');

const TMPFile = require('./temp');

const DEFAULT_DEPLOY_FOLDER = 'pdf_cache';

// let _browser = null;
const files = [];

let pdfCreator = {}

pdfCreator.generate = function (url, pageFormat, orientation, cb) {

  console.log(new Date() + `pdfCreator: ${url} - ${pageFormat} - ${orientation}`)

  let tmpFile = new TMPFile(DEFAULT_DEPLOY_FOLDER, true);

  (async () => {
    try {

      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });

      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });

      tmpFile.setFile(new Date().getTime() + '.pdf');
      files.push(tmpFile);

      await page.pdf({ path: tmpFile.getAbsolutePath(), format: pageFormat || 'A4', landscape: orientation === 'landscape' });

      await browser.close();
      return cb(null, {
        finish: true,
        filename: tmpFile.getAbsolutePath()
      });
    } catch (e) {
      return cb(e);
    }
  })();

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
