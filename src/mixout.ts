import * as React from 'react';

import {Injector} from './injector';

export interface MixoutWrapper {
  <P>(Component: React.ComponentClass<P> | React.StatelessComponent<P>): React.ComponentClass<P>;
}

export interface Mixout {
  (...injectors: Injector[]): MixoutWrapper;
}

export default (function mixout(...injectors: Injector[]) {

  //uncombine combined injectors

  const contextTypeInjectors = injectors.filter(i => !!i.contextTypeInjector).map(i => i.contextTypeInjector);
  const propInjectors = injectors.filter(i => !!i.propInjector).map(i => i.propInjector);

  return function mixoutWrapper<P>(Component: React.ComponentClass<P> | React.StatelessComponent<P>) {

    const contextTypes = {};
    const setContextType = (name: string, validator: React.Validator<any>) => contextTypes[name] = validator;
    contextTypeInjectors.forEach(contextTypeInjector => contextTypeInjector(setContextType));

    class Mixout extends React.Component<any, any> {
      static contextTypes = contextTypes;

      render() {
        // do not let this be captured in a closure.
        const ownProps: any = this.props;
        const ownContext: any = this.context;

        const props: any = {};
        const setProp = (name: string, value: any) => props[name] = value;

        // pass down own props.
        for (let prop in ownProps) {
          props[prop] = ownProps[prop];
        }

        propInjectors.forEach(propInjector => propInjector(ownProps, ownContext, setProp));

        return React.createElement<P>(Component, props);
      }

    }

  }
}) as Mixout;
