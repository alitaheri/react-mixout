import * as React from 'react';

export interface Setter {
  (name: string, value: any): void;
}

export interface ContextTypeInjector {
  (setContextType: (name: string, validator: React.Validator<any>) => void): void;
}

export interface PropInjector {
  (setProp: Setter, ownProps: any, ownContext: any, ownState: any): void;
  id?: number;
}

export interface InitialStateInjector {
  (setState: Setter, ownProps: any, ownContext: any): void;
  id?: number;
}

export interface ImperativeMethodImplementation {
  (setState: Setter, args: any[], ownProps: any, ownContext: any, ownState: any, child: React.ReactInstance): any;
}

export interface ImperativeMethodInjector {
  (setImperativeMethod: (name: string, implementation: ImperativeMethodImplementation) => any): void;
  id?: number;
}

export interface Injector {
  id?: number;
  combined?: Injector[];
  contextTypeInjector?: ContextTypeInjector;
  propInjector?: PropInjector;
  initialStateInjector?: InitialStateInjector;
  imperativeMethodInjector?: ImperativeMethodInjector;
}

export interface DecomposeResult {
  contextTypeInjectors: ContextTypeInjector[];
  propInjectors: PropInjector[];
  initialStateInjectors: InitialStateInjector[];
  imperativeMethodInjectors: ImperativeMethodInjector[];
}

export function decompose(injectors: Injector[]): DecomposeResult {
  let id = 0;

  let contextTypeInjectors: ContextTypeInjector[] = [];
  let propInjectors: PropInjector[] = [];
  let initialStateInjectors: InitialStateInjector[] = [];
  let imperativeMethodInjectors: ImperativeMethodInjector[] = [];

  injectors.forEach(injector => {
    id += 1;
    injector.id = id;

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
  });

  return {
    contextTypeInjectors,
    propInjectors,
    initialStateInjectors,
    imperativeMethodInjectors
  };
}
