/// <reference path="../../../typings/main.d.ts" />

import * as React from 'react';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';

import mixout from 'react-mixout';
import uncontrol, {uncontrolValue} from './main';

class Test extends React.Component<any, any> {
  render() {
    setTimeout(() => this.props.onChange({ target: { value: 'foo' } }));
    return React.createElement('input', {
      id: 'input',
      type: 'text',
      onChange: () => { },
      value: this.props.value,
    });
  }
}

class FlexibleTest extends React.Component<any, any> {
  render() {
    const name: string = this.props.propName;
    setTimeout(() => {
      this.props['on' + name[0].toUpperCase() + name.substring(1) + 'Change']({ target: { value: 'foo' } });
    });
    return React.createElement('input', {
      id: 'input',
      type: 'text',
      onChange: () => { },
      value: this.props[this.props.propName],
    });
  }
}

describe('react-mixout-uncontrol', () => {

  it('should uncontrol the prop with no extra options as expected', (done) => {
    const Mixout = mixout(uncontrol('val'))(FlexibleTest);

    const wrapper = mount(React.createElement(Mixout, {
      propName: 'val',
      defaultVal: 'bar',
    }));

    const testWrapper = wrapper.find(FlexibleTest).at(0);
    expect(testWrapper.prop('val')).to.be.equal('bar');

    (<any>wrapper.instance()).setVal('baz');
    expect(testWrapper.prop('val')).to.be.equal('baz');
    expect((<any>wrapper.instance()).getVal()).to.be.equals('baz');

    (<any>wrapper.instance()).clearVal();

    expect(testWrapper.prop('val')).to.be.equal('bar');
    expect((<any>wrapper.instance()).getVal()).to.be.equals('bar');

    setTimeout(() => {
      expect(testWrapper.prop('val')).to.be.equal('foo');
      done();
    }, 10);
  });

  it('should properly set propTypes and defaults', () => {
    const callback = () => { };
    const Mixout = mixout(uncontrol('val', {
      defaultValuePropDefault: 1,
      defaultValuePropValidator: React.PropTypes.number,
      callbackPropDefault: callback,
      callbackPropValidator: React.PropTypes.func,
    }))(FlexibleTest);

    expect(Mixout.propTypes['defaultVal']).to.be.equals(React.PropTypes.number);
    expect(Mixout.propTypes['onValChange']).to.be.equals(React.PropTypes.func);

    expect(Mixout.defaultProps['defaultVal']).to.be.equals(1);
    expect(Mixout.defaultProps['onValChange']).to.be.equals(callback);
  });

  it('should work with custom stated props', (done) => {
    const Mixout = mixout(uncontrol('v', {
      callbackPropName: 'change',
      setValueMethodName: 'set',
      getValueMethodName: 'get',
      clearValueMethodName: 'clear',
      passedDownCallbackPropName: 'onChange',
      passedDownValuePropName: 'value',
      defaultValuePropName: 'def',
      getValueFromPassedDownCallback: () => 'overriden',
    }))(Test);

    let val;
    const wrapper = mount(React.createElement(Mixout, {
      change: e => val = e.target.value,
      def: 'bar',
    }));

    const testWrapper = wrapper.find(Test).at(0);
    expect(testWrapper.prop('value')).to.be.equal('bar');

    (<any>wrapper.instance()).set('baz');
    expect(testWrapper.prop('value')).to.be.equal('baz');
    expect((<any>wrapper.instance()).get()).to.be.equals('baz');

    (<any>wrapper.instance()).clear();

    expect(testWrapper.prop('value')).to.be.equal('bar');
    expect((<any>wrapper.instance()).get()).to.be.equals('bar');

    setTimeout(() => {
      expect(testWrapper.prop('value')).to.be.equal('overriden');
      expect(val).to.be.equals('foo');
      done();
    }, 10);
  });

  it('should work with partially custom stated props', (done) => {
    const Mixout = mixout(uncontrol('value', {
      callbackPropName: 'change',
      setValueMethodName: 'set',
      passedDownCallbackPropName: 'onChange',
      defaultValuePropName: 'def',
    }))(Test);

    let val;
    const wrapper = mount(React.createElement(Mixout, {
      change: e => val = e.target.value,
      def: 'bar',
    }));


    const testWrapper = wrapper.find(Test).at(0);
    expect(testWrapper.prop('value')).to.be.equal('bar');

    (<any>wrapper.instance()).set('baz');
    expect(testWrapper.prop('value')).to.be.equal('baz');
    expect((<any>wrapper.instance()).getValue()).to.be.equals('baz');

    (<any>wrapper.instance()).clearValue();

    expect(testWrapper.prop('value')).to.be.equal('bar');
    expect((<any>wrapper.instance()).getValue()).to.be.equals('bar');

    setTimeout(() => {
      expect(testWrapper.prop('value')).to.be.equal('foo');
      expect(val).to.be.equals('foo');
      done();
    }, 10);
  });

  it('should uncontrol value with expected behavior', (done) => {
    let val;
    let Mixout = mixout(uncontrolValue)(Test);

    const wrapper = mount(React.createElement(Mixout, {
      onChange: e => val = e.target.value,
      defaultValue: 'bar',
    }));

    const testWrapper = wrapper.find(Test).at(0);
    expect(testWrapper.prop('value')).to.be.equal('bar');

    (<any>wrapper.instance()).setValue('baz');
    expect(testWrapper.prop('value')).to.be.equal('baz');
    expect((<any>wrapper.instance()).getValue()).to.be.equals('baz');

    (<any>wrapper.instance()).clearValue();

    expect(testWrapper.prop('value')).to.be.equal('bar');
    expect((<any>wrapper.instance()).getValue()).to.be.equals('bar');

    setTimeout(() => {
      expect(testWrapper.prop('value')).to.be.equal('foo');
      expect(val).to.be.equals('foo');
      done();
    }, 10);
  });

});
