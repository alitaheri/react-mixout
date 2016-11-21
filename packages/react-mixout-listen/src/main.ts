import { Injector } from 'react-mixout';

export type Target = undefined | string | (() => EventTarget);

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
  return (<any>window)[target];
}

export default function listen(event: string, method: string, options?: ListenOptions): Injector {
  const targetOption = options && options.target;
  const useCapture = (options && !!options.useCapture) || false;

  return {
    componentDidMountHook: (_p, _c, state, child) => {
      if (!child) {
        throw new Error('react-mixout-listen must be used on a class component.');
      }

      function eventListener(e: Event) {
        (<any>child)[method](e);
      }

      state.listener = eventListener;

      getTarget(targetOption).addEventListener(event, eventListener, useCapture);
    },
    componentWillUnmountHook: (_p, _c, state) => {
      getTarget(targetOption).removeEventListener(event, state.listener, useCapture);
    },
  };
}
