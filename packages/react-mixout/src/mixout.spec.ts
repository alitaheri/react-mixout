import { expect } from 'chai';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { shallow, mount } from 'enzyme';

import mixout, { isClassComponent } from './mixout';
import remix from './remix';

describe('react-mixout: isClassComponent', () => {

  it('should correctly determine if passed component is class based', () => {
    const FunctionComponent = () => null;
    const ClassComponent = class extends React.Component<any, any>{ public render() { return null; } };
    expect(isClassComponent(FunctionComponent)).to.be.equals(false);
    expect(isClassComponent(ClassComponent)).to.be.equals(true);
  });

});

describe('react-mixout: mixout', () => {

  describe('contextTypeInjector', () => {

    it('should properly add or override context validators', () => {
      const Mixout = mixout(
        {
          contextTypeInjector: (setContextType) => {
            setContextType('a', PropTypes.number);
            setContextType('b', PropTypes.string);
            setContextType('c', PropTypes.any);
            setContextType('a', PropTypes.any);
          },
        },
        {
          contextTypeInjector: (setContextType) => {
            setContextType('d', PropTypes.number);
            setContextType('e', PropTypes.string);
            setContextType('f', PropTypes.any);
            setContextType('e', PropTypes.bool);
          },
        },
      )(() => null!);

      expect(Mixout.contextTypes!['a']).to.be.equals(PropTypes.any);
      expect(Mixout.contextTypes!['b']).to.be.equals(PropTypes.string);
      expect(Mixout.contextTypes!['c']).to.be.equals(PropTypes.any);
      expect(Mixout.contextTypes!['d']).to.be.equals(PropTypes.number);
      expect(Mixout.contextTypes!['e']).to.be.equals(PropTypes.bool);
      expect(Mixout.contextTypes!['f']).to.be.equals(PropTypes.any);
    });

  });

  describe('childContextTypeInjector', () => {

    it('should properly add or override child context validators', () => {
      const Mixout = mixout(
        {
          childContextTypeInjector: (setChildContextType) => {
            setChildContextType('a', PropTypes.number);
            setChildContextType('b', PropTypes.string);
            setChildContextType('c', PropTypes.any);
            setChildContextType('a', PropTypes.any);
          },
        },
        {
          childContextTypeInjector: (setChildContextType) => {
            setChildContextType('d', PropTypes.number);
            setChildContextType('e', PropTypes.string);
            setChildContextType('f', PropTypes.any);
            setChildContextType('e', PropTypes.bool);
          },
        },
      )(() => null!);

      expect(Mixout.childContextTypes!['a']).to.be.equals(PropTypes.any);
      expect(Mixout.childContextTypes!['b']).to.be.equals(PropTypes.string);
      expect(Mixout.childContextTypes!['c']).to.be.equals(PropTypes.any);
      expect(Mixout.childContextTypes!['d']).to.be.equals(PropTypes.number);
      expect(Mixout.childContextTypes!['e']).to.be.equals(PropTypes.bool);
      expect(Mixout.childContextTypes!['f']).to.be.equals(PropTypes.any);
    });

  });

  describe('propTypeInjector', () => {

    it('should properly add or override default props and validators', () => {
      const obj = {};
      const Mixout = mixout(
        {
          propTypeInjector: (setPropType) => {
            setPropType('a', PropTypes.number, 1);
            setPropType('b', PropTypes.string);
            setPropType('c', PropTypes.any, obj);
            setPropType('a', PropTypes.any);
          },
        },
        {
          propTypeInjector: (setPropType) => {
            setPropType('d', PropTypes.number, 5);
            setPropType('e', PropTypes.string);
            setPropType('f', PropTypes.any, obj);
            setPropType('e', PropTypes.bool, true);
          },
        },
      )(() => null!);

      expect((<any>Mixout).propTypes['a']).to.be.equals(PropTypes.any);
      expect((<any>Mixout).propTypes['b']).to.be.equals(PropTypes.string);
      expect((<any>Mixout).propTypes['c']).to.be.equals(PropTypes.any);
      expect((<any>Mixout).propTypes['d']).to.be.equals(PropTypes.number);
      expect((<any>Mixout).propTypes['e']).to.be.equals(PropTypes.bool);
      expect((<any>Mixout).propTypes['f']).to.be.equals(PropTypes.any);

      expect(Mixout.defaultProps).not.to.haveOwnProperty('a');
      expect(Mixout.defaultProps).not.to.haveOwnProperty('b');
      expect((<any>Mixout.defaultProps)['c']).to.be.equals(obj);
      expect((<any>Mixout.defaultProps)['d']).to.be.equals(5);
      expect((<any>Mixout.defaultProps)['e']).to.be.equals(true);
      expect((<any>Mixout.defaultProps)['f']).to.be.equals(obj);
    });

  });

  describe('propInjector', () => {

    it('should properly add or override passed props', () => {
      const Component = () => null!;
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
        },
      )(Component);

      const wrapper = shallow(React.createElement(Mixout));
      expect(wrapper.find(Component).at(0).prop('a')).to.be.equals(1);
      expect(wrapper.find(Component).at(0).prop('b')).to.be.equals(4);
      expect(wrapper.find(Component).at(0).prop('c')).to.be.equals(10);
    });

    it('should properly pass ownProps to injectors', () => {
      const Component = () => null!;
      const Mixout = mixout<{ hello: string, world: string }>(
        { propInjector: (setProp, ownProps) => setProp('a', ownProps.hello) },
        { propInjector: (setProp, ownProps) => setProp('b', ownProps.world) },
      )(Component);

      const wrapper = shallow(React.createElement(Mixout, { hello: 'hello', world: 'world' }));
      expect(wrapper.find(Component).at(0).prop('a')).to.be.equals('hello');
      expect(wrapper.find(Component).at(0).prop('b')).to.be.equals('world');
    });

    it('should properly pass ownContext to injectors', () => {
      const obj = {};
      const Component = () => null!;
      const Mixout = mixout(
        {
          contextTypeInjector: setContextType => setContextType('color', PropTypes.string),
          propInjector: (setProp, _op, ownContext) => setProp('a', ownContext.color),
        },
        {
          contextTypeInjector: setContextType => setContextType('theme', PropTypes.object),
          propInjector: (setProp, _op, ownContext) => setProp('b', ownContext.theme),
        },
      )(Component);
      const wrapper = shallow(React.createElement(Mixout), { context: { color: '#FFF', theme: obj } });
      expect(wrapper.find(Component).at(0).prop('a')).to.be.equals('#FFF');
      expect(wrapper.find(Component).at(0).prop('b')).to.be.equals(obj);
    });

    it('should properly pass ownState to injectors', () => {
      const Component = () => null!;
      const Mixout = mixout(
        {
          initialStateInjector: (_p, _c, s) => s['foo'] = 'bar',
          propInjector: (setProp, _op, _oc, ownState) => setProp('a', ownState.foo),
        },
        {
          initialStateInjector: (_p, _c, s) => s['baz'] = 'foobar',
          propInjector: (setProp, _op, _oc, ownState) => setProp('b', ownState.baz),
        },
      )(Component);
      const wrapper = shallow(React.createElement(Mixout));
      expect(wrapper.find(Component).at(0).prop('a')).to.be.equals('bar');
      expect(wrapper.find(Component).at(0).prop('b')).to.be.equals('foobar');
    });

  });

  describe('contextInjector', () => {

    it('should properly add or override passed context', () => {
      let passedContext: any = {};
      const Component = (_p: any, context: any) => {
        passedContext = context;
        return null!;
      };

      (<any>Component).contextTypes = {
        a: PropTypes.number,
        b: PropTypes.number,
        c: PropTypes.number,
      };

      const Mixout = mixout(
        {
          childContextTypeInjector: (setChildContextType) => {
            setChildContextType('a', PropTypes.bool);
            setChildContextType('b', PropTypes.number);
          },
          contextInjector: (setContext) => {
            setContext('a', true);
            setContext('b', 4);
          },
        },
        {
          childContextTypeInjector: (setChildContextType) => {
            setChildContextType('c', PropTypes.number);
            setChildContextType('a', PropTypes.number);
          },
          contextInjector: (setContext) => {
            setContext('c', 10);
            setContext('a', 1);
          },
        },
      )(Component);

      mount(React.createElement(Mixout));
      expect(passedContext['a']).to.be.equals(1);
      expect(passedContext['b']).to.be.equals(4);
      expect(passedContext['c']).to.be.equals(10);
    });

    it('should properly pass ownProps to injectors', () => {
      let passedContext: any = {};
      const Component = (_p: any, context: any) => {
        passedContext = context;
        return null!;
      };

      (<any>Component).contextTypes = {
        a: PropTypes.string,
        b: PropTypes.string,
      };

      const Mixout = mixout(
        { childContextTypeInjector: setCCT => setCCT('a', PropTypes.string) },
        { childContextTypeInjector: setCCT => setCCT('b', PropTypes.string) },
        { contextInjector: (setContext, ownProps) => setContext('a', ownProps.hello) },
        { contextInjector: (setContext, ownProps) => setContext('b', ownProps.world) },
      )(Component);

      mount(React.createElement<{ hello: string, world: string }>(Mixout, { hello: 'hello', world: 'world' }));
      expect(passedContext['a']).to.be.equals('hello');
      expect(passedContext['b']).to.be.equals('world');
    });

    it('should properly pass ownContext to injectors', () => {
      const obj = {};
      let passedContext: any = {};
      const Component = (_p: any, context: any) => {
        passedContext = context;
        return null!;
      };

      (<any>Component).contextTypes = {
        a: PropTypes.string,
        b: PropTypes.object,
      };

      const Mixout = mixout(
        {
          childContextTypeInjector: setCCT => setCCT('a', PropTypes.string),
          contextInjector: (setContext, _op, ownContext) => setContext('a', ownContext.color),
          contextTypeInjector: setContextType => setContextType('color', PropTypes.string),
        },
        {
          childContextTypeInjector: setCCT => setCCT('b', PropTypes.string),
          contextInjector: (setContext, _op, ownContext) => setContext('b', ownContext.theme),
          contextTypeInjector: setContextType => setContextType('theme', PropTypes.object),
        },
      )(Component);
      mount(React.createElement(Mixout), {
        childContextTypes: { color: PropTypes.string, theme: PropTypes.object },
        context: { color: '#FFF', theme: obj },
      });
      expect(passedContext['a']).to.be.equals('#FFF');
      expect(passedContext['b']).to.be.equals(obj);
    });

    it('should properly pass ownState to injectors', () => {
      let passedContext: any = {};
      const Component = (_p: any, context: any) => {
        passedContext = context;
        return null!;
      };

      (<any>Component).contextTypes = {
        a: PropTypes.string,
        b: PropTypes.string,
      };

      const Mixout = mixout(
        {
          childContextTypeInjector: setCCT => setCCT('a', PropTypes.string),
          contextInjector: (setContext, _op, _oc, ownState) => setContext('a', ownState.foo),
          initialStateInjector: (_p, _c, s) => s['foo'] = 'bar',
        },
        {
          childContextTypeInjector: setCCT => setCCT('b', PropTypes.string),
          contextInjector: (setContext, _op, _oc, ownState) => setContext('b', ownState.baz),
          initialStateInjector: (_p, _c, s) => s['baz'] = 'foobar',
        },
      )(Component);
      mount(React.createElement(Mixout));
      expect(passedContext['a']).to.be.equals('bar');
      expect(passedContext['b']).to.be.equals('foobar');
    });

  });

  describe('initialStateInjector', () => {

    it('should properly pass props as argument', () => {
      const Component = () => null!;
      let foo: any;
      let foobar: any;
      const Mixout = mixout<{ foo: string, foobar: string }>(
        { initialStateInjector: ownProps => foo = ownProps['foo'] },
        { initialStateInjector: ownProps => foobar = ownProps['foobar'] },
      )(Component);
      shallow(React.createElement(Mixout, { foo: '1', foobar: '2' }));
      expect(foo).to.be.equals('1');
      expect(foobar).to.be.equals('2');
    });

    it('should properly pass context as argument', () => {
      const Component = () => null!;
      let foo: any;
      let foobar: any;
      const Mixout = mixout(
        {
          contextTypeInjector: ((setContextType => setContextType('foo', PropTypes.string))),
          initialStateInjector: (_op, ownContext) => foo = ownContext['foo'],
        },
        {
          contextTypeInjector: ((setContextType => setContextType('foobar', PropTypes.string))),
          initialStateInjector: (_op, ownContext) => foobar = ownContext['foobar'],
        },
      )(Component);
      shallow(React.createElement(Mixout), { context: { foo: '1', foobar: '2' } });
      expect(foo).to.be.equals('1');
      expect(foobar).to.be.equals('2');
    });

    it('should properly pass own isolated state that is unique per injector', () => {
      const Component = () => null!;
      let s1: any;
      let s2: any;
      let s3: any;
      const Mixout = mixout(
        { initialStateInjector: (_op, _oc, ownState) => s1 = ownState },
        { initialStateInjector: (_op, _oc, ownState) => s2 = ownState },
        { initialStateInjector: (_op, _oc, ownState) => s3 = ownState },
      )(Component);
      shallow(React.createElement(Mixout));
      expect(s1).to.be.an('object');
      expect(s2).to.be.an('object');
      expect(s3).to.be.an('object');
      expect(s1).not.to.be.equals(s2);
      expect(s2).not.to.be.equals(s3);
    });

    it('should properly pass down a functional forceUpdater', () => {
      const Component = () => null!;
      let updater1: any;
      let updater2: any;
      let renders = 0;
      const Mixout = mixout(
        { initialStateInjector: (_op, _oc, _os, forceUpdater) => updater1 = forceUpdater },
        { initialStateInjector: (_op, _oc, _os, forceUpdater) => updater2 = forceUpdater },
        { propInjector: () => renders++ },
      )(Component);
      shallow(React.createElement(Mixout));
      expect(renders).to.be.equals(1);
      expect(updater1).to.be.equals(updater2);
      let called = false;
      const callback = () => called = true;
      updater1(callback);
      expect(called).to.be.equals(true);
      expect(renders).to.be.equals(2);
      updater2();
      expect(renders).to.be.equals(3);
    });

  });

  describe('imperativeMethodInjector', () => {

    it('should properly set imprative method on the mixout', () => {
      const Component = () => null!;
      let focusCalled = false;
      let blurCalled = false;
      const Mixout = mixout(
        { imperativeMethodInjector: setImperativeMethod => setImperativeMethod('focus', () => focusCalled = true) },
        { imperativeMethodInjector: setImperativeMethod => setImperativeMethod('blue', () => blurCalled = true) },
      )(Component);
      const wrapper = shallow(React.createElement(Mixout));
      (<any>wrapper.instance())['focus']();
      expect(focusCalled).to.be.equals(true);
      expect(blurCalled).to.be.equals(false);
      (<any>wrapper.instance())['blue']();
      expect(focusCalled).to.be.equals(true);
      expect(blurCalled).to.be.equals(true);
    });

    it('should properly return the result of imperative method call', () => {
      const Component = () => null!;
      const Mixout = mixout(
        {
          imperativeMethodInjector: setImperativeMethod =>
            setImperativeMethod('focus', () => 'focused'),
        },
      )(Component);
      const wrapper = shallow(React.createElement(Mixout));
      expect((<any>wrapper.instance())['focus']()).to.be.equals('focused');
    });

    it('should properly pass all invocation arguments as first argument to implementation', () => {
      const Component = () => null!;
      let invokeArgs: any;
      const Mixout = mixout(
        {
          imperativeMethodInjector: setImperativeMethod =>
            setImperativeMethod('focus', args => invokeArgs = args),
        },
      )(Component);
      const wrapper = shallow(React.createElement(Mixout));
      (<any>wrapper.instance())['focus'](1, null, 'hello');
      expect(invokeArgs).to.deep.equal([1, null, 'hello']);
    });

    it('should properly pass ownProps to implementation', () => {
      const Component = () => null!;
      let invokeProps: any;
      const implementation = (_: any, ownProps: any) => invokeProps = ownProps;
      const Mixout = mixout<{ foo: string }>(
        { imperativeMethodInjector: setImperativeMethod => setImperativeMethod('focus', implementation) },
      )(Component);
      const wrapper = shallow(React.createElement(Mixout, { foo: 'bar' }));
      (<any>wrapper.instance())['focus']();
      expect(invokeProps.foo).to.be.equals('bar');
    });

    it('should properly pass ownContext to implementation', () => {
      const Component = () => null!;
      let foo: any;
      const implementation = (_args: any, _op: any, ownContext: any) => foo = ownContext.foo;
      const Mixout = mixout(
        {
          contextTypeInjector: ((setContextType => setContextType('foo', PropTypes.string))),
          imperativeMethodInjector: setImperativeMethod => setImperativeMethod('focus', implementation),
        },
      )(Component);
      const wrapper = shallow(React.createElement(Mixout), { context: { foo: 'bar' } });
      (<any>wrapper.instance())['focus']();
      expect(foo).to.be.equals('bar');
    });

    it('should properly pass own isolated state to implementation', () => {
      const Component = () => null!;
      const implementation = (_args: any, _op: any, _oc: any, ownState: any) => ownState['foo'];
      const Mixout = mixout(
        {
          imperativeMethodInjector: setImperativeMethod => setImperativeMethod('focus', implementation),
          initialStateInjector: (_p, _c, s) => s['foo'] = 1,
        },
      )(Component);
      const wrapper = shallow(React.createElement(Mixout));
      expect((<any>wrapper.instance())['focus']()).to.be.equals(1);
    });

    it('should properly pass undefined as child if child is function component', () => {
      const Component = () => null!;
      const implementation = (_args: any, _op: any, _oc: any, _os: any, child: any) => child;
      const Mixout = mixout(
        { imperativeMethodInjector: setImperativeMethod => setImperativeMethod('focus', implementation) },
      )(Component);
      const wrapper = mount(React.createElement(Mixout));
      expect((<any>wrapper.instance())['focus']()).to.be.equals(undefined);
    });

    it('should properly pass instance as child if child is class component', () => {
      const Component = class extends React.Component<any, any> {
        public foo() { return 1; }
        public render() { return null; }
      };
      const implementation = (_args: any, _op: any, _oc: any, _os: any, child: any) => child;
      const Mixout = mixout(
        { imperativeMethodInjector: setImperativeMethod => setImperativeMethod('focus', implementation) },
      )(Component);
      const wrapper = mount(React.createElement(Mixout));
      expect((<any>wrapper.instance())['focus']().foo()).to.be.equals(1);
    });

  });

  describe('componentWillMountHook/componentDidMountHook', () => {

    it('should properly pass ownProps to hooks', () => {
      const Component = () => null!;
      let foo: any;
      let bar: any;
      const Mixout = mixout<{ foo: string, bar: string }>(
        {
          componentDidMountHook: ownProps => bar = ownProps.bar,
          componentWillMountHook: ownProps => foo = ownProps.foo,
        },
      )(Component);
      mount(React.createElement(Mixout, { foo: 'foo', bar: 'bar' }));
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should properly pass ownContext to hooks', () => {
      const Component = () => null!;
      let foo: any;
      let bar: any;
      const Mixout = mixout(
        {
          componentDidMountHook: (_op, ownContext) => bar = ownContext.bar,
          componentWillMountHook: (_op, ownContext) => foo = ownContext.foo,
        },
      )(Component);
      mount(React.createElement(Mixout), {
        childContextTypes: { foo: PropTypes.string, bar: PropTypes.string },
        context: { foo: 'foo', bar: 'bar' },
      });
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should properly pass ownState to hooks', () => {
      const Component = () => null!;
      let foo: any;
      let bar: any;
      const Mixout = mixout(
        {
          componentDidMountHook: (_op, _oc, ownState) => bar = ownState.bar,
          componentWillMountHook: (_op, _oc, ownState) => foo = ownState.foo,
          initialStateInjector: (_p, _c, ownState) => { ownState.foo = 'foo'; ownState.bar = 'bar'; },
        },
      )(Component);
      mount(React.createElement(Mixout));
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should properly pass child if child is class and undefined if not to componentDidMount hooks', () => {
      const FunctionComponent = () => null!;
      const ClassComponent = class extends React.Component<any, any> {
        public foo() { return 1; }
        public render() { return null; }
      };
      let theChild: any;
      const mountTester = mixout(
        {
          componentDidMountHook: (_p, _c, _s, child) => theChild = child,
        },
      );
      mount(React.createElement(mountTester(FunctionComponent)));
      expect(theChild).to.be.equals(undefined);
      mount(React.createElement(mountTester(ClassComponent)));
      expect(theChild.foo()).to.be.equals(1);
    });

  });

  describe('componentWillReceivePropsHook', () => {

    it('should properly pass nextProps and nextContext to hooks', () => {
      const Component = () => null!;
      let foo: any;
      let bar: any;
      const Mixout = mixout<{ foo: string, bar?: string }>(
        { componentWillReceivePropsHook: nextProps => foo = nextProps.foo },
        { componentWillReceivePropsHook: (_np, nextContext) => bar = nextContext.bar },
      )(Component);
      const wrapper = mount(React.createElement(Mixout), {
        childContextTypes: { bar: PropTypes.string },
        context: { bar: '' },
      });
      expect(foo).to.be.equals(undefined);
      expect(bar).to.be.equals(undefined);
      wrapper.setContext({ bar: 'bar' });
      wrapper.setProps({ foo: 'foo' });
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should properly pass ownProps and ownContext to hooks', () => {
      const Component = () => null!;
      let foo: any;
      let bar: any;
      const Mixout = mixout<{ foo: string }>(
        { componentWillReceivePropsHook: (_np, _nc, ownProps) => foo = ownProps.foo },
        { componentWillReceivePropsHook: (_np, _nc, _op, ownContext) => bar = ownContext.bar },
      )(Component);
      const wrapper = mount(React.createElement(Mixout, { foo: 'foo' }), {
        childContextTypes: { bar: PropTypes.string },
        context: { bar: 'bar' },
      });
      expect(foo).to.be.equals(undefined);
      expect(bar).to.be.equals(undefined);
      wrapper.setProps({ foo: 'fo1' });
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should properly pass own isolated state to hooks', () => {
      const Component = () => null!;
      let foo: any;
      let bar: any;
      const Mixout = mixout<{ blah: string }>(
        {
          componentWillReceivePropsHook: (_np, _nc, _p, _c, ownState) => foo = ownState.foo,
          initialStateInjector: (_p, _c, ownState) => ownState.foo = 'foo',
        },
        {
          componentWillReceivePropsHook: (_np, _nc, _p, _c, ownState) => bar = ownState.bar,
          initialStateInjector: (_p, _c, ownState) => ownState.bar = 'bar',
        },
      )(Component);
      const wrapper = mount(React.createElement(Mixout));
      expect(foo).to.be.equals(undefined);
      expect(bar).to.be.equals(undefined);
      wrapper.setProps({ blah: 'blah' });
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should properly pass child if child is class and undefined if not to hooks', () => {
      const FunctionComponent = () => null!;
      const ClassComponent = class extends React.Component<any, any> {
        public foo() { return 1; }
        public render() { return null; }
      };
      let theChild: any;
      const mountTester = mixout<{ blah: string }>(
        { componentWillReceivePropsHook: (_np, _nc, _p, _c, _s, child) => theChild = child },
      );
      const wrapper1 = mount(React.createElement(mountTester(FunctionComponent)));
      wrapper1.setProps({ blah: 'blah' });
      expect(theChild).to.be.equals(undefined);
      const wrapper2 = mount(React.createElement(mountTester(ClassComponent)));
      wrapper2.setProps({ blah: 'blah' });
      expect(theChild.foo()).to.be.equals(1);
    });

  });

  describe('shouldComponentUpdateHook', () => {

    it('should properly pass nextProps and nextContext to hooks', () => {
      const Component = () => null!;
      let foo: any;
      let bar: any;
      const Mixout = mixout<{ foo: string }>(
        { shouldComponentUpdateHook: nextProps => foo = nextProps.foo },
        { shouldComponentUpdateHook: (_np, nextContext) => bar = nextContext.bar },
      )(Component);
      const wrapper = mount(React.createElement(Mixout), {
        childContextTypes: { bar: PropTypes.string },
        context: { bar: '' },
      });
      expect(foo).to.be.equals(undefined);
      expect(bar).to.be.equals(undefined);
      wrapper.setContext({ bar: 'bar' });
      wrapper.setProps({ foo: 'foo' });
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should properly pass ownProps and ownContext to hooks', () => {
      const Component = () => null!;
      let foo: any;
      let bar: any;
      const Mixout = mixout<{ foo: string }>(
        { shouldComponentUpdateHook: (_np, _nc, ownProps) => foo = ownProps.foo },
        { shouldComponentUpdateHook: (_np, _nc, _op, ownContext) => bar = ownContext.bar },
      )(Component);
      const wrapper = mount(React.createElement(Mixout, { foo: 'foo' }), {
        childContextTypes: { bar: PropTypes.string },
        context: { bar: 'bar' },
      });
      expect(foo).to.be.equals(undefined);
      expect(bar).to.be.equals(undefined);
      wrapper.setProps({ foo: 'fo1' });
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should stop rendering only if all hooks explicitly return false', () => {
      let renders = 0;
      const Component = () => { renders++; return null!; };
      let hook1 = true;
      let hook2 = true;
      let hook3 = true;
      const Mixout = mixout<{ foo?: string; foo1?: string; foo2?: string }>(
        { shouldComponentUpdateHook: () => hook1 },
        { shouldComponentUpdateHook: () => hook2 },
        { shouldComponentUpdateHook: () => hook3 },
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
      hook2 = undefined!;
      hook3 = false;
      wrapper.setProps({ foo: 'foo' });
      expect(renders).to.be.equals(4);
      hook1 = false;
      hook2 = <any>{};
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

  describe('componentWillUpdateHook/componentDidUpdateHook', () => {

    it('should properly pass nextProps and nextContext to hooks', () => {
      const Component = () => null!;
      let foo: any;
      let bar: any;
      const Mixout = mixout<{ foo: string }>(
        { componentWillUpdateHook: (nextProps) => foo = nextProps.foo },
        { componentDidUpdateHook: (_np, nextContext) => bar = nextContext.bar },
      )(Component);
      const wrapper = mount(React.createElement(Mixout), {
        childContextTypes: { bar: PropTypes.string },
        context: { bar: '' },
      });
      expect(foo).to.be.equals(undefined);
      expect(bar).to.be.equals(undefined);
      wrapper.setContext({ bar: 'bar' });
      wrapper.setProps({ foo: 'foo' });
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should properly pass ownProps and ownContext to hooks', () => {
      const Component = () => null!;
      let foo: any;
      let bar: any;
      const Mixout = mixout<{ foo: string }>(
        { componentWillUpdateHook: (_np, _nc, ownProps) => foo = ownProps.foo },
        { componentDidUpdateHook: (_np, _nc, _op, ownContext) => bar = ownContext.bar },
      )(Component);
      const wrapper = mount(React.createElement(Mixout, { foo: 'foo' }), {
        childContextTypes: { bar: PropTypes.string },
        context: { bar: 'bar' },
      });
      expect(foo).to.be.equals(undefined);
      expect(bar).to.be.equals(undefined);
      wrapper.setProps({ foo: 'fo1' });
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should properly pass own isolated state to hooks', () => {
      const Component = () => null!;
      let foo: any;
      let bar: any;
      const Mixout = mixout<{ blah: string }>(
        {
          componentWillUpdateHook: (_np, _nc, _p, _c, ownState) => foo = ownState.foo,
          initialStateInjector: (_p, _c, ownState) => ownState.foo = 'foo',
        },
        {
          componentDidUpdateHook: (_np, _nc, _p, _c, ownState) => bar = ownState.bar,
          initialStateInjector: (_p, _c, ownState) => ownState.bar = 'bar',
        },
      )(Component);
      const wrapper = mount(React.createElement(Mixout));
      expect(foo).to.be.equals(undefined);
      expect(bar).to.be.equals(undefined);
      wrapper.setProps({ blah: 'blah' });
      expect(foo).to.be.equals('foo');
      expect(bar).to.be.equals('bar');
    });

    it('should properly pass child if child is class and undefined if not to hooks', () => {
      const FunctionComponent = () => null!;
      const ClassComponent = class GenericComponent<T> extends React.Component<T, any> {
        public foo() { return 1; }
        public render() { return null; }
      };
      let child1: any;
      let child2: any;
      const mountTester = mixout<{ blah: string }>(
        {
          componentDidUpdateHook: (_np, _nc, _p, _c, _s, child) => child2 = child,
          componentWillUpdateHook: (_np, _nc, _p, _c, _s, child) => child1 = child,
        },
      );

      const wrapper1 = mount(React.createElement(mountTester(FunctionComponent)));
      wrapper1.setProps({ blah: 'blah' });
      expect(child1).to.be.equals(undefined);
      expect(child2).to.be.equals(undefined);
      const wrapper2 = mount(React.createElement(mountTester(ClassComponent)));
      wrapper2.setProps({ blah: 'blah' });
      expect(child1).to.be.equals(child2);
      expect(child1.foo()).to.be.equals(1);
    });

  });

  describe('componentWillUnmountHook', () => {

    it('should properly pass ownProps to hooks', () => {
      const Component = () => null!;
      let foo: any;
      const Mixout = mixout<{ foo: string }>(
        { componentWillUnmountHook: ownProps => foo = ownProps.foo },
      )(Component);
      const wrapper = mount(React.createElement(Mixout, { foo: 'foo' }));
      expect(foo).to.be.equals(undefined);
      wrapper.unmount();
      expect(foo).to.be.equals('foo');
    });

    it('should properly pass ownContext to hooks', () => {
      const Component = () => null!;
      let foo: any;
      const Mixout = mixout(
        { componentWillUnmountHook: (_op, ownContext) => foo = ownContext.foo },
      )(Component);
      const wrapper = mount(React.createElement(Mixout), {
        childContextTypes: { foo: PropTypes.string },
        context: { foo: 'foo' },
      });
      expect(foo).to.be.equals(undefined);
      wrapper.unmount();
      expect(foo).to.be.equals('foo');
    });

    it('should properly pass ownState to hooks', () => {
      const Component = () => null!;
      let foo: any;
      const Mixout = mixout(
        {
          componentWillUnmountHook: (_op, _oc, ownState) => foo = ownState.foo,
          initialStateInjector: (_p, _c, ownState) => ownState.foo = 'foo',
        },
      )(Component);
      const wrapper = mount(React.createElement(Mixout));
      expect(foo).to.be.equals(undefined);
      wrapper.unmount();
      expect(foo).to.be.equals('foo');
    });

  });

  describe('remix integration', () => {

    it('should properly set displayName', () => {
      const Mixout = mixout()(remix('Button', () => null!));
      expect(Mixout.displayName).to.be.equals('Button');
    });

    it('should properly call renderer with passedProps', () => {
      let passedProps: any;
      const Mixout = mixout()(remix('Button', (props: { foo: string }) => {
        passedProps = props;
        return null!;
      }));

      shallow(React.createElement(Mixout, <any>{ foo: 'foo' }));
      expect(passedProps.foo).to.be.equals('foo');
    });

    it('should properly return renderer\'s output as it\'s own', () => {
      const Mixout = mixout<{ foo: string }>()(remix('Button', () => React.createElement('span')));
      const wrapper = shallow(React.createElement(Mixout, { foo: 'foo' }));
      expect(wrapper.contains(React.createElement('span'))).to.be.equals(true);
    });

  });

});
