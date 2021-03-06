import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import mixout from 'react-mixout';
import listen from './main';

const FunctionComponent = () => null!;

function buildClass(onClick: () => void) {
  class Test extends React.Component<any, any> {
    public onClick() {
      onClick();
    }

    public render() {
      return null;
    }
  }
  return Test;
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
    mount(React.createElement(Mixout));

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
    mount(React.createElement(Mixout));

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
    mount(React.createElement(Mixout));

    document.body.click();
    expect(clicks).to.be.equals(1);
    document.body.click();
    document.body.click();
    expect(clicks).to.be.equals(3);
  });

  it('should properly pass down useCapture', () => {
    const calls: string[] = [];
    let b: any;

    class Test extends React.Component<any, any> {
      public onClick() {
        calls.push('test');
      }

      public render() {
        return React.createElement('button', {
          onClick: () => calls.push('button'),
          ref: (i: any) => b = i,
        });
      }
    }

    const element = document.createElement('div');
    document.body.appendChild(element);

    const Mixout = mixout(listen('click', 'onClick', { target: 'document', useCapture: true }))(Test);
    mount(React.createElement(Mixout), { attachTo: element });

    expect(calls).to.deep.equal([]);
    b.click();
    expect(calls).to.deep.equal(['test', 'button']);
  });

});
