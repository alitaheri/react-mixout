import * as React from 'react';
import {expect} from 'chai';

import {forwardContext} from './forwardContext';

describe('forwardContext', () => {

  it('should forward value from context to props', () => {
    const injector = forwardContext('myProp');
    const passedDownProps = {};
    injector.propInjector({}, { myProp: 1 }, (name, value) => passedDownProps[name] = value);
    expect(passedDownProps['myProp']).to.be.equals(1);
  });

  it('should not forward value from context if context does not have the prop', () => {
    const injector = forwardContext('myProp');
    const passedDownProps = {};
    injector.propInjector({}, null, (name, value) => passedDownProps[name] = value);
    injector.propInjector({}, {}, (name, value) => passedDownProps[name] = value);
    expect(passedDownProps).not.haveOwnPropertyDescriptor('myProp');
  });

  it('should forward value from context to props as aliased', () => {
    const injector = forwardContext('myProp', { alias: 'yourProp' });
    const passedDownProps = {};
    injector.propInjector({}, { myProp: 1 }, (name, value) => passedDownProps[name] = value);
    expect(passedDownProps['yourProp']).to.be.equals(1);
  });

  it('should properly set validator on contextType even if none is provided', () => {
    const injector = forwardContext('myProp');
    const contextTypes = {};
    injector.contextTypeInjector((name, value) => contextTypes[name] = value);
    expect(contextTypes['myProp']).to.be.equals(React.PropTypes.any);
  });

  it('should properly override the provided validator on contextType', () => {
    const injector = forwardContext('myProp', {validator: React.PropTypes.number});
    const contextTypes = {};
    injector.contextTypeInjector((name, value) => contextTypes[name] = value);
    expect(contextTypes['myProp']).to.be.equals(React.PropTypes.number);
  });

});
