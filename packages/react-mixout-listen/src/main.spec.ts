/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import {expect} from 'chai';
import {mount, shallow} from 'enzyme';

import mixout from 'react-mixout';
import listen from './main';

const FunctionComponent = () => null;

function buildClass(onClick: () => void) {
  class Test extends React.Component<any, any> {
    onClick(e) {
      onClick();
    }

    render() {
      return null;
    }
  }
  return Test
}

describe('react-mixout-listen', () => {

  it('should fail when wrapped component is not class component', () => {
    const Mixout = mixout(listen('click', 'onClick'))(FunctionComponent);
    expect(() => mount(React.createElement(Mixout))).to.throw();
  });

  it('should properly listen on window events as default', () => {
    let clicks = 0;
    const Test = buildClass(() => clicks++);
    const Mixout = mixout(listen('click', 'onClick'))(Test);
    const wrapper = mount(React.createElement(Mixout));

    document.body.click();
    expect(clicks).to.be.equals(1);
    document.body.click();
    document.body.click();
    expect(clicks).to.be.equals(3);
  });

  it('should properly cleanup listener after unmount', () => {
    let clicks = 0;
    const Test = buildClass(() => clicks++);
    const Mixout = mixout(listen('click', 'onClick'))(Test);
    const wrapper = mount(React.createElement(Mixout));

    document.body.click();
    expect(clicks).to.be.equals(1);
    document.body.click();
    document.body.click();
    expect(clicks).to.be.equals(3);
    wrapper.unmount();
    document.body.click();
    document.body.click();
    expect(clicks).to.be.equals(3);
  });

  it('should work with string as target', () => {
    let clicks = 0;
    const Test = buildClass(() => clicks++);
    const Mixout = mixout(listen('click', 'onClick', { target: 'document' }))(Test);
    const wrapper = mount(React.createElement(Mixout));

    document.body.click();
    expect(clicks).to.be.equals(1);
    document.body.click();
    document.body.click();
    expect(clicks).to.be.equals(3);
  });

  it('should work with callback as target', () => {
    let clicks = 0;
    const Test = buildClass(() => clicks++);
    const Mixout = mixout(listen('click', 'onClick', { target: () => document.body }))(Test);
    const wrapper = mount(React.createElement(Mixout));

    document.body.click();
    expect(clicks).to.be.equals(1);
    document.body.click();
    document.body.click();
    expect(clicks).to.be.equals(3);
  });

  it('should properly pass down useCapture', () => {
    const calls = [];
    let b;

    class Test extends React.Component<any, any> {
      onClick(e) {
        calls.push('test');
      }

      render() {
        return React.createElement('button', { ref: i => b = i, onClick: () => calls.push('button') });
      }
    }

    const element = document.createElement('div');
    document.body.appendChild(element);

    const Mixout = mixout(listen('click', 'onClick', { target: 'document', useCapture: true }))(Test);
    const wrapper = mount(React.createElement(Mixout), { attachTo: element });

    expect(calls).to.deep.equal([]);
    b.click();
    expect(calls).to.deep.equal(['test', 'button']);
  });

});
