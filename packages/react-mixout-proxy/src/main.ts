import { Injector } from 'react-mixout';

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
  return null!;
}

export default function proxy(
  refName: string,
  methods: Array<string | Alias> | string | Alias,
  failOnNullRef = true
): Injector {
  let normalizedMethods: Alias[] = [];

  if (Array.isArray(methods)) {
    normalizedMethods = methods.map(normalize).filter(Boolean);
  } else {
    const normalizedMethod = normalize(methods);
    if (normalizedMethod) {
      normalizedMethods.push(normalizedMethod);
    }
  }

  return {
    initialStateInjector: (_p, _c, state) => state.refSetter = (instance: any) => state.ref = instance,
    propInjector: (setProp, _p, _c, state) => setProp(refName, state.refSetter),
    imperativeMethodInjector: setImperativeMethod => {
      normalizedMethods.forEach(method => {
        setImperativeMethod(method.as, (args, _p, _c, state) => {
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
