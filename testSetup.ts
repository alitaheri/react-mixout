/// <reference types="node" />
/// <reference types="mocha" />

require('source-map-support').install({
  environment: 'node',
  handleUncaughtExceptions: false,
});

const jsdom = require('jsdom').jsdom;

(<any>global).document = jsdom('');
(<any>global).window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if ((<any>global)[property] === undefined) {
    (<any>global)[property] = (<any>document.defaultView)[property];
  }
});

(<any>global).navigator = { userAgent: 'node.js' };
