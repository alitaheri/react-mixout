import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import mixout from 'react-mixout';
import passContext from './main';

describe('react-mixout-pass-context', () => {

  it('should properly pass context calculated from props', () => {
    let passedContext: any = {};
    const Component = (_p: any, context: any) => {
      passedContext = context;
      return null!;
    };

    (<any>Component).contextTypes = {
      foo: React.PropTypes.string,
    };

    const Mixout = mixout(passContext('foo', props => props.a + props.b))(Component);
    mount(React.createElement(Mixout, {a: 'hello ', b: 'world'}));
    expect(passedContext['foo']).to.be.equals('hello world');
  });

});
