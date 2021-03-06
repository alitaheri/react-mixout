import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import mixout from 'react-mixout';
import uncontrol, { uncontrolValue } from './main';

class Test extends React.Component<any, any> {
  public render() {
    setTimeout(() => this.props.onChange({ target: { value: 'foo' } }));
    return React.createElement('input', {
      id: 'input',
      onChange: () => null,
      type: 'text',
      value: this.props.value,
    });
  }
}

class FlexibleTest extends React.Component<any, any> {
  public render() {
    const name: string = this.props.propName;
    setTimeout(() => {
      this.props['on' + name[0].toUpperCase() + name.substring(1) + 'Change']({ target: { value: 'foo' } });
    });
    return React.createElement('input', {
      id: 'input',
      onChange: () => null,
      type: 'text',
      value: this.props[this.props.propName],
    });
  }
}

describe('react-mixout-uncontrol', () => {

  it('should uncontrol the prop with no extra options as expected', (done) => {
    const Mixout = mixout(uncontrol('val'))(FlexibleTest);

    const wrapper = mount(React.createElement(Mixout, {
      defaultVal: 'bar',
      propName: 'val',
    }));

    const testWrapper = wrapper.find(FlexibleTest).at(0);
    expect(testWrapper.prop('val')).to.be.equal('bar');

    (<any>wrapper.instance()).setVal('baz');
    expect(testWrapper.prop('val')).to.be.equal('baz');
    expect((<any>wrapper.instance()).getVal()).to.be.equals('baz');

    (<any>wrapper.instance()).clearVal();

    expect(testWrapper.prop('val')).to.be.equal('bar');
    expect((<any>wrapper.instance()).getVal()).to.be.equals('bar');

    setTimeout(
      () => {
        expect(testWrapper.prop('val')).to.be.equal('foo');
        done();
      },
      10,
    );
  });

  it('should properly set propTypes and defaults', () => {
    const callback = () => { return; };
    const validator1 = () => null;
    const validator2 = () => null;
    const Mixout = mixout(uncontrol('val', {
      callbackPropDefault: callback,
      callbackPropValidator: validator1,
      defaultValuePropDefault: 1,
      defaultValuePropValidator: validator2,
    }))(FlexibleTest);

    expect((<any>Mixout).propTypes['defaultVal']).to.be.equals(validator2);
    expect((<any>Mixout).propTypes['onValChange']).to.be.equals(validator1);

    expect((<any>Mixout).defaultProps['defaultVal']).to.be.equals(1);
    expect((<any>Mixout).defaultProps['onValChange']).to.be.equals(callback);
  });

  it('should work with custom stated props', (done) => {
    const Mixout = mixout(uncontrol('v', {
      callbackPropName: 'change',
      clearValueMethodName: 'clear',
      defaultValuePropName: 'def',
      getValueFromPassedDownCallback: () => 'overriden',
      getValueMethodName: 'get',
      passedDownCallbackPropName: 'onChange',
      passedDownValuePropName: 'value',
      setValueMethodName: 'set',
    }))(Test);

    let val: any;
    const wrapper = mount(React.createElement(Mixout, {
      change: (e: any) => val = e.target.value,
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

    setTimeout(
      () => {
        expect(testWrapper.prop('value')).to.be.equal('overriden');
        expect(val).to.be.equals('foo');
        done();
      },
      10,
    );
  });

  it('should work with partially custom stated props', (done) => {
    const Mixout = mixout(uncontrol('value', {
      callbackPropName: 'change',
      defaultValuePropName: 'def',
      passedDownCallbackPropName: 'onChange',
      setValueMethodName: 'set',
    }))(Test);

    let val: any;
    const wrapper = mount(React.createElement(Mixout, {
      change: (e: any) => val = e.target.value,
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

    setTimeout(
      () => {
        expect(testWrapper.prop('value')).to.be.equal('foo');
        expect(val).to.be.equals('foo');
        done();
      },
      10,
    );
  });

  it('should uncontrol value with expected behavior', (done) => {
    let val: any;
    const Mixout = mixout(uncontrolValue)(Test);

    const wrapper = mount(React.createElement(Mixout, {
      defaultValue: 'bar',
      onChange: (e: any) => val = e.target.value,
    }));

    const testWrapper = wrapper.find(Test).at(0);
    expect(testWrapper.prop('value')).to.be.equal('bar');

    (<any>wrapper.instance()).setValue('baz');
    expect(testWrapper.prop('value')).to.be.equal('baz');
    expect((<any>wrapper.instance()).getValue()).to.be.equals('baz');

    (<any>wrapper.instance()).clearValue();

    expect(testWrapper.prop('value')).to.be.equal('bar');
    expect((<any>wrapper.instance()).getValue()).to.be.equals('bar');

    setTimeout(
      () => {
        expect(testWrapper.prop('value')).to.be.equal('foo');
        expect(val).to.be.equals('foo');
        done();
      },
      10,
    );
  });

});
