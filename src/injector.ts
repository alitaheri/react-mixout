import * as React from 'react';

export interface Setter {
  (name: string, value: any): void;
}

export interface ImperativeMethodImplementation {
  (setState: Setter, args: any[], ownProps: any, ownContext: any, ownState: any, child: React.ReactInstance): any;
}

export interface ContextTypeInjector {
  (setContextType: (name: string, validator: React.Validator<any>) => void): void;
}

export interface PropTypeInjector {
  (setPropType: (name: string, validator: React.Validator<any>, defaultValue?: any) => void): void;
}

export interface PropInjector {
  (setProp: Setter, ownProps: any, ownContext: any, ownState: any): void;
}

export interface InitialStateInjector {
  (setState: Setter, ownProps: any, ownContext: any): void;
}

export interface ImperativeMethodInjector {
  (setImperativeMethod: (name: string, implementation: ImperativeMethodImplementation) => any): void;
}

export interface ComponentWillMountHook {
  (ownProps: any, ownContext: any, ownState: any, child: React.ReactInstance): void;
}

export interface ComponentDidMountHook {
  (ownProps: any, ownContext: any, ownState: any, child: React.ReactInstance): void;
}

export interface ComponentWillUnmountHook {
  (ownProps: any, ownContext: any, ownState: any): void;
}

export interface ComponentWillUpdateHook {
  (nextProps: any, nextContext: any, ownProps: any, ownContext: any, ownState: any, child: React.ReactInstance): void;
}

export interface MethodWithId<T> {
  method: T;
  id: number;
}

export interface Injector {
  propTypeInjector?: PropTypeInjector;
  contextTypeInjector?: ContextTypeInjector;
  propInjector?: PropInjector;
  initialStateInjector?: InitialStateInjector;
  imperativeMethodInjector?: ImperativeMethodInjector;
  componentWillMountHook?: ComponentWillMountHook;
  componentDidMountHook?: ComponentDidMountHook;
  componentWillUnmountHook?: ComponentWillUnmountHook;
  componentWillUpdateHook?: ComponentWillUpdateHook;
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
  componentWillUnmountHooks: MethodWithId<ComponentWillUnmountHook>[];
  componentWillUpdateHooks: MethodWithId<ComponentWillUpdateHook>[];
}

export function decompose(injectors: Injector[]): DecomposeResult {
  let id = 0;

  const ids: number[] = [];
  const propTypeInjectors: PropTypeInjector[] = [];
  const contextTypeInjectors: ContextTypeInjector[] = [];
  const propInjectors: MethodWithId<PropInjector>[] = [];
  const initialStateInjectors: MethodWithId<InitialStateInjector>[] = [];
  const imperativeMethodInjectors: MethodWithId<ImperativeMethodInjector>[] = [];
  const componentWillMountHooks: MethodWithId<ComponentWillMountHook>[] = [];
  const componentDidMountHooks: MethodWithId<ComponentDidMountHook>[] = [];
  const componentWillUnmountHooks: MethodWithId<ComponentWillUnmountHook>[] = [];
  const componentWillUpdateHooks: MethodWithId<ComponentWillUpdateHook>[] = [];

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

    if (injector.componentWillUnmountHook) {
      componentWillUnmountHooks.push({ id, method: injector.componentWillUnmountHook });
    }

    if (injector.componentWillUpdateHook) {
      componentWillUpdateHooks.push({ id, method: injector.componentWillUpdateHook });
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
    componentWillUnmountHooks,
    componentWillUpdateHooks,
  };
}
