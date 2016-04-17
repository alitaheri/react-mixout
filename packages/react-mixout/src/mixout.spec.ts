/// <reference path="../../../typings/main.d.ts" />

import {expect} from 'chai';

import * as React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import {shallow} from 'enzyme';

import mixout from './mixout';

describe('react-mixout: mixout', () => {

  describe('contextTypeInjector', () => {

    it('should properly add or override context validators', () => {
      const Mixout = mixout(
        {
          contextTypeInjector: (setContextType) => {
            setContextType('a', React.PropTypes.number);
            setContextType('b', React.PropTypes.string);
            setContextType('c', React.PropTypes.any);
            setContextType('a', React.PropTypes.any);
          },
        },
        {
          contextTypeInjector: (setContextType) => {
            setContextType('d', React.PropTypes.number);
            setContextType('e', React.PropTypes.string);
            setContextType('f', React.PropTypes.any);
            setContextType('e', React.PropTypes.bool);
          },
        }
      )(() => null);

      expect(Mixout.contextTypes['a']).to.be.equals(React.PropTypes.any);
      expect(Mixout.contextTypes['b']).to.be.equals(React.PropTypes.string);
      expect(Mixout.contextTypes['c']).to.be.equals(React.PropTypes.any);
      expect(Mixout.contextTypes['d']).to.be.equals(React.PropTypes.number);
      expect(Mixout.contextTypes['e']).to.be.equals(React.PropTypes.bool);
      expect(Mixout.contextTypes['f']).to.be.equals(React.PropTypes.any);
    });

  });

  describe('propTypeInjector', () => {

    it('should properly add or override default props and validators', () => {
      const obj = {};
      const Mixout = mixout(
        {
          propTypeInjector: (setPropType) => {
            setPropType('a', React.PropTypes.number, 1);
            setPropType('b', React.PropTypes.string);
            setPropType('c', React.PropTypes.any, obj);
            setPropType('a', React.PropTypes.any);
          },
        },
        {
          propTypeInjector: (setPropType) => {
            setPropType('d', React.PropTypes.number, 5);
            setPropType('e', React.PropTypes.string);
            setPropType('f', React.PropTypes.any, obj);
            setPropType('e', React.PropTypes.bool, true);
          },
        }
      )(() => null);

      expect(Mixout.propTypes['a']).to.be.equals(React.PropTypes.any);
      expect(Mixout.propTypes['b']).to.be.equals(React.PropTypes.string);
      expect(Mixout.propTypes['c']).to.be.equals(React.PropTypes.any);
      expect(Mixout.propTypes['d']).to.be.equals(React.PropTypes.number);
      expect(Mixout.propTypes['e']).to.be.equals(React.PropTypes.bool);
      expect(Mixout.propTypes['f']).to.be.equals(React.PropTypes.any);

      expect(Mixout.defaultProps).not.to.haveOwnProperty('a');
      expect(Mixout.defaultProps).not.to.haveOwnProperty('b');
      expect(Mixout.defaultProps['c']).to.be.equals(obj);
      expect(Mixout.defaultProps['d']).to.be.equals(5);
      expect(Mixout.defaultProps['e']).to.be.true;
      expect(Mixout.defaultProps['f']).to.be.equals(obj);
    });

  });

  describe('propInjector', () => {

    it('should properly add or override passed props', () => {
      const Component = () => null;
      const Mixout = mixout(
        {
          propInjector: (setProp) => {
            setProp('a', true);
            setProp('b', 4);
          },
        },
        {
          propInjector: (setProp) => {
            setProp('c', 10);
            setProp('a', 1);
          },
        }
      )(Component);

      const wrapper = shallow(React.createElement(Mixout));
      expect(wrapper.find(Component).at(0).prop('a')).to.be.equals(1);
      expect(wrapper.find(Component).at(0).prop('b')).to.be.equals(4);
      expect(wrapper.find(Component).at(0).prop('c')).to.be.equals(10);
    });

    it('should properly pass ownProps to injectors', () => {
      const Component = () => null;
      const Mixout = mixout(
        { propInjector: (setProp, ownProps) => setProp('a', ownProps.hello) },
        { propInjector: (setProp, ownProps) => setProp('b', ownProps.world) }
      )(Component);

      const wrapper = shallow(React.createElement(Mixout, { hello: 'hello', world: 'world' }));
      expect(wrapper.find(Component).at(0).prop('a')).to.be.equals('hello');
      expect(wrapper.find(Component).at(0).prop('b')).to.be.equals('world');
    });

  });
});
