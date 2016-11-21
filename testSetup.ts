/// <reference types="mocha" />

require('source-map-support').install({
  handleUncaughtExceptions: false,
  environment: 'node',
});

const jsdom = require('jsdom').jsdom;

(<any>global).document = jsdom('');
(<any>global).window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof (<any>global)[property] === 'undefined') {
    (<any>global)[property] = (<any>document.defaultView)[property];
  }
});

(<any>global).navigator = {
  userAgent: 'node.js'
};
