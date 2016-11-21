import * as React from 'react';
import { Injector } from 'react-mixout';

export interface Selector<TResult> {
  (props: any, context: any): TResult;
}

export default function memoize<V1, V2, V3, V4, V5, V6, V7, V8, TResult>(name: string,
  s1: Selector<V1>,
  s2: Selector<V2>,
  s3: Selector<V3>,
  s4: Selector<V4>,
  s5: Selector<V5>,
  s6: Selector<V6>,
  s7: Selector<V7>,
  s8: Selector<V8>,
  resolver: (v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7, v8: V8) => TResult
): Injector;

export default function memoize<V1, V2, V3, V4, V5, V6, V7, TResult>(name: string,
  s1: Selector<V1>,
  s2: Selector<V2>,
  s3: Selector<V3>,
  s4: Selector<V4>,
  s5: Selector<V5>,
  s6: Selector<V6>,
  s7: Selector<V7>,
  resolver: (v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7) => TResult
): Injector;

export default function memoize<V1, V2, V3, V4, V5, V6, TResult>(name: string,
  s1: Selector<V1>,
  s2: Selector<V2>,
  s3: Selector<V3>,
  s4: Selector<V4>,
  s5: Selector<V5>,
  s6: Selector<V6>,
  resolver: (v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6) => TResult
): Injector;

export default function memoize<V1, V2, V3, V4, V5, TResult>(name: string,
  s1: Selector<V1>,
  s2: Selector<V2>,
  s3: Selector<V3>,
  s4: Selector<V4>,
  s5: Selector<V5>,
  resolver: (v1: V1, v2: V2, v3: V3, v4: V4, v5: V5) => TResult
): Injector;

export default function memoize<V1, V2, V3, V4, TResult>(name: string,
  s1: Selector<V1>,
  s2: Selector<V2>,
  s3: Selector<V3>,
  s4: Selector<V4>,
  resolver: (v1: V1, v2: V2, v3: V3, v4: V4) => TResult
): Injector;

export default function memoize<V1, V2, V3, TResult>(name: string,
  s1: Selector<V1>,
  s2: Selector<V2>,
  s3: Selector<V3>,
  resolver: (v1: V1, v2: V2, v3: V3) => TResult
): Injector;

export default function memoize<V1, V2, TResult>(name: string,
  s1: Selector<V1>,
  s2: Selector<V2>,
  resolver: (v1: V1, v2: V2) => TResult
): Injector;

export default function memoize<V1, TResult>(name: string,
  s1: Selector<V1>,
  resolver: (v1: V1) => TResult
): Injector;

export default function memoize(name: string, ...selectorsAndResolver: any[]): Injector;

export default function memoize(name: string, ...selectorsAndResolver: any[]): Injector {
  if (selectorsAndResolver.length < 2) {
    throw new Error('At least a selector and a resolver must be provided.');
  }

  selectorsAndResolver.forEach(arg => {
    if (typeof arg !== 'function') {
      throw new Error('Selectors and resolvers must be functions');
    }
  });

  if (!name || typeof name !== 'string') {
    throw new Error(`${name} is not a valid prop name`);
  }

  const resolver = selectorsAndResolver[selectorsAndResolver.length - 1] as (...values: any[]) => any;
  const selectors = selectorsAndResolver.slice(0, -1) as Selector<any>[];

  const injector: Injector = {};

  injector.initialStateInjector = (props, context, state) => {
    const args = selectors.map(s => s(props, context));
    state.value = resolver(...args);
  };

  injector.componentWillReceivePropsHook = (nextProps, nextContext, props, context, state) => {
    let modified = false;

    const args = selectors.map(s => {
      const value = s(nextProps, nextContext);

      if (!modified && s(props, context) !== value) {
        modified = true;
      }

      return value;
    });

    if (modified) {
      state.value = resolver(...args);
    }
  };

  injector.propInjector = (setProp, _p, _c, state) => {
    setProp(name, state.value);
  };

  return injector;
}

export function context(name: string): Injector {
  return {
    contextTypeInjector: setContextType => setContextType(name, React.PropTypes.any),
  };
}
