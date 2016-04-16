import * as React from 'react';
import {expect} from 'chai';

import forwardContext from './main';

describe('forwardContext', () => {

  it('should forward value from context to props', () => {
    const injector = forwardContext('myProp');
    const passedDownProps = {};
    injector.propInjector((name, value) => passedDownProps[name] = value, {}, { myProp: 1 }, null);
    expect(passedDownProps['myProp']).to.be.equals(1);
  });

  it('should not forward value from context if context does not have the prop', () => {
    const injector = forwardContext('myProp');
    const passedDownProps = {};
    injector.propInjector((name, value) => passedDownProps[name] = value, {}, null, null);
    injector.propInjector((name, value) => passedDownProps[name] = value, {}, {}, null);
    expect(passedDownProps).not.haveOwnPropertyDescriptor('myProp');
  });

  it('should forward value from context to props as aliased', () => {
    const injector = forwardContext('myProp', { alias: 'yourProp' });
    const passedDownProps = {};
    injector.propInjector((name, value) => passedDownProps[name] = value, {}, { myProp: 1 }, null);
    expect(passedDownProps['yourProp']).to.be.equals(1);
  });

  it('should forward mapped value from context to props if mapper is provided', () => {
    const injector = forwardContext<number>('myProp', { mapToProp: v => v * 10 });
    const passedDownProps = {};
    injector.propInjector((name, value) => passedDownProps[name] = value, {}, { myProp: 2 }, null);
    expect(passedDownProps['myProp']).to.be.equals(20);
  });

  it('should properly set validator on contextType even if none is provided', () => {
    const injector = forwardContext('myProp');
    const contextTypes = {};
    injector.contextTypeInjector((name, value) => contextTypes[name] = value);
    expect(contextTypes['myProp']).to.be.equals(React.PropTypes.any);
  });

  it('should properly override the provided validator on contextType', () => {
    const injector = forwardContext('myProp', { validator: React.PropTypes.number });
    const contextTypes = {};
    injector.contextTypeInjector((name, value) => contextTypes[name] = value);
    expect(contextTypes['myProp']).to.be.equals(React.PropTypes.number);
  });

  it('should properly pass down default if no value is available on context', () => {
    const injector = forwardContext('myProp', { defaultValue: 2 });
    const passedDownProps = {};
    injector.propInjector((name, value) => passedDownProps[name] = value, {}, {}, null);
    expect(passedDownProps['myProp']).to.be.equals(2);
  });

  it('should properly generate default if no value is available on context', () => {
    const injector = forwardContext('myProp', { defaultGenerator: (p) => p.a ? p.a : 4 });
    const passedDownProps = {};
    injector.propInjector((name, value) => passedDownProps[name] = value, { a: 2 }, {}, null);
    expect(passedDownProps['myProp']).to.be.equals(2);
    injector.propInjector((name, value) => passedDownProps[name] = value, {}, {}, null);
    expect(passedDownProps['myProp']).to.be.equals(4);
  });

});
