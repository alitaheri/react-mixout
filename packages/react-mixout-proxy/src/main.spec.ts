import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import mixout from 'react-mixout';
import proxy, { alias, proxyInput } from './main';

class Test extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = { val: props.val || 1 };
  }

  public return2() {
    return 2;
  }

  public returnFirstPlusSecond(first: any, second: any) {
    return first + second;
  }

  public returnValIncrement() {
    const val = this.state.val;
    this.setState({ val: val + 1 });
    return val;
  }

  public render() {
    return React.createElement('input', {
      defaultValue: 'Hello',
      ref: this.props.inputRef,
      type: 'text',
    });
  }
}

const TestHOC = (props: any) => React.createElement(
  Test,
  (<any>Object)['assign']({}, props, { ref: props.testRef }),
);

describe('react-mixout-proxy', () => {

  it('should not fail if no methods are forwarded or some methods are invalid', () => {
    const Mixout1 = mixout(proxy('testRef', null!))(TestHOC);
    mount(React.createElement(Mixout1));
    const Mixout2 = mixout(proxy('testRef', []))(TestHOC);
    mount(React.createElement(Mixout2));
    const Mixout3 = mixout(proxy('testRef', [null!, null!]))(TestHOC);
    mount(React.createElement(Mixout3));
  });

  it('should proxy method invocation to custom components', () => {
    const Mixout = mixout(proxy('testRef', ['return2']))(TestHOC);
    const wrapper = mount(React.createElement(Mixout));
    expect((<any>wrapper.instance())['return2']()).to.be.equals(2);
  });

  it('should properly proxy arguments', () => {
    const Mixout = mixout(proxy('testRef', 'returnFirstPlusSecond'))(TestHOC);
    const wrapper = mount(React.createElement(Mixout));
    expect((<any>wrapper.instance())['returnFirstPlusSecond'](3, 5)).to.be.equals(8);
  });

  it('should work with multiple methods', () => {
    const Mixout = mixout(proxy('testRef', ['returnFirstPlusSecond', 'returnValIncrement']))(TestHOC);
    const wrapper = mount(React.createElement(Mixout));
    expect((<any>wrapper.instance())['returnFirstPlusSecond'](3, 5)).to.be.equals(8);
    expect((<any>wrapper.instance())['returnValIncrement']()).to.be.equals(1);
    expect((<any>wrapper.instance())['returnValIncrement']()).to.be.equals(2);
    expect((<any>wrapper.instance())['returnValIncrement']()).to.be.equals(3);
  });

  it('should proxy method invocation to native elements', () => {
    const Mixout = mixout(proxy('inputRef', ['focus', 'blur', 'select', 'click']))(TestHOC);
    const wrapper = mount(React.createElement(Mixout));
    expect(() => (<any>wrapper.instance())['focus']()).not.to.throw();
    expect(() => (<any>wrapper.instance())['blur']()).not.to.throw();
    expect(() => (<any>wrapper.instance())['select']()).not.to.throw();
    expect(() => (<any>wrapper.instance())['click']()).not.to.throw();
  });

  describe('alias', () => {

    it('should properly alias a sinlge method', () => {
      const Mixout = mixout(proxy('testRef', alias('returnFirstPlusSecond', 'myMethod')))(TestHOC);
      const wrapper = mount(React.createElement(Mixout));
      expect((<any>wrapper.instance())['myMethod'](3, 5)).to.be.equals(8);
    });

    it('should properly alias multiple methods', () => {
      const Mixout = mixout(proxy('testRef', [
        alias('returnFirstPlusSecond', 'myMethod'),
        alias('returnValIncrement', 'myMethod2'),
        'return2',
      ]))(TestHOC);
      const wrapper = mount(React.createElement(Mixout));
      expect((<any>wrapper.instance())['myMethod'](3, 5)).to.be.equals(8);
      expect((<any>wrapper.instance())['myMethod2']()).to.be.equals(1);
      expect((<any>wrapper.instance())['myMethod2']()).to.be.equals(2);
      expect((<any>wrapper.instance())['myMethod2']()).to.be.equals(3);
      expect((<any>wrapper.instance())['return2']()).to.be.equals(2);
    });

    it('should properly alias the same method multiple times', () => {
      const Mixout = mixout(proxy('testRef', [
        alias('returnValIncrement', 'retval1'),
        alias('returnValIncrement', 'retval2'),
        alias('returnValIncrement', 'retval3'),
      ]))(TestHOC);
      const wrapper = mount(React.createElement(Mixout));
      expect((<any>wrapper.instance())['retval1']()).to.be.equals(1);
      expect((<any>wrapper.instance())['retval3']()).to.be.equals(2);
      expect((<any>wrapper.instance())['retval2']()).to.be.equals(3);
      expect((<any>wrapper.instance())['retval1']()).to.be.equals(4);
      expect((<any>wrapper.instance())['retval3']()).to.be.equals(5);
    });

  });

  describe('failOnNullRef', () => {

    it('should fail by default when ref is null', () => {
      const Mixout = mixout(proxy('blah', 'focus'))(TestHOC);
      const wrapper = mount(React.createElement(Mixout));
      expect(() => (<any>wrapper.instance())['focus']()).to.throw();
    });

    it('should not fail when ref is null and failOnNullRef=false', () => {
      const Mixout = mixout(proxy('blah', 'focus', false))(TestHOC);
      const wrapper = mount(React.createElement(Mixout));
      expect(() => (<any>wrapper.instance())['focus']()).not.to.throw();
      expect((<any>wrapper.instance())['focus']()).to.be.equals(undefined);
    });

  });

  describe('proxyInput', () => {

    it('should properly proxy all input method invocation to native element', () => {
      const Mixout = mixout(proxyInput)(TestHOC);
      const wrapper = mount(React.createElement(Mixout));
      expect(() => (<any>wrapper.instance())['focus']()).not.to.throw();
      expect(() => (<any>wrapper.instance())['blur']()).not.to.throw();
      expect(() => (<any>wrapper.instance())['select']()).not.to.throw();
      expect(() => (<any>wrapper.instance())['click']()).not.to.throw();
      expect(() => (<any>wrapper.instance())['setRangeText']('foo', 1, 4)).not.to.throw();
      expect(() => (<any>wrapper.instance())['setSelectionRange'](1, 2)).not.to.throw();
    });

  });

});
