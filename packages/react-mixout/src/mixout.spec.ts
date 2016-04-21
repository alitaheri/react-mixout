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

    it('should properly pass ownContext to injectors', () => {
      const obj = {};
      const Component = () => null;
      const Mixout = mixout(
        {
          contextTypeInjector: ((setContextType => setContextType('color', React.PropTypes.string))),
          propInjector: (setProp, ownProps, ownContext) => setProp('a', ownContext.color),
        },
        {
          contextTypeInjector: ((setContextType => setContextType('theme', React.PropTypes.object))),
          propInjector: (setProp, ownProps, ownContext) => setProp('b', ownContext.theme),
        }
      )(Component);
      const wrapper = shallow(React.createElement(Mixout), { context: { color: '#FFF', theme: obj } });
      expect(wrapper.find(Component).at(0).prop('a')).to.be.equals('#FFF');
      expect(wrapper.find(Component).at(0).prop('b')).to.be.equals(obj);
    });

    it('should properly pass ownState to injectors', () => {
      const Component = () => null;
      const Mixout = mixout(
        {
          initialStateInjector: (p, c, s) => s['foo'] = 'bar',
          propInjector: (setProp, ownProps, ownContext, ownState) => setProp('a', ownState.foo),
        },
        {
          initialStateInjector: (p, c, s) => s['baz'] = 'foobar',
          propInjector: (setProp, ownProps, ownContext, ownState) => setProp('b', ownState.baz),
        }
      )(Component);
      const wrapper = shallow(React.createElement(Mixout));
      expect(wrapper.find(Component).at(0).prop('a')).to.be.equals('bar');
      expect(wrapper.find(Component).at(0).prop('b')).to.be.equals('foobar');
    });

  });

  describe('initialStateInjector', () => {

    it('should properly pass props as argument', () => {
      const Component = () => null;
      let foo;
      let foobar;
      const Mixout = mixout(
        { initialStateInjector: ownProps => foo = ownProps['foo'] },
        { initialStateInjector: ownProps => foobar = ownProps['foobar'] }
      )(Component);
      const wrapper = shallow(React.createElement(Mixout, { foo: '1', foobar: '2' }));
      expect(foo).to.be.equals('1');
      expect(foobar).to.be.equals('2');
    });

    it('should properly pass context as argument', () => {
      const Component = () => null;
      let foo;
      let foobar;
      const Mixout = mixout(
        {
          contextTypeInjector: ((setContextType => setContextType('foo', React.PropTypes.string))),
          initialStateInjector: (ownProps, ownContext) => foo = ownContext['foo'],
        },
        {
          contextTypeInjector: ((setContextType => setContextType('foobar', React.PropTypes.string))),
          initialStateInjector: (ownProps, ownContext) => foobar = ownContext['foobar'],
        }
      )(Component);
      const wrapper = shallow(React.createElement(Mixout), { context: { foo: '1', foobar: '2' } });
      expect(foo).to.be.equals('1');
      expect(foobar).to.be.equals('2');
    });

    it('should properly pass own isolated state that is unique per injector', () => {
      const Component = () => null;
      let s1;
      let s2;
      let s3;
      const Mixout = mixout(
        { initialStateInjector: (ownProps, ownContext, ownState) => s1 = ownState },
        { initialStateInjector: (ownProps, ownContext, ownState) => s2 = ownState },
        { initialStateInjector: (ownProps, ownContext, ownState) => s3 = ownState }
      )(Component);
      const wrapper = shallow(React.createElement(Mixout));
      expect(s1).to.be.an('object');
      expect(s2).to.be.an('object');
      expect(s3).to.be.an('object');
      expect(s1).not.to.be.equals(s2);
      expect(s2).not.to.be.equals(s3);
    });

    it('should properly pass down a functional forceUpdater', () => {
      const Component = () => null;
      let updater1;
      let updater2;
      let renders = 0;
      const Mixout = mixout(
        { initialStateInjector: (ownProps, ownContext, ownState, forceUpdater) => updater1 = forceUpdater },
        { initialStateInjector: (ownProps, ownContext, ownState, forceUpdater) => updater2 = forceUpdater },
        { propInjector: () => renders++ }
      )(Component);
      const wrapper = shallow(React.createElement(Mixout));
      expect(renders).to.be.equals(1);
      expect(updater1).to.be.equals(updater2);
      let called = false;
      const callback = () => called = true;
      updater1(callback);
      expect(called).to.be.true;
      expect(renders).to.be.equals(2);
      updater2();
      expect(renders).to.be.equals(3);
    });

  });

  describe('imperativeMethodInjector', () => {

    it('should properly set imprative method on the mixout', () => {
      const Component = () => null;
      let focusCalled = false;
      let blurCalled = false;
      const Mixout = mixout(
        { imperativeMethodInjector: setImperativeMethod => setImperativeMethod('focus', () => focusCalled = true) },
        { imperativeMethodInjector: setImperativeMethod => setImperativeMethod('blue', () => blurCalled = true) }
      )(Component);
      const wrapper = shallow(React.createElement(Mixout));
      wrapper.instance()['focus']();
      expect(focusCalled).to.be.true;
      expect(blurCalled).to.be.false;
      wrapper.instance()['blue']();
      expect(focusCalled).to.be.true;
      expect(blurCalled).to.be.true;
    });

    it('should properly return the result of imperative method call', () => {
      const Component = () => null;
      const Mixout = mixout(
        { imperativeMethodInjector: setImperativeMethod => setImperativeMethod('focus', () => 'focused') }
      )(Component);
      const wrapper = shallow(React.createElement(Mixout));
      expect(wrapper.instance()['focus']()).to.be.equals('focused');
    });

    it('should properly pass all invokation arguments as first argument to implementation', () => {
      const Component = () => null;
      let invokeArgs;
      const Mixout = mixout(
        { imperativeMethodInjector: setImperativeMethod => setImperativeMethod('focus', args => invokeArgs = args) }
      )(Component);
      const wrapper = shallow(React.createElement(Mixout));
      wrapper.instance()['focus'](1, null, 'hello');
      expect(invokeArgs).to.deep.equal([1, null, 'hello']);
    });

  });

});
