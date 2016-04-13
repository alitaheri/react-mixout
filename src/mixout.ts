import * as React from 'react';

import {Injector, decompose} from './injector';

export interface MixoutWrapper {
  <P>(Component: React.ComponentClass<P> | React.StatelessComponent<P>): React.ComponentClass<P>;
}

export interface Mixout {
  (...injectors: Injector[]): MixoutWrapper;
}

export default (function mixout(...injectors: Injector[]) {
  const { contextTypeInjectors, propInjectors, initialStateInjectors } = decompose(injectors);

  return function mixoutWrapper<P>(Component: React.ComponentClass<P> | React.StatelessComponent<P>) {

    const contextTypes = {};
    function setContextType(name: string, validator: React.Validator<any>) {
      contextTypes[name] = validator;
    };
    contextTypeInjectors.forEach(contextTypeInjector => contextTypeInjector(setContextType));

    class Mixout extends React.Component<any, { [id: number]: any }> {
      static contextTypes = contextTypes;

      constructor(props, context) {
        super(props, context);

        const state: { [id: number]: any } = {};
        initialStateInjectors.forEach(initialStateInjector => {
          if (!state[initialStateInjector.id]) {
            state[initialStateInjector.id] = {};
          };

          initialStateInjector(props, context, function setState(name, value) {
            state[initialStateInjector.id][name] = value;
          })
        });
        this.state = state;
      }

      render() {
        // do not let "this" be captured in a closure.
        const ownProps: any = this.props;
        const ownContext: any = this.context;
        const ownState: any = this.state;

        const props: any = {};
        function setProp(name: string, value: any) {
          props[name] = value;
        };

        // pass down own props.
        for (let prop in ownProps) {
          props[prop] = ownProps[prop];
        }

        propInjectors.forEach(
          propInjector => propInjector(ownProps, ownContext, ownState[propInjector.id], setProp)
        );

        return React.createElement<P>(Component, props);
      }
    }

  }
}) as Mixout;
