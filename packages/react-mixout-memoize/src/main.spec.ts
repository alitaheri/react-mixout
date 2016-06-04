/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import {expect} from 'chai';
import {mount, shallow} from 'enzyme';

import mixout from 'react-mixout';
import memoize, {context} from './main';

class Test extends React.Component<any, any> {
  render() {
    return React.createElement('div', {}, this.props.result);
  }
}

describe('react-mixout-memoize', () => {

  it('should fail when name is not valid', () => {
    expect(() => memoize(null, () => 1, () => 1)).to.throw();
  });

  it('should fail when there are no selectors', () => {
    expect(() => memoize('foo', () => 1)).to.throw();
  });

  it('should fail when there are invalid selectors', () => {
    expect(() => memoize('foo', null, () => 1)).to.throw();
  });

  it('should properly call selectors with props and pass the results to resolver', () => {
    const memo = memoize('result',
      props => props.cash,
      props => props.credit,
      (cash, credit) => cash + credit
    );

    const Mixout = mixout(memo)(Test);
    const wrapper = shallow(React.createElement(Mixout, { cash: 1, credit: 10 }));
    expect(wrapper.find(Test).at(0).prop('result')).to.be.equals(11);
  });

  it('should properly call selectors with context and pass the results to resolver', () => {
    const memo = memoize('result',
      (props, context) => context.cash,
      (props, context) => context.credit,
      (cash, credit) => cash + credit
    );

    const Mixout = mixout(memo, context('cash'), context('credit'))(Test);
    const wrapper = shallow(React.createElement(Mixout), { context: { cash: 1, credit: 10 } });
    expect(wrapper.find(Test).at(0).prop('result')).to.be.equals(11);
  });

  it('should call resolver only when selectors return a different value', () => {
    let called = 0;
    const memo = memoize('result',
      (props, context) => context.pocket.cash,
      (props, context) => context.pocket.coins,
      (props, context) => props.accounting.credit,
      (props, context) => props.accounting.debt,
      (cash, coins, credit, debt) => { called++; return cash + coins + credit - debt; }
    );

    const Mixout = mixout(memo)(Test);
    const wrapper = mount(
      React.createElement(Mixout, { accounting: { credit: 100, debt: 50 } }),
      {
        context: { pocket: { cash: 1, coins: 10 } },
        childContextTypes: { pocket: React.PropTypes.any },
      }
    );

    expect(wrapper.find(Test).at(0).prop('result')).to.be.equals(61);
    expect(called).to.be.equals(1);

    wrapper.setProps({ accounting: { credit: 100, debt: 50 } });
    wrapper.setContext({ pocket: { cash: 1, coins: 10 } });

    expect(wrapper.find(Test).at(0).prop('result')).to.be.equals(61);
    expect(called).to.be.equals(1);

    wrapper.setContext({ pocket: { cash: 2, coins: 10 } });

    expect(wrapper.find(Test).at(0).prop('result')).to.be.equals(62);
    expect(called).to.be.equals(2);

    wrapper.setProps({ accounting: { credit: 100, debt: 60 } });
    wrapper.setContext({ pocket: { cash: 2, coins: 10 } });

    expect(wrapper.find(Test).at(0).prop('result')).to.be.equals(52);
    expect(called).to.be.equals(3);

    wrapper.setProps({ accounting: { credit: 100, debt: 50 } });
    wrapper.setContext({ pocket: { cash: 2, coins: 20 } });

    expect(wrapper.find(Test).at(0).prop('result')).to.be.equals(72);
    expect(called).to.be.equals(5);

    wrapper.setProps({ accounting: { credit: 100, debt: 50 } });
    wrapper.setContext({ pocket: { cash: 2, coins: 20 } });

    expect(wrapper.find(Test).at(0).prop('result')).to.be.equals(72);
    expect(called).to.be.equals(5);

  });

});
