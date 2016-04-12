import * as React from 'react';

export interface PropInjector {
  (ownProps: any, ownContext: any, setProp: (name: string, value: any) => void): void;
}

export interface ContextTypeInjector {
  (setContextType: (name: string, validator: React.Validator<any>) => void): void;
}

export interface Injector {
  combined?: Injector[];
  propInjector?: PropInjector;
  contextTypeInjector?: ContextTypeInjector;
}
