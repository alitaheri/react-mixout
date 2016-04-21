import * as React from 'react';

import {flatten} from './combine';

export interface ImperativeMethodImplementation {
  (args: any[], ownProps: any, ownContext: any, ownState: any, child: React.ReactInstance): any;
}

export interface ContextTypeInjector {
  (setContextType: (name: string, validator: React.Validator<any>) => void): void;
}

export interface PropTypeInjector {
  (setPropType: (name: string, validator: React.Validator<any>, defaultValue?: any) => void): void;
}

export interface PropInjector {
  (setProp: (name: string, value: any) => void, ownProps: any, ownContext: any, ownState: any): void;
}

export interface InitialStateInjector {
  (ownProps: any, ownContext: any, ownState: any, forceUpdater: (callback?: () => void) => void): void;
}

export interface ImperativeMethodInjector {
  (setImperativeMethod: (name: string, implementation: ImperativeMethodImplementation) => void): void;
}

export interface ComponentWillMountHook {
  (ownProps: any, ownContext: any, ownState: any, child: React.ReactInstance): void;
}

export interface ComponentDidMountHook {
  (ownProps: any, ownContext: any, ownState: any, child: React.ReactInstance): void;
}

export interface ComponentWillReceivePropsHook {
  (nextProps: any, nextContext: any, ownProps: any, ownContext: any, ownState: any, child: React.ReactInstance): void;
}

export interface ShouldComponentUpdateHook {
  (nextProps: any, nextContext: any, ownProps: any, ownContext: any): boolean;
}

export interface ComponentWillUpdateHook {
  (nextProps: any, nextContext: any, ownProps: any, ownContext: any, ownState: any, child: React.ReactInstance): void;
}

export interface ComponentDidUpdateHook {
  (prevProps: any, prevContext: any, ownProps: any, ownContext: any, ownState: any, child: React.ReactInstance): void;
}

export interface ComponentWillUnmountHook {
  (ownProps: any, ownContext: any, ownState: any): void;
}

export interface Injector {
  propTypeInjector?: PropTypeInjector;
  contextTypeInjector?: ContextTypeInjector;
  propInjector?: PropInjector;
  initialStateInjector?: InitialStateInjector;
  imperativeMethodInjector?: ImperativeMethodInjector;
  componentWillMountHook?: ComponentWillMountHook;
  componentDidMountHook?: ComponentDidMountHook;
  componentWillReceivePropsHook?: ComponentWillReceivePropsHook;
  shouldComponentUpdateHook?: ShouldComponentUpdateHook;
  componentWillUpdateHook?: ComponentWillUpdateHook;
  componentDidUpdateHook?: ComponentDidUpdateHook;
  componentWillUnmountHook?: ComponentWillUnmountHook;
}

export interface MethodWithId<T> {
  method: T;
  id: number;
}

export interface DecomposeResult {
  ids: number[];
  propTypeInjectors: PropTypeInjector[];
  contextTypeInjectors: ContextTypeInjector[];
  propInjectors: MethodWithId<PropInjector>[];
  initialStateInjectors: MethodWithId<InitialStateInjector>[];
  imperativeMethodInjectors: MethodWithId<ImperativeMethodInjector>[];
  componentWillMountHooks: MethodWithId<ComponentWillMountHook>[];
  componentDidMountHooks: MethodWithId<ComponentDidMountHook>[];
  componentWillReceivePropsHooks: MethodWithId<ComponentWillReceivePropsHook>[];
  shouldComponentUpdateHooks: ShouldComponentUpdateHook[];
  componentWillUpdateHooks: MethodWithId<ComponentWillUpdateHook>[];
  componentDidUpdateHooks: MethodWithId<ComponentDidUpdateHook>[];
  componentWillUnmountHooks: MethodWithId<ComponentWillUnmountHook>[];
}

export function decompose(injectors: Injector[]): DecomposeResult {
  injectors = flatten(injectors);

  let id = 0;

  const ids: number[] = [];
  const propTypeInjectors: PropTypeInjector[] = [];
  const contextTypeInjectors: ContextTypeInjector[] = [];
  const propInjectors: MethodWithId<PropInjector>[] = [];
  const initialStateInjectors: MethodWithId<InitialStateInjector>[] = [];
  const imperativeMethodInjectors: MethodWithId<ImperativeMethodInjector>[] = [];
  const componentWillMountHooks: MethodWithId<ComponentWillMountHook>[] = [];
  const componentWillReceivePropsHooks: MethodWithId<ComponentWillReceivePropsHook>[] = [];
  const shouldComponentUpdateHooks: ShouldComponentUpdateHook[] = [];
  const componentWillUnmountHooks: MethodWithId<ComponentWillUnmountHook>[] = [];
  const componentWillUpdateHooks: MethodWithId<ComponentWillUpdateHook>[] = [];
  const componentDidUpdateHooks: MethodWithId<ComponentDidUpdateHook>[] = [];
  const componentDidMountHooks: MethodWithId<ComponentDidMountHook>[] = [];

  injectors.forEach(injector => {
    id += 1;

    ids.push(id);

    if (injector.propTypeInjector) {
      propTypeInjectors.push(injector.propTypeInjector);
    }

    if (injector.contextTypeInjector) {
      contextTypeInjectors.push(injector.contextTypeInjector);
    }

    if (injector.propInjector) {
      propInjectors.push({ id, method: injector.propInjector });
    }

    if (injector.initialStateInjector) {
      initialStateInjectors.push({ id, method: injector.initialStateInjector });
    }

    if (injector.imperativeMethodInjector) {
      imperativeMethodInjectors.push({ id, method: injector.imperativeMethodInjector });
    }

    if (injector.componentWillMountHook) {
      componentWillMountHooks.push({ id, method: injector.componentWillMountHook });
    }

    if (injector.componentDidMountHook) {
      componentDidMountHooks.push({ id, method: injector.componentDidMountHook });
    }

    if (injector.componentWillReceivePropsHook) {
      componentWillReceivePropsHooks.push({ id, method: injector.componentWillReceivePropsHook });
    }

    if (injector.shouldComponentUpdateHook) {
      shouldComponentUpdateHooks.push(injector.shouldComponentUpdateHook);
    }

    if (injector.componentWillUpdateHook) {
      componentWillUpdateHooks.push({ id, method: injector.componentWillUpdateHook });
    }

    if (injector.componentDidUpdateHook) {
      componentDidUpdateHooks.push({ id, method: injector.componentDidUpdateHook });
    }

    if (injector.componentWillUnmountHook) {
      componentWillUnmountHooks.push({ id, method: injector.componentWillUnmountHook });
    }
  });

  return {
    ids,
    propTypeInjectors,
    contextTypeInjectors,
    propInjectors,
    initialStateInjectors,
    imperativeMethodInjectors,
    componentWillMountHooks,
    componentDidMountHooks,
    componentWillReceivePropsHooks,
    shouldComponentUpdateHooks,
    componentWillUpdateHooks,
    componentDidUpdateHooks,
    componentWillUnmountHooks,
  };
}
