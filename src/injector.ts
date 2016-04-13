import * as React from 'react';

export interface PropInjector {
  (ownProps: any, ownContext: any, ownState: any, setProp: (name: string, value: any) => void): void;
  id?: number;
}

export interface InitialStateInjector {
  (ownProps: any, ownContext: any, setState: (name: string, value: any) => void): void;
  id?: number;
}

export interface ContextTypeInjector {
  (setContextType: (name: string, validator: React.Validator<any>) => void): void;
}

export interface Injector {
  id?: number;
  combined?: Injector[];
  initialStateInjector?: InitialStateInjector;
  propInjector?: PropInjector;
  contextTypeInjector?: ContextTypeInjector;
}

export interface DecomposeResult {
  contextTypeInjectors: ContextTypeInjector[];
  propInjectors: PropInjector[];
  initialStateInjectors: InitialStateInjector[];
}

export function decompose(injectors: Injector[]): DecomposeResult {
  let id = 0;

  let contextTypeInjectors: ContextTypeInjector[] = [];
  let propInjectors: PropInjector[] = [];
  let initialStateInjectors: InitialStateInjector[] = [];

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
  });

  return { contextTypeInjectors, propInjectors, initialStateInjectors };

}
