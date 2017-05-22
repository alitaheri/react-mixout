/// <reference types="node" />
/// <reference types="mocha" />

require('source-map-support').install({
  environment: 'node',
  handleUncaughtExceptions: false,
});

const { JSDOM } = require('jsdom');

const dom = new JSDOM(``);

(<any>global).window = dom.window;
(<any>global).document = window.document;
Object.keys(window).forEach(property => {
  if ((<any>global)[property] === undefined) {
    (<any>global)[property] = (<any>window)[property];
  }
});

(<any>global).navigator = { userAgent: 'node.js' };
