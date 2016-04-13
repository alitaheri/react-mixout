import * as React from 'react';

import {Injector, decompose, ImperativeMethodImplementation} from './injector';

export interface MixoutWrapper {
  (Component: React.ComponentClass<any> | React.StatelessComponent<any>): React.ComponentClass<any>;
}

export interface Mixout {
  (...injectors: Injector[]): MixoutWrapper;
}

// copied from https://github.com/acdlite/recompose
function isClassComponent(Component) {
  return Boolean(Component && Component.prototype && typeof Component.prototype.isReactComponent === 'object');
}

export default (function mixout(...injectors: Injector[]) {
  const {
    propTypeInjectors,
    contextTypeInjectors,
    propInjectors,
    initialStateInjectors,
    imperativeMethodInjectors,
  } = decompose(injectors);

  return function mixoutWrapper(Component: React.ComponentClass<any> | React.StatelessComponent<any>) {

    const isClass = isClassComponent(Component);

    const defaultProps: any = {};
    const propTypes: React.ValidationMap<any> = {};
    function setPropType(name: string, validator: React.Validator<any>, defaultValue: any) {
      propTypes[name] = validator;
      if (typeof defaultValue !== 'undefined') {
        defaultProps[name] = defaultValue;
      }
    };
    propTypeInjectors.forEach(propTypeInjector => propTypeInjector(setPropType));

    const contextTypes: React.ValidationMap<any> = {};
    function setContextType(name: string, validator: React.Validator<any>) {
      contextTypes[name] = validator;
    };
    contextTypeInjectors.forEach(contextTypeInjector => contextTypeInjector(setContextType));

    class Mixout extends React.Component<any, { [id: number]: any }> {
      static propTypes = propTypes;
      static contextTypes = contextTypes;
      static defaultProps = defaultProps;

      private child: React.ReactInstance;
      private setChild = (instance) => {
        this.child = instance;
      };

      constructor(props, context) {
        super(props, context);
        const state: { [id: number]: any } = {};
        initialStateInjectors.forEach(initialStateInjector => {
          if (!state[initialStateInjector.id]) {
            state[initialStateInjector.id] = {};
          };

          function setState(name, value) {
            state[initialStateInjector.id][name] = value;
          };

          initialStateInjector(setState, props, context);
        });
        this.state = state;
      }

      render() {
        // do not let "this" be captured in a closure.
        const ownProps: any = this.props;
        const ownContext: any = this.context;
        const ownState: any = this.state;

        const passDownProps: any = {};

        if (isClass) {
          passDownProps.ref = this.setChild;
        }

        function setProp(name: string, value: any) {
          passDownProps[name] = value;
        };

        // pass down own props.
        for (let prop in ownProps) {
          passDownProps[prop] = ownProps[prop];
        }

        propInjectors.forEach(propInjector => {
          propInjector(setProp, ownProps, ownContext, ownState[propInjector.id]);
        });

        return React.createElement(Component, passDownProps);
      }
    }

    imperativeMethodInjectors.forEach(imperativeMethodInjector => {

      const id = imperativeMethodInjector.id;

      function setImperativeMethod(name: string, implementation: ImperativeMethodImplementation) {
        Mixout.prototype['name'] = function(...args: any[]) {
          const ownProps = this.props;
          const ownContext = this.context;
          const ownState = this.state[id];
          const child = this.child;

          const newState = {};
          let modified = false;
          function setState(name: string, value: any) {
            modified = true;
            newState[name] = value;
          }

          const results = implementation(setState, args, ownProps, ownContext, ownState, child);

          if (modified) {
            for (let key in ownState) {
              if (!(key in newState)) {
                newState[key] = ownState[key];
              }
            }
            this.setState({ [id]: newState });
          }

          return results;
        }
      }

      imperativeMethodInjector(setImperativeMethod);
    });

    return Mixout;
  }
}) as Mixout;
