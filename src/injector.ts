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
  id?: number;
}

export interface InitialStateInjector {
  (setState: Setter, ownProps: any, ownContext: any): void;
  id?: number;
}

export interface ImperativeMethodInjector {
  (setImperativeMethod: (name: string, implementation: ImperativeMethodImplementation) => any): void;
  id?: number;
}

export interface ComponentWillMountHook {
  (setState: Setter, ownProps: any, ownContext: any, ownState: any, child: React.ReactInstance): void;
  id?: number;
}

export interface ComponentDidMountHook {
  (setState: Setter, ownProps: any, ownContext: any, ownState: any, child: React.ReactInstance): void;
  id?: number;
}

export interface Injector {
  id?: number;
  combined?: Injector[];
  propTypeInjector?: PropTypeInjector;
  contextTypeInjector?: ContextTypeInjector;
  propInjector?: PropInjector;
  initialStateInjector?: InitialStateInjector;
  imperativeMethodInjector?: ImperativeMethodInjector;
  componentWillMountHook?: ComponentWillMountHook;
  componentDidMountHook?: ComponentDidMountHook;
}

export interface DecomposeResult {
  propTypeInjectors: PropTypeInjector[];
  contextTypeInjectors: ContextTypeInjector[];
  propInjectors: PropInjector[];
  initialStateInjectors: InitialStateInjector[];
  imperativeMethodInjectors: ImperativeMethodInjector[];
  componentWillMountHooks: ComponentWillMountHook[];
  componentDidMountHooks: ComponentDidMountHook[];
}

export function decompose(injectors: Injector[]): DecomposeResult {
  let id = 0;

  const propTypeInjectors: PropTypeInjector[] = [];
  const contextTypeInjectors: ContextTypeInjector[] = [];
  const propInjectors: PropInjector[] = [];
  const initialStateInjectors: InitialStateInjector[] = [];
  const imperativeMethodInjectors: ImperativeMethodInjector[] = [];
  const componentWillMountHooks: ComponentWillMountHook[] = [];
  const componentDidMountHooks: ComponentDidMountHook[] = [];

  injectors.forEach(injector => {
    id += 1;
    injector.id = id;

    if (injector.propTypeInjector) {
      propTypeInjectors.push(injector.propTypeInjector);
    }

    if (injector.contextTypeInjector) {
      contextTypeInjectors.push(injector.contextTypeInjector);
    }

    if (injector.propInjector) {
      injector.propInjector.id = id;
      propInjectors.push(injector.propInjector);
    }

    if (injector.initialStateInjector) {
      injector.initialStateInjector.id = id;
      initialStateInjectors.push(injector.initialStateInjector);
    }

    if (injector.imperativeMethodInjector) {
      injector.imperativeMethodInjector.id = id;
      imperativeMethodInjectors.push(injector.imperativeMethodInjector);
    }

    if (injector.componentWillMountHook) {
      injector.componentWillMountHook.id = id;
      componentWillMountHooks.push(injector.componentWillMountHook);
    }

    if (injector.componentDidMountHook) {
      injector.componentDidMountHook.id = id;
      componentDidMountHooks.push(injector.componentDidMountHook);
    }
  });

  return {
    propTypeInjectors,
    contextTypeInjectors,
    propInjectors,
    initialStateInjectors,
    imperativeMethodInjectors,
    componentWillMountHooks,
    componentDidMountHooks,
  };
}
