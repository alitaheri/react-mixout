import * as React from 'react';
import { Injector } from 'react-mixout';

export interface ForwardContextOptions<T> {
  alias?: string;
  validator?: React.Validator<T>;
  defaultValue?: T;
  defaultGenerator?: (ownProps: any) => T;
  mapToProp?: (value: T) => any;
}

export default function forwardContext<T>(name: string, options: ForwardContextOptions<T> = {}): Injector {
  let validator = options.validator;

  if (typeof validator !== 'function') {
    validator = () => null;
  }

  const alias = typeof options.alias === 'string' ? options.alias : name;

  const hasDefault = 'defaultValue' in options || 'defaultGenerator' in options;

  let getDefault: (ownProps: any) => any;
  if (hasDefault) {
    const defaultValue = options.defaultValue;
    getDefault = typeof options.defaultGenerator === 'function'
      ? options.defaultGenerator
      : () => defaultValue;
  }

  const mapToPropValue = typeof options.mapToProp === 'function' ? options.mapToProp : (v: any) => v;

  const contextTypeInjector = (setContextType: any) => setContextType(name, validator);

  const hasOwn = Object.prototype.hasOwnProperty;

  const propInjector = (setProp: any, ownProp: any, ownContext: any) => {
    if (ownContext && hasOwn.call(ownContext, name) && ownContext[name] !== undefined) {
      setProp(alias, mapToPropValue(ownContext[name]));
    } else if (hasDefault) {
      setProp(alias, mapToPropValue(getDefault(ownProp)));
    }
  };

  return { contextTypeInjector, propInjector };
}
