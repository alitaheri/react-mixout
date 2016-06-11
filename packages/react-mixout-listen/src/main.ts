import * as React from 'react';
import {Injector} from 'react-mixout';

export type Target = string | (() => EventTarget);

export interface ListenOptions {
  target?: Target;
  useCapture?: boolean;
}

function getTarget(target: Target): EventTarget {
  if (!target) {
    return window;
  }
  if (typeof target === 'function') {
    return target();
  }
  return window[<string>target];
}

export default function listen(event: string, method: string, options?: ListenOptions): Injector {
  const targetOption = options && options.target;
  const useCapture = (options && !!options.useCapture) || false;

  return {
    componentDidMountHook: (props, context, state, child) => {
      if (!child) {
        throw new Error('react-mixout-listen must be used on a class component.');
      }

      function eventListener(e: Event) {
        child[method](e);
      }

      state.listener = eventListener;

      getTarget(targetOption).addEventListener(event, eventListener, useCapture);
    },
    componentWillUnmountHook: (props, context, state) => {
      getTarget(targetOption).removeEventListener(event, state.listener, useCapture);
    },
  };
}
