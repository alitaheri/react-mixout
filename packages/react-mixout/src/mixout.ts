import * as React from 'react';

import {Injector, decompose, ImperativeMethodImplementation} from './injector';
import {Remix} from './remix';

type ReactComponent = React.ComponentClass<any> | React.StatelessComponent<any>;

export interface MixoutWrapper<P> {
  (Component: ReactComponent | Remix<any>): React.ComponentClass<P>;
}

export interface Mixout {
  <P>(...injectors: Injector[]): MixoutWrapper<P>;
}

// copied from https://github.com/acdlite/recompose
export function isClassComponent(Component) {
  return Boolean(Component && Component.prototype && typeof Component.prototype.isReactComponent === 'object');
}

export default (function mixout(...injectors: Injector[]) {
  const {
    ids,
    propTypeInjectors,
    contextTypeInjectors,
    propInjectors,
    initialStateInjectors,
    imperativeMethodInjectors,
    componentWillMountHooks,
    componentDidMountHooks,
    componentWillReceivePropsHooks,
    shouldComponentUpdateHooks,
    componentWillUpdateHooks,
    componentDidUpdateHooks,
    componentWillUnmountHooks,
  } = decompose(injectors);

  return function mixoutWrapper(Component: ReactComponent | Remix<any>) {

    const isClass = isClassComponent(Component);

    const defaultProps: any = {};
    const propTypes: React.ValidationMap<any> = {};
    function setPropType(name: string, validator: React.Validator<any>, defaultValue: any) {
      propTypes[name] = validator;
      if (typeof defaultValue !== 'undefined') {
        defaultProps[name] = defaultValue;
      } else {
        delete defaultProps[name];
      }
    };
    propTypeInjectors.forEach(propTypeInjector => propTypeInjector(setPropType));

    const contextTypes: React.ValidationMap<any> = {};
    function setContextType(name: string, validator: React.Validator<any>) {
      contextTypes[name] = validator;
    };
    contextTypeInjectors.forEach(contextTypeInjector => contextTypeInjector(setContextType));

    class Mixout extends React.Component<any, void> {
      static displayName = Component instanceof Remix && Component.displayName
        ? Component.displayName
        : 'Mixout';
      static propTypes = propTypes;
      static contextTypes = contextTypes;
      static defaultProps = defaultProps;

      private injectorStates;
      private child: React.ReactInstance;
      private setChild = (instance) => {
        this.child = instance;
      };

      constructor(props, context) {
        super(props, context);
        const state: { [id: number]: any } = {};

        const forceUpdater = (callback?: () => void) => this.forceUpdate(callback);

        ids.forEach(id => state[id] = ({}));

        initialStateInjectors.forEach(initialStateInjector => {
          initialStateInjector.method(props, context, state[initialStateInjector.id], forceUpdater);
        });
        this.injectorStates = state;
      }

      componentWillMount() {
        const ownProps: any = this.props;
        const ownContext: any = this.context;
        const states: any = this.injectorStates;

        componentWillMountHooks.forEach(componentWillMountHook => {
          const ownState = states[componentWillMountHook.id];
          componentWillMountHook.method(ownProps, ownContext, ownState);
        });
      }

      componentDidMount() {
        const ownProps: any = this.props;
        const ownContext: any = this.context;
        const states: any = this.injectorStates;
        const child = this.child;

        componentDidMountHooks.forEach(componentDidMountHook => {
          const ownState = states[componentDidMountHook.id];
          componentDidMountHook.method(ownProps, ownContext, ownState, child);
        });
      }

      componentWillReceiveProps(nextProps: any, nextContext: any) {
        const ownProps: any = this.props;
        const ownContext: any = this.context;
        const states: any = this.injectorStates;
        const child = this.child;

        componentWillReceivePropsHooks.forEach(componentWillReceivePropsHook => {
          const ownState = states[componentWillReceivePropsHook.id];
          componentWillReceivePropsHook.method(nextProps, nextContext, ownProps, ownContext, ownState, child);
        });
      }

      shouldComponentUpdate(nextProps: any, nextState: any, nextContext: any): boolean {
        const ownProps: any = this.props;
        const ownContext: any = this.context;

        if (shouldComponentUpdateHooks.length === 0) {
          return true;
        }

        let shouldUpdate = false;

        shouldComponentUpdateHooks.forEach(shouldComponentUpdateHook => {
          const result = shouldComponentUpdateHook(nextProps, nextContext, ownProps, ownContext);
          if (typeof result === 'boolean') {
            shouldUpdate = shouldUpdate || result;
          } else {
            shouldUpdate = true;
          }
        });

        return shouldUpdate;
      }

      componentWillUpdate(nextProps: any, nextState: any, nextContext: any) {
        const ownProps: any = this.props;
        const ownContext: any = this.context;
        const states: any = this.injectorStates;
        const child = this.child;

        componentWillUpdateHooks.forEach(componentWillUpdateHook => {
          const ownState = states[componentWillUpdateHook.id];
          componentWillUpdateHook.method(nextProps, nextContext, ownProps, ownContext, ownState, child);
        });
      }

      componentDidUpdate(prevProps: any, prevState: any, prevContext: any) {
        const ownProps: any = this.props;
        const ownContext: any = this.context;
        const states: any = this.injectorStates;
        const child = this.child;

        componentDidUpdateHooks.forEach(componentDidUpdateHook => {
          const ownState = states[componentDidUpdateHook.id];
          componentDidUpdateHook.method(prevProps, prevContext, ownProps, ownContext, ownState, child);
        });
      }

      componentWillUnmount() {
        const ownProps: any = this.props;
        const ownContext: any = this.context;
        const states: any = this.injectorStates;

        componentWillUnmountHooks.forEach(componentWillUnmountHook => {
          const ownState = states[componentWillUnmountHook.id];
          componentWillUnmountHook.method(ownProps, ownContext, ownState);
        });
      }

      render() {
        // do not let "this" be captured in a closure.
        const ownProps: any = this.props;
        const ownContext: any = this.context;
        const states: any = this.injectorStates;

        const passDownProps: any = {};

        if (isClass) {
          passDownProps.ref = this.setChild;
        }

        // pass down own props.
        for (let prop in ownProps) {
          passDownProps[prop] = ownProps[prop];
        }

        function setProp(name: string, value: any) {
          passDownProps[name] = value;
        };

        propInjectors.forEach(propInjector => {
          propInjector.method(setProp, ownProps, ownContext, states[propInjector.id]);
        });

        if (Component instanceof Remix) {
          return Component.renderer(passDownProps);
        }

        return React.createElement(<ReactComponent>Component, passDownProps);
      }
    }

    imperativeMethodInjectors.forEach(imperativeMethodInjector => {

      const id = imperativeMethodInjector.id;

      function setImperativeMethod(name: string, implementation: ImperativeMethodImplementation) {
        Mixout.prototype[name] = function (...args: any[]) {
          const ownProps = this.props;
          const ownContext = this.context;
          const ownState = this.injectorStates[id];
          const child = this.child;

          return implementation(args, ownProps, ownContext, ownState, child);
        }
      }

      imperativeMethodInjector.method(setImperativeMethod);
    });

    return Mixout;
  }
}) as Mixout;
