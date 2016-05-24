/// <reference path="../../../typings/index.d.ts" />

import {expect} from 'chai';

import {Injector, decompose} from './injector';

describe('react-mixout: decompose', () => {

  it('should not mutate any of the injectors', () => {
    const shouldComponentUpdateHook = () => null;
    const propInjector = () => null;
    const componentWillReceivePropsHook = () => null;
    const propTypeInjector = () => null;
    const injector1: Injector = {
      shouldComponentUpdateHook,
      propInjector,
    };
    const injector2: Injector = {
      componentWillReceivePropsHook,
      propTypeInjector,
    };
    decompose([injector1, injector2]);
    expect(injector1).to.deep.equal({
      shouldComponentUpdateHook,
      propInjector,
    });
    expect(injector2).to.deep.equal({
      componentWillReceivePropsHook,
      propTypeInjector,
    });
  });

  it('should add ids to hooks and injectors that work with state', () => {
    const injector1: Injector = {
      propInjector: () => null,
      componentDidUpdateHook: () => null,
    };
    const injector2: Injector = {
      componentWillReceivePropsHook: () => null,
      imperativeMethodInjector: () => null,
    };
    const injector3: Injector = {
      initialStateInjector: () => null,
      componentWillMountHook: () => null,
    };
    const injector4: Injector = {
      componentWillUpdateHook: () => null,
      componentDidMountHook: () => null,
      componentWillUnmountHook: () => null,
    };

    const {
      propInjectors,
      initialStateInjectors,
      imperativeMethodInjectors,
      componentWillMountHooks,
      componentDidMountHooks,
      componentWillReceivePropsHooks,
      componentWillUpdateHooks,
      componentDidUpdateHooks,
      componentWillUnmountHooks,
    } = decompose([injector1, injector2, injector3, injector4]);

    expect(propInjectors[0].id).to.be.equals(1);
    expect(initialStateInjectors[0].id).to.be.equals(3);
    expect(imperativeMethodInjectors[0].id).to.be.equals(2);
    expect(componentWillMountHooks[0].id).to.be.equals(3);
    expect(componentDidMountHooks[0].id).to.be.equals(4);
    expect(componentWillReceivePropsHooks[0].id).to.be.equals(2);
    expect(componentWillUpdateHooks[0].id).to.be.equals(4);
    expect(componentDidUpdateHooks[0].id).to.be.equals(1);
    expect(componentWillUnmountHooks[0].id).to.be.equals(4);
  });

});
