/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';

import mixout from 'react-mixout';
import pure from './main';

describe('react-mixout-pure', () => {

  it('should not re-render if previous and next props are shallowly equal', () => {
    let renders = 0;
    const Component = () => { renders++; return null; };
    const Mixout = mixout(pure)(Component);

    const wrapper = mount(React.createElement(Mixout, { prop: 'foo' }));
    expect(renders).to.be.equals(1);

    wrapper.setProps({ prop: 'bar' });
    expect(renders).to.be.equals(2);

    wrapper.setProps({ prop: 'foo' });
    expect(renders).to.be.equals(3);

    wrapper.setProps({ prop: 'foo' });
    wrapper.setProps({ prop: 'foo' });
    expect(renders).to.be.equals(3);
  });

  it('should not re-render if previous and next context are shallowly equal', () => {
    let renders = 0;
    const Component = () => { renders++; return null; };
    const Mixout = mixout(pure)(Component);

    const wrapper = mount(React.createElement(Mixout), {
      context: { prop: 'foo' },
      childContextTypes: { prop: React.PropTypes.string },
    });

    expect(renders).to.be.equals(1);

    wrapper.setContext({ prop: 'bar' });
    expect(renders).to.be.equals(2);

    wrapper.setContext({ prop: 'foo' });
    expect(renders).to.be.equals(3);

    wrapper.setContext({ prop: 'foo' });
    wrapper.setContext({ prop: 'foo' });
    expect(renders).to.be.equals(3);
  });

});
