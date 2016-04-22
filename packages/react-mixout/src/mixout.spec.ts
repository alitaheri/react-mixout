/// <reference path="../../../typings/main.d.ts" />

import {expect} from 'chai';

import * as React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import {shallow, mount} from 'enzyme';

import mixout, {isClassComponent} from './mixout';

describe('react-mixout: isClassComponent', () => {

  it('should correctly determine if passed component is class based', () => {
    const FunctionComponent = () => null;
    const ClassComponent = class extends React.Component<any, any>{ render() { return null; } };
    expect(isClassComponent(FunctionComponent)).to.be.false;
    expect(isClassComponent(ClassComponent)).to.be.true;
  });

});

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

    it('should properly pass all invocation arguments as first argument to implementation', () => {
      const Component = () => null;
      let invokeArgs;
      const Mixout = mixout(
        { imperativeMethodInjector: setImperativeMethod => setImperativeMethod('focus', args => invokeArgs = args) }
      )(Component);
      const wrapper = shallow(React.createElement(Mixout));
      wrapper.instance()['focus'](1, null, 'hello');
      expect(invokeArgs).to.deep.equal([1, null, 'hello']);
    });

    it('should properly pass ownProps to implementation', () => {
      const Component = () => null;
      let invokeProps;
      const implementation = (args, ownProps) => invokeProps = ownProps;
      const Mixout = mixout(
        { imperativeMethodInjector: setImperativeMethod => setImperativeMethod('focus', implementation) }
      )(Component);
      const wrapper = shallow(React.createElement(Mixout, { foo: 'bar' }));
      wrapper.instance()['focus']();
      expect(invokeProps.foo).to.be.equals('bar');
    });

    it('should properly pass ownContext to implementation', () => {
      const Component = () => null;
      let foo;
      const implementation = (args, ownProps, ownContext) => foo = ownContext.foo;
      const Mixout = mixout(
        {
          contextTypeInjector: ((setContextType => setContextType('foo', React.PropTypes.string))),
          imperativeMethodInjector: setImperativeMethod => setImperativeMethod('focus', implementation),
        }
      )(Component);
      const wrapper = shallow(React.createElement(Mixout), { context: { foo: 'bar' } });
      wrapper.instance()['focus']();
      expect(foo).to.be.equals('bar');
    });

    it('should properly pass own isolated state to implementation', () => {
      const Component = () => null;
      const implementation = (args, ownProps, ownContext, ownState) => ownState['foo'];
      const Mixout = mixout(
        {
          initialStateInjector: (p, c, s) => s['foo'] = 1,
          imperativeMethodInjector: setImperativeMethod => setImperativeMethod('focus', implementation),
        }
      )(Component);
      const wrapper = shallow(React.createElement(Mixout));
      expect(wrapper.instance()['focus']()).to.be.equals(1);
    });

    it('should properly pass undefined as child if child is function component', () => {
      const Component = () => null;
      const implementation = (args, ownProps, ownContext, ownState, child) => child;
      const Mixout = mixout(
        { imperativeMethodInjector: setImperativeMethod => setImperativeMethod('focus', implementation) }
      )(Component);
      const wrapper = mount(React.createElement(Mixout));
      expect(wrapper.instance()['focus']()).to.be.undefined;
    });

    it('should properly pass instance as child if child is class component', () => {
      const Component = class extends React.Component<any, any> {
        foo() { return 1; }
        render() { return null; }
      };
      const implementation = (args, ownProps, ownContext, ownState, child) => child;
      const Mixout = mixout(
        { imperativeMethodInjector: setImperativeMethod => setImperativeMethod('focus', implementation) }
      )(Component);
      const wrapper = mount(React.createElement(Mixout));
      expect(wrapper.instance()['focus']().foo()).to.be.equals(1);
    });

  });

  describe('componentWillMountHook/componentDidMountHook', () => {

    it('should properly pass ownProps to hooks', () => {
      const Component = () => null;
      let foo, bar;
      const Mixout = mixout(
        {
          componentWillMountHook: ownProps => foo = ownProps.foo,
          componentDidMountHook: ownProps => bar = ownProps.bar,
        }
      )(Component);
      const wrapper = mount(React.createElement(Mixout, { foo: 'foo', bar: 'bar' }));
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should properly pass ownContext to hooks', () => {
      const Component = () => null;
      let foo, bar;
      const Mixout = mixout(
        {
          componentWillMountHook: (ownProps, ownContext) => foo = ownContext.foo,
          componentDidMountHook: (ownProps, ownContext) => bar = ownContext.bar,
        }
      )(Component);
      const wrapper = mount(React.createElement(Mixout), {
        context: { foo: 'foo', bar: 'bar' },
        childContextTypes: { foo: React.PropTypes.string, bar: React.PropTypes.string },
      });
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should properly pass ownState to hooks', () => {
      const Component = () => null;
      let foo, bar;
      const Mixout = mixout(
        {
          initialStateInjector: (p, c, ownState) => { ownState.foo = 'foo'; ownState.bar = 'bar'; },
          componentWillMountHook: (ownProps, ownContext, ownState) => foo = ownState.foo,
          componentDidMountHook: (ownProps, ownContext, ownState) => bar = ownState.bar,
        }
      )(Component);
      const wrapper = mount(React.createElement(Mixout));
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should properly pass child if child is class and undefined if not to componentDidMount hooks', () => {
      const FunctionComponent = () => null;
      const ClassComponent = class extends React.Component<any, any> {
        foo() { return 1; }
        render() { return null; }
      };
      let theChild;
      const mountTester = mixout(
        {
          componentDidMountHook: (p, c, s, child) => theChild = child,
        }
      );
      mount(React.createElement(mountTester(FunctionComponent)));
      expect(theChild).to.be.undefined;
      mount(React.createElement(mountTester(ClassComponent)));
      expect(theChild.foo()).to.be.equals(1);
    });

  });

  describe('componentWillReceivePropsHook', () => {

    it('should properly pass nextProps and nextContext to hooks', () => {
      const Component = () => null;
      let foo, bar;
      const Mixout = mixout(
        { componentWillReceivePropsHook: (nextProps, nextContext) => foo = nextProps.foo },
        { componentWillReceivePropsHook: (nextProps, nextContext) => bar = nextContext.bar }
      )(Component);
      const wrapper = mount(React.createElement(Mixout), {
        context: { bar: '' },
        childContextTypes: { bar: React.PropTypes.string },
      });
      expect(foo).to.be.undefined;
      expect(bar).to.be.undefined;
      wrapper.setContext({ bar: 'bar' });
      wrapper.setProps({ foo: 'foo' });
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should properly pass ownProps and ownContext to hooks', () => {
      const Component = () => null;
      let foo, bar;
      const Mixout = mixout(
        { componentWillReceivePropsHook: (np, nc, ownProps, ownContext) => foo = ownProps.foo },
        { componentWillReceivePropsHook: (np, nc, ownProps, ownContext) => bar = ownContext.bar }
      )(Component);
      const wrapper = mount(React.createElement(Mixout, { foo: 'foo' }), {
        context: { bar: 'bar' },
        childContextTypes: { bar: React.PropTypes.string },
      });
      expect(foo).to.be.undefined;
      expect(bar).to.be.undefined;
      wrapper.setProps({ foo: 'fo1' });
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should properly pass own isolated state to hooks', () => {
      const Component = () => null;
      let foo, bar;
      const Mixout = mixout(
        {
          initialStateInjector: (p, c, ownState) => ownState.foo = 'foo',
          componentWillReceivePropsHook: (np, nc, p, C, ownState) => foo = ownState.foo,
        },
        {
          initialStateInjector: (p, c, ownState) => ownState.bar = 'bar',
          componentWillReceivePropsHook: (np, nc, p, C, ownState) => bar = ownState.bar,
        }
      )(Component);
      const wrapper = mount(React.createElement(Mixout));
      expect(foo).to.be.undefined;
      expect(bar).to.be.undefined;
      wrapper.setProps({ blah: 'blah' });
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should properly pass child if child is class and undefined if not to hooks', () => {
      const FunctionComponent = () => null;
      const ClassComponent = class extends React.Component<any, any> {
        foo() { return 1; }
        render() { return null; }
      };
      let theChild;
      const mountTester = mixout(
        { componentWillReceivePropsHook: (np, nc, p, c, s, child) => theChild = child }
      );
      const wrapper1 = mount(React.createElement(mountTester(FunctionComponent)));
      wrapper1.setProps({ blah: 'blah' });
      expect(theChild).to.be.undefined;
      const wrapper2 = mount(React.createElement(mountTester(ClassComponent)));
      wrapper2.setProps({ blah: 'blah' });
      expect(theChild.foo()).to.be.equals(1);
    });

  });

  describe('shouldComponentUpdateHook', () => {

    it('should properly pass nextProps and nextContext to hooks', () => {
      const Component = () => null;
      let foo, bar;
      const Mixout = mixout(
        { shouldComponentUpdateHook: (nextProps, nextContext) => foo = nextProps.foo },
        { shouldComponentUpdateHook: (nextProps, nextContext) => bar = nextContext.bar }
      )(Component);
      const wrapper = mount(React.createElement(Mixout), {
        context: { bar: '' },
        childContextTypes: { bar: React.PropTypes.string },
      });
      expect(foo).to.be.undefined;
      expect(bar).to.be.undefined;
      wrapper.setContext({ bar: 'bar' });
      wrapper.setProps({ foo: 'foo' });
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should properly pass ownProps and ownContext to hooks', () => {
      const Component = () => null;
      let foo, bar;
      const Mixout = mixout(
        { shouldComponentUpdateHook: (np, nc, ownProps, ownContext) => foo = ownProps.foo },
        { shouldComponentUpdateHook: (np, nc, ownProps, ownContext) => bar = ownContext.bar }
      )(Component);
      const wrapper = mount(React.createElement(Mixout, { foo: 'foo' }), {
        context: { bar: 'bar' },
        childContextTypes: { bar: React.PropTypes.string },
      });
      expect(foo).to.be.undefined;
      expect(bar).to.be.undefined;
      wrapper.setProps({ foo: 'fo1' });
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should stop rendering only if all hooks explicitly return false', () => {
      let renders = 0;
      const Component = () => { renders++; return null; };
      let hook1 = true;
      let hook2 = true;
      let hook3 = true;
      const Mixout = mixout(
        { shouldComponentUpdateHook: () => hook1 },
        { shouldComponentUpdateHook: () => hook2 },
        { shouldComponentUpdateHook: () => hook3 }
      )(Component);
      const wrapper = mount(React.createElement(Mixout));
      expect(renders).to.be.equals(1);
      wrapper.setProps({ foo: 'foo' });
      expect(renders).to.be.equals(2);
      hook1 = false;
      hook2 = true;
      hook3 = false;
      wrapper.setProps({ foo: 'foo' });
      expect(renders).to.be.equals(3);
      hook1 = false;
      hook2 = undefined;
      hook3 = false;
      wrapper.setProps({ foo: 'foo' });
      expect(renders).to.be.equals(4);
      hook1 = false;
      hook2 = {} as any;
      hook3 = false;
      wrapper.setProps({ foo: 'foo' });
      expect(renders).to.be.equals(5);
      hook1 = false;
      hook2 = false;
      hook3 = false;
      wrapper.setProps({ foo: 'foo1' });
      wrapper.setProps({ foo1: 'foo1' });
      wrapper.setProps({ foo2: 'foo2' });
      expect(renders).to.be.equals(5);
    });

  });

});
