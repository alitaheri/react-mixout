import * as React from 'react';
import { Injector, decompose, ImperativeMethodImplementation } from './injector';
import { Remix, RemixRenderer } from './remix';

type ReactComponent = React.ComponentClass<any> | React.StatelessComponent<any>;

export interface MixoutWrapper {
  <R extends RemixRenderer>(remix: Remix<R>): R & React.ComponentClass<void>;
  <T extends React.ComponentClass<any>>(classComponent: T): T;
  <T extends React.StatelessComponent<any>>(statelessComponent: T): T & React.ComponentClass<void>;
}

export interface MixoutWrapperWithClassTypeOverride<T> {
  (remix: Remix<any>): T;
  (classComponent: React.ComponentClass<any>): T;
  (statelessComponent: React.StatelessComponent<any>): T;
}

export interface MixoutWrapperWithPropOverride<P> {
  (remix: Remix<any>): React.ComponentClass<P>;
  (classComponent: React.ComponentClass<any>): React.ComponentClass<P>;
  (statelessComponent: React.StatelessComponent<any>): React.ComponentClass<P>;
}

export interface Mixout {
  (...injectors: Injector[]): MixoutWrapper;
  <T extends React.ComponentClass<any>>(...injectors: Injector[]): MixoutWrapperWithClassTypeOverride<T>;
  <T extends React.StatelessComponent<any>>(...injectors: Injector[]): MixoutWrapperWithClassTypeOverride<T>;
  <P>(...injectors: Injector[]): MixoutWrapperWithPropOverride<P>;
}

// copied from https://github.com/acdlite/recompose
export function isClassComponent(Component: any) {
  return Boolean(
    Component &&
    Component.prototype &&
    typeof Component.prototype.isReactComponent === 'object',
  );
}

function mixout(...injectors: Injector[]) {
  const {
    ids,
    propTypeInjectors,
    contextTypeInjectors,
    childContextTypeInjectors,
    propInjectors,
    contextInjectors,
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
      if (defaultValue !== undefined) {
        defaultProps[name] = defaultValue;
      } else {
        delete defaultProps[name];
      }
    }
    propTypeInjectors.forEach(propTypeInjector => propTypeInjector(setPropType));

    const contextTypes: React.ValidationMap<any> = {};
    function setContextType(name: string, validator: React.Validator<any>) {
      contextTypes[name] = validator;
    }
    contextTypeInjectors.forEach(contextTypeInjector => contextTypeInjector(setContextType));

    class Mixout extends React.Component<any, void> {
      public static displayName = Component instanceof Remix && Component.displayName
        ? Component.displayName
        : 'Mixout';
      public static propTypes = propTypes;
      public static contextTypes = contextTypes;
      public static childContextTypes: any;
      public static defaultProps = defaultProps;

      public injectorStates: { [id: number]: any };
      public child: React.ReactInstance;
      private setChild = (instance: React.ReactInstance) => {
        this.child = instance;
      }

      constructor(props: any, context: any) {
        super(props, context);
        const state: { [id: number]: any } = {};

        const forceUpdater = (callback?: () => void) => this.forceUpdate(callback);

        ids.forEach(id => state[id] = ({}));

        initialStateInjectors.forEach(initialStateInjector => {
          initialStateInjector.method(props, context, state[initialStateInjector.id], forceUpdater);
        });
        this.injectorStates = state;
      }

      public componentWillMount() {
        const ownProps: any = this.props;
        const ownContext: any = this.context;
        const states: any = this.injectorStates;

        componentWillMountHooks.forEach(componentWillMountHook => {
          const ownState = states[componentWillMountHook.id];
          componentWillMountHook.method(ownProps, ownContext, ownState);
        });
      }

      public componentDidMount() {
        const ownProps: any = this.props;
        const ownContext: any = this.context;
        const states: any = this.injectorStates;
        const child = this.child;

        componentDidMountHooks.forEach(componentDidMountHook => {
          const ownState = states[componentDidMountHook.id];
          componentDidMountHook.method(ownProps, ownContext, ownState, child);
        });
      }

      public componentWillReceiveProps(nextProps: any, nextContext: any) {
        const ownProps: any = this.props;
        const ownContext: any = this.context;
        const states: any = this.injectorStates;
        const child = this.child;

        componentWillReceivePropsHooks.forEach(componentWillReceivePropsHook => {
          const ownState = states[componentWillReceivePropsHook.id];
          componentWillReceivePropsHook.method(nextProps, nextContext, ownProps, ownContext, ownState, child);
        });
      }

      public shouldComponentUpdate(nextProps: any, _ns: any, nextContext: any): boolean {
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

      public componentWillUpdate(nextProps: any, _ns: any, nextContext: any) {
        const ownProps: any = this.props;
        const ownContext: any = this.context;
        const states: any = this.injectorStates;
        const child = this.child;

        componentWillUpdateHooks.forEach(componentWillUpdateHook => {
          const ownState = states[componentWillUpdateHook.id];
          componentWillUpdateHook.method(nextProps, nextContext, ownProps, ownContext, ownState, child);
        });
      }

      public componentDidUpdate(prevProps: any, _ps: any, prevContext: any) {
        const ownProps: any = this.props;
        const ownContext: any = this.context;
        const states: any = this.injectorStates;
        const child = this.child;

        componentDidUpdateHooks.forEach(componentDidUpdateHook => {
          const ownState = states[componentDidUpdateHook.id];
          componentDidUpdateHook.method(prevProps, prevContext, ownProps, ownContext, ownState, child);
        });
      }

      public componentWillUnmount() {
        const ownProps: any = this.props;
        const ownContext: any = this.context;
        const states: any = this.injectorStates;

        componentWillUnmountHooks.forEach(componentWillUnmountHook => {
          const ownState = states[componentWillUnmountHook.id];
          componentWillUnmountHook.method(ownProps, ownContext, ownState);
        });
      }

      public render() {
        // do not let "this" be captured in a closure.
        const ownProps: any = this.props;
        const ownContext: any = this.context;
        const states: any = this.injectorStates;

        const passDownProps: any = {};

        if (isClass) {
          passDownProps.ref = this.setChild;
        }

        // pass down own props.
        Object.keys(ownProps).map(prop => {
          passDownProps[prop] = ownProps[prop];
        });

        function setProp(name: string, value: any) {
          passDownProps[name] = value;
        }

        propInjectors.forEach(propInjector => {
          propInjector.method(setProp, ownProps, ownContext, states[propInjector.id]);
        });

        if (Component instanceof Remix) {
          return Component.renderer(passDownProps);
        }

        return React.createElement(<any>Component, passDownProps);
      }
    }

    imperativeMethodInjectors.forEach(imperativeMethodInjector => {

      const id = imperativeMethodInjector.id;

      function setImperativeMethod(name: string, implementation: ImperativeMethodImplementation) {
        (<any>Mixout.prototype)[name] = function (this: Mixout, ...args: any[]) {
          // tslint:disable:no-invalid-this
          const ownProps = this.props;
          const ownContext = this.context;
          const ownState = this.injectorStates[id];
          const child = this.child;
          // tslint:enable:no-invalid-this

          return implementation(args, ownProps, ownContext, ownState, child);
        };
      }

      imperativeMethodInjector.method(setImperativeMethod);
    });

    if (childContextTypeInjectors.length > 0) {
      Mixout.childContextTypes = {};

      const setChildContextType = function(name: string, validator: React.Validator<any>) {
        Mixout.childContextTypes[name] = validator;
      };

      childContextTypeInjectors.forEach(
        childContextTypeInjector => childContextTypeInjector(setChildContextType),
      );
    }

    if (contextInjectors.length > 0) {
      (<any>Mixout.prototype).getChildContext = function getChildContext(this: Mixout) {
        // tslint:disable:no-invalid-this
        const ownProps = this.props;
        const ownContext = this.context;
        const states = this.injectorStates;
        // tslint:enable:no-invalid-this
        const context: any = {};

        function setContext(name: string, value: any): void {
          context[name] = value;
        }

        contextInjectors.forEach(contextInjector => {
          const ownState = states[contextInjector.id];
          contextInjector.method(setContext, ownProps, ownContext, ownState);
        });

        return context;
      };
    }

    return Mixout;
  };
}

export default <Mixout>mixout;
