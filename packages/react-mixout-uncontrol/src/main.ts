import * as React from 'react';
import {
  Injector,
  PropTypeInjector,
  InitialStateInjector,
  ImperativeMethodInjector,
  PropInjector,
} from 'react-mixout';

export interface UncontrolOptions<T> {
  defaultValuePropName?: string;
  defaultValuePropValidator?: React.Validator<T>;
  defaultValuePropDefault?: T;
  callbackPropName?: string;
  callbackPropValidator?: React.Validator<Function>;
  callbackPropDefault?: Function;
  getValueMethodName?: string;
  setValueMethodName?: string;
  clearValueMethodName?: string;
  passedDownValuePropName?: string;
  passedDownCallbackPropName?: string;
  getValueFromPassedDownCallback?: (...args: any[]) => T;
}

export const uncontrolValue = uncontrol('value', {
  callbackPropName: 'onChange',
  passedDownCallbackPropName: 'onChange',
  callbackPropValidator: React.PropTypes.func,
  defaultValuePropValidator: React.PropTypes.any,
});

export default function uncontrol<T>(name: string, options: UncontrolOptions<T> = {}): Injector {
  const defaultValuePropName = options.defaultValuePropName || `default${titlize(name)}`;
  const defaultValuePropValidator = options.defaultValuePropValidator;
  const defaultValuePropDefault = options.defaultValuePropDefault;
  const callbackPropName = options.callbackPropName || `on${titlize(name)}Change`;
  const callbackPropValidator = options.callbackPropValidator;
  const callbackPropDefault = options.callbackPropDefault;
  const getValueMethodName = options.getValueMethodName || `get${titlize(name)}`;
  const setValueMethodName = options.setValueMethodName || `set${titlize(name)}`;
  const clearValueMethodName = options.clearValueMethodName || `clear${titlize(name)}`;
  const passedDownValuePropName = options.passedDownValuePropName || name;
  const passedDownCallbackPropName = options.passedDownCallbackPropName || `on${titlize(name)}Change`;
  const getValueFromPassedDownCallback: (...args: any[]) => T
    = options.getValueFromPassedDownCallback || defaultGetValue;

  const propTypeInjector: PropTypeInjector = setPropType => {
    if (defaultValuePropValidator || defaultValuePropDefault) {
      setPropType(
        defaultValuePropName,
        defaultValuePropValidator,
        defaultValuePropDefault
      );
    }

    if (callbackPropValidator || callbackPropDefault) {
      setPropType(
        callbackPropName,
        callbackPropValidator,
        callbackPropDefault
      );
    }
  }

  const initialStateInjector: InitialStateInjector = (props, context, state, forceUpdater) => {
    state.forceUpdate = forceUpdater;

    state.value = props[defaultValuePropName];

    state.callback = (...args: any[]) => {
      state.value = getValueFromPassedDownCallback(...args);

      if (typeof props[callbackPropName] === 'function') {
        props[callbackPropName](...args);
      }

      forceUpdater();
    };
  };

  const imperativeMethodInjector: ImperativeMethodInjector = setMethod => {
    setMethod(getValueMethodName, (a, p, c, state) => state.value);

    setMethod(setValueMethodName, (a, p, c, state) => {
      state.value = a[0];
      state.forceUpdate();
    });

    setMethod(clearValueMethodName, (a, props, c, state) => {
      state.value = props[defaultValuePropName];
      state.forceUpdate();
    });
  };

  const propInjector: PropInjector = (setProp, p, c, state) => {
    setProp(passedDownValuePropName, state.value);
    setProp(passedDownCallbackPropName, state.callback);
  };

  return {
    propTypeInjector,
    initialStateInjector,
    imperativeMethodInjector,
    propInjector,
  };
}

function defaultGetValue(event: React.SyntheticEvent) {
  return event && event.target && (<any>event.target).value || null;
}

function titlize(prop: string): string {
  return prop[0].toUpperCase() + prop.substr(1);
}
