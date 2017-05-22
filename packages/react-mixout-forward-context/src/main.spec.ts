import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import mixout from 'react-mixout';
import forwardContext from './main';

const Component = () => null!;

describe('react-mixout-forward-context', () => {

  it('should forward value from context to props', () => {
    const Mixout = mixout(forwardContext('myProp'))(Component);
    const wrapper = shallow(React.createElement(Mixout), { context: { myProp: 1 } });
    expect(wrapper.find(Component).at(0).prop('myProp')).to.be.equals(1);
  });

  it('should not forward value from context if context does not have the prop', () => {
    const Mixout = mixout(forwardContext('myProp'))(Component);
    const wrapper = shallow(React.createElement(Mixout), { context: {} });
    expect(wrapper.find(Component).at(0).prop('myProp')).to.be.equals(undefined);
  });

  it('should forward value from context to props as aliased', () => {
    const Mixout = mixout(forwardContext('myProp', { alias: 'yourProp' }))(Component);
    const wrapper = shallow(React.createElement(Mixout), { context: { myProp: 1 } });
    expect(wrapper.find(Component).at(0).prop('yourProp')).to.be.equals(1);
  });

  it('should forward mapped value from context to props if mapper is provided', () => {
    const Mixout = mixout(forwardContext<number>('myProp', { mapToProp: v => v * 10 }))(Component);
    const wrapper = shallow(React.createElement(Mixout), { context: { myProp: 1 } });
    expect(wrapper.find(Component).at(0).prop('myProp')).to.be.equals(10);
  });

  it('should properly set validator on contextType even if none is provided', () => {
    const Mixout = mixout(forwardContext('myProp'))(Component);
    expect((<any>Mixout.contextTypes)['myProp']()).to.be.equals(null);
  });

  it('should properly override the provided validator on contextType', () => {
    const validator = () => null;
    const Mixout = mixout(forwardContext('myProp', { validator }))(Component);
    expect((<any>Mixout.contextTypes)['myProp']).to.be.equals(validator);
  });

  it('should properly pass down default if no context is available', () => {
    const Mixout = mixout(forwardContext('myProp', { defaultValue: 2 }))(Component);
    const wrapper = shallow(React.createElement(Mixout));
    expect(wrapper.find(Component).at(0).prop('myProp')).to.be.equals(2);
  });

  it('should properly pass down default if no value is available on context', () => {
    const Mixout = mixout(forwardContext('myProp', { defaultValue: 2 }))(Component);
    const wrapper = shallow(React.createElement(Mixout), { context: {} });
    expect(wrapper.find(Component).at(0).prop('myProp')).to.be.equals(2);
  });

  it('should properly pass down default if value  on context is undefined', () => {
    const Mixout = mixout(forwardContext('myProp', { defaultValue: 2 }))(Component);
    const wrapper = shallow(React.createElement(Mixout), { context: { myProp: undefined } });
    expect(wrapper.find(Component).at(0).prop('myProp')).to.be.equals(2);
  });

  it('should properly generate default if no value is available on context', () => {
    const Mixout = mixout(forwardContext('myProp', { defaultGenerator: (p) => p.a ? p.a : 4 }))(Component);
    const wrapper1 = shallow(React.createElement(Mixout, { a: 2 }));
    expect(wrapper1.find(Component).at(0).prop('myProp')).to.be.equals(2);
    const wrapper2 = shallow(React.createElement(Mixout));
    expect(wrapper2.find(Component).at(0).prop('myProp')).to.be.equals(4);
  });

});
