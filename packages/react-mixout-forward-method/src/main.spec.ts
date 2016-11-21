import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import mixout from 'react-mixout';
import forwardMethod, { forwardReactTransitionGroupMethods } from './main';

const FunctionComponent = () => null!;

const ClassComponent = class extends React.Component<any, any> {
  foo(a: any, b: any) {
    return a + b;
  }

  componentWillAppear() { }
  componentDidAppear() { }
  componentWillEnter() { }
  componentDidEnter() { }
  componentWillLeave() { }
  componentDidLeave() { }

  render() {
    return null!;
  }
};

describe('react-mixout-forward-method', () => {

  it('should throw when child is not class component', () => {
    const Mixout = mixout(forwardMethod('foo'))(FunctionComponent);
    const wrapper = mount(React.createElement(Mixout));
    expect(() => (<any>wrapper.instance())['foo']()).to.throw();
  });

  it('should throw when child does not have the function name provided', () => {
    const Mixout = mixout(forwardMethod('bar'))(ClassComponent);
    const wrapper = mount(React.createElement(Mixout));
    expect(() => (<any>wrapper.instance())['bar']()).to.throw();
  });

  it('should properly forward imperative method calls to the wrapped component', () => {
    const Mixout = mixout(forwardMethod('foo'))(ClassComponent);
    const wrapper = mount(React.createElement(Mixout));
    expect((<any>wrapper.instance())['foo'](1, 2)).to.be.equals(3);
  });

  it('should properly alias the method name', () => {
    const Mixout = mixout(forwardMethod('bar', 'foo'))(ClassComponent);
    const wrapper = mount(React.createElement(Mixout));
    expect((<any>wrapper.instance())['bar'](1, 2)).to.be.equals(3);
  });

  describe('forwardReactTransitionGroupMethods', () => {

    it('should properly forward all methods used by ReactTransitionGroup', () => {
      const Mixout = mixout(forwardReactTransitionGroupMethods)(ClassComponent);
      const wrapper = mount(React.createElement(Mixout));
      expect((<any>wrapper.instance())['componentWillAppear']).to.be.a('function');
      expect((<any>wrapper.instance())['componentDidAppear']).to.be.a('function');
      expect((<any>wrapper.instance())['componentWillEnter']).to.be.a('function');
      expect((<any>wrapper.instance())['componentDidEnter']).to.be.a('function');
      expect((<any>wrapper.instance())['componentWillLeave']).to.be.a('function');
      expect((<any>wrapper.instance())['componentDidLeave']).to.be.a('function');
      expect(() => (<any>wrapper.instance())['componentWillAppear']()).not.to.throw();
      expect(() => (<any>wrapper.instance())['componentDidAppear']()).not.to.throw();
      expect(() => (<any>wrapper.instance())['componentWillEnter']()).not.to.throw();
      expect(() => (<any>wrapper.instance())['componentDidEnter']()).not.to.throw();
      expect(() => (<any>wrapper.instance())['componentWillLeave']()).not.to.throw();
      expect(() => (<any>wrapper.instance())['componentDidLeave']()).not.to.throw();
    });

  });

});
