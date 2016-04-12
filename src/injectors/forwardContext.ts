import * as React from 'react';
import {Injector} from '../injector';

export interface ForwardContextOptions<T> {
  alias?: string;
  validator?: React.Validator<T>;
  defaultValue?: T;
  defaultGenerator?: (ownProps: any, ownContext: any) => T;
}

export function forwardContext<T>(name: string, options: ForwardContextOptions<T> = {}): Injector {
  let validator = options.validator;

  if (typeof validator !== 'function') {
    validator = React.PropTypes.any;
  }

  const alias = typeof options.alias === 'string' ? options.alias : name;

  const hasDefault = 'defaultValue' in options || 'defaultGenerator' in options;

  let getDefault;
  if (hasDefault) {
    const defaultValue = options.defaultValue;
    getDefault = typeof options.defaultGenerator === 'function'
      ? options.defaultGenerator
      : () => defaultValue;
  }

  const contextTypeInjector = setContextType => setContextType(name, validator);

  const propInjector = (ownProp, ownContext, setProp) => {
    if (ownContext && name in ownContext) {
      setProp(alias, ownContext[name]);
    } else if (hasDefault) {
      setProp(alias, getDefault(ownProp, ownContext));
    }
  };

  return { contextTypeInjector, propInjector };
}
