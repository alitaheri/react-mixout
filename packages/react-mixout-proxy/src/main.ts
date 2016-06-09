import * as React from 'react';
import {Injector} from 'react-mixout';

export interface Alias {
  name: string;
  as: string;
}

export function alias(name: string, as: string): Alias {
  return { name, as };
}

export const proxyInput = proxy('inputRef', ['focus', 'blur', 'select', 'setRangeText', 'setSelectionRange', 'click']);

function normalize(method: string | Alias): Alias {
  if (method) {
    if (typeof method === 'object') {
      return method;
    } else if (typeof method === 'string') {
      return { name: method, as: method };
    }
  }
}

export default function proxy(
  refName: string,
  methods: Array<string | Alias> | string | Alias,
  failOnNullRef = true
): Injector {
  let normalizedMethods: Array<Alias> = [];

  if (Array.isArray(methods)) {
    normalizedMethods = methods.map(normalize).filter(m => !!m);
  } else {
    const normalizedMethod = normalize(methods);
    if (normalizedMethod) {
      normalizedMethods.push(normalizedMethod);
    }
  }

  return {
    initialStateInjector: (props, context, state) => state.refSetter = instance => state.ref = instance,
    propInjector: (setProp, props, context, state) => setProp(refName, state.refSetter),
    imperativeMethodInjector: setImperativeMethod => {
      normalizedMethods.forEach(method => {
        setImperativeMethod(method.as, (args, props, context, state) => {
          if (failOnNullRef && !state.ref) {
            throw new Error(`Failed to call ${method.as}. The targetted component might not be mounted`);
          }

          if (state.ref) {
            if (typeof state.ref[method.name] !== 'function') {
              throw new Error(`Function ${method.name} does not exist on the targetted component`)
            }
            return state.ref[method.name](...args);
          }
        });
      });
    },
  };
}
