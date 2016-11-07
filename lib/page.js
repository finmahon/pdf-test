'use strict';

var cheerio = require('cheerio');

var Page = function() {

  var htmlContentPatched;

  this.getContent = function() {
    if (!this.htmlContent ||
      this.htmlContent === '') {
      throw new Error('Missing HTML content.');
    }
    else {
      return this.htmlContent;
    }
  };

  this.setContent = function(_content) {
    this.htmlContent = _content;
  };

  this.patchCSS = function(host) {
    var $ = cheerio.load(this.htmlContent);

    $('link').each(function() {
      var route = host + $(this).attr('href');
      $(this).attr('href', route);
    });

    htmlContentPatched = $.html();
  };

  this.getPage = function() {
    return htmlContentPatched;
  };
};

module.exports = Page;
