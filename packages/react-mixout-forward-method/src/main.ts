import { Injector, ImperativeMethodInjector, combine } from 'react-mixout';

export const forwardReactTransitionGroupMethods = combine(
  forwardMethod('componentWillAppear'),
  forwardMethod('componentDidAppear'),
  forwardMethod('componentWillEnter'),
  forwardMethod('componentDidEnter'),
  forwardMethod('componentWillLeave'),
  forwardMethod('componentDidLeave'),
);

export default function forwardMethod(name: string, targetName?: string): Injector {
  const target = typeof targetName === 'string' ? targetName : name;

  const imperativeMethodInjector: ImperativeMethodInjector = setImperativeMethod => {
    setImperativeMethod(name, (args, _p, _c, _s, child) => {
      if (!child) {
        throw new Error('You have used forward-method in a mixout that wraps a function component. ' +
          'Function components do not support ref can cannot have instance methods.');
      }
      if (typeof (<any>child)[target] !== 'function') {
        throw new Error(`The wrapped component does not have a method named ${target}.`);
      }
      return (<any>child)[target](...args);
    });
  };

  return { imperativeMethodInjector };
}
