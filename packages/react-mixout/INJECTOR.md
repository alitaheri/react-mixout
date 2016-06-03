# React Mixout Injector API

In order to build features using mixout you need to provide a correlated set of hooks
and injectors inside a single object know as `Injector` that will be passed into mixout.

## Principles

There are 2 very important principles about injectors.

1. All injectors and hooks **must** be pure. At all cost! Seriously!
1. The `Injector` object that has the hooks and injectors **should never be modified**
after creation.

If any of the above are violated you will experience twisted, hard-to-track bugs
all over your/your user's application.

## Creation

There are 2 general ways you can build an injector.

1. Single purpose plain object.
1. Injector factory function.

Before introducing the API take a look at a few examples:

**Single purpose plain object:** `pure` implementation

```js
import mixout from 'react-mixout';

// shallowEqual implementation...

const pure = {
  shouldComponentUpdateHook(nextProps, nextContext, ownProps, ownContext) {
    return !shallowEqual(nextProps, ownProps) || !shallowEqual(nextContext, ownContext);
  },
};

const Component = () => null;
export default mixout(pure)(Component);
```

**Injector factory function:** `transformProp` implementation

```js
const transformProp = (name, transformer) => ({
  propInjector: (setProp, ownProps) => setProp(name, transformer(ownProps[name])),
});

const Component = () => null;
export default mixout(transformProp('fullName', str => str.toUpperCase()))(Component);
```

## Constraints

You can hook into all lifecycle methods of the Mixout instance, modify validators,
add default props, force an update, hold state, pass props, work with context and much more!
The good news is that your work can almost never conflict with others. That is because
there are some constraints you need to be aware of.

1. **Zero access to Mixout instance:** There is no way you can modify the Mixout
instance, prototype, etc. directly.
1. **No React state:** Instead, each feature will have it's own absolutely isolated state
1. **No direct access to passed down props:** Features can only call `setPorp` to add/override
a prop. They can never directly modify the props object passed down.

All these constraints ensure compatibility between various features used in a single Mixout instance.

## Quick Guide

Some use-cases require state, triggering updates or accessing the wrapped component.

### State

Each feature gets its own isolated state. The state object is passed into each hook and injector
where it makes sense. Please note that modifying the isolated state **will not trigger an update**
if it must be done you need to manually trigger an update.

### Trigger an Update

The `initialStateInjector` will pass a `forceUpdater` function, if you need to use it, hold a reference
in your isolated state. Keep in mind, every function you see below is pure!

```js
const counter = (interval: number) => ({
  initialStateInjector: (props, context, state, forceUpdater) => {
    // keep the updater inside the isolated state
    state.forceUpdater = forceUpdater;
    state.count = 0;
  },
  propInjector: (setProp, props, context, state) => setProp('count', state.count),
  componentDidMountHook: (props, context, state) => {
    const tick = () => {
      state.count += 1;
      state.forceUpdater(); // trigger the update.
      state.timerId = setTimeout(tick, interval);
    };

    state.timerId = setTimeout(tick, interval);
  },
  componentWillUnmountHook: (props, context, state) => clearTimeout(state.timerId),
});
```

### Access the Child

If the child is a class component a reference to it will be passed into each hook and injector
where it makes sense. Try not to abuse this feature, as it will take away the option of
wrapping function components.

```js
const focusOnMount = {
  componentDidMountHook: (props, context, state, child) => {
    if (child && typeof child.focus === 'function') {
      child.focus();
    }
  },
};
```

## API

You can provide these hooks and injectors to hook into lifecycle methods and transform data.

```js
interface Injector {
  propTypeInjector?: PropTypeInjector;
  contextTypeInjector?: ContextTypeInjector;
  propInjector?: PropInjector;
  initialStateInjector?: InitialStateInjector;
  imperativeMethodInjector?: ImperativeMethodInjector;
  componentWillMountHook?: ComponentWillMountHook;
  componentDidMountHook?: ComponentDidMountHook;
  componentWillReceivePropsHook?: ComponentWillReceivePropsHook;
  shouldComponentUpdateHook?: ShouldComponentUpdateHook;
  componentWillUpdateHook?: ComponentWillUpdateHook;
  componentDidUpdateHook?: ComponentDidUpdateHook;
  componentWillUnmountHook?: ComponentWillUnmountHook;
}
```

### propTypeInjector

You can use this injector to set validators and default props on the Mixout component class.

```js
interface PropTypeInjector {
  (setPropType: (name: string, validator: React.Validator<any>, defaultValue?: any) => void): void;
}
```

#### Examples

Required props:
```js
const required = (...props: string[]) => ({
  propTypeInjector: setPropType => props.forEach(prop => setPropType(prop, React.PropTypes.any.isRequired)),
});

const Component = () => null;
export default mixout(required('label', 'checked'))(Component);
```

With default value:
```js
const withDefault = (prop: string, defaultValue: any) => ({
  propTypeInjector: setPropType => setPropType(prop, React.PropTypes.any.isRequired, defaultValue),
});

const Component = () => null;
export default mixout(withDefault('name', 'anonymous'))(Component);
```

### contextTypeInjector

You can use this injector to set context validators. The context validators are needed
to get values from the context.

```js
interface ContextTypeInjector {
  (setContextType: (name: string, validator: React.Validator<any>) => void): void;
}
```

#### Examples

Required context:
```js
const requiredContext = (context: string) => ({
  contextTypeInjector: setContextType => setContextType(context, React.PropTypes.any.isRequired),
});
```

### propInjector

To add/override the props that are passed down to the wrapped component you should call the
`setProp` method provided by this injector. This method is called within the render method
of Mixout, be careful not to trigger an update here :sweat_smile:.

```js
interface PropInjector {
  (setProp: (name: string, value: any) => void, ownProps: any, ownContext: any, ownState: any): void;
}
```

#### Examples

Transform prop:
```js
const transformProp = (name: string, transformer: (prop: any) => any) => ({
  propInjector: (setProp, ownProps) => setProp(name, transformer(ownProps[name])),
});
```

### initialStateInjector

This injector can be used to add initial values to the isolated state of the feature.
It's also used provide access to the updater, for more information see the "Trigger an Update" section.

```js
interface InitialStateInjector {
  (ownProps: any, ownContext: any, ownState: any, forceUpdater: (callback?: () => void) => void): void;
}
```

#### Examples

Initial prop value:
```js
const initialPropValue = (propName: string, alias: string) => ({
  initialStateInjector: (props, context, state) => state.initialPropValue = props[name],
  propInjector: (setProp, props, context, state) => setProp(alias, state.initialPropValue),
});
```

### imperativeMethodInjector

You can use this injector to add imperative methods to the `prototype` of the resulting Mixout
component. These methods will be added on the `prototype` **not** on each instance as class members!

```js
interface ImperativeMethodInjector {
  (setImperativeMethod: (name: string, implementation: ImperativeMethodImplementation) => void): void;
}
```

The implementation will get the following arguments passed down to it.

```js
interface ImperativeMethodImplementation {
  (args: any[], ownProps: any, ownContext: any, ownState: any, child: React.ReactInstance): any;
}
```

* `args`: The arguments passed into the proxy function on invocation.
* `ownProps`: Value of `this.props`.
* `ownContext`: Value of `this.context`.
* `ownState`: The feature's own isolated state object.
* `child`: A reference to the wrapped component. Please note that `child`
is only available when the wrapped component is a class component.

Anything returned from the invocation of the implementation function will be forwarded to the
caller of the proxy function.

#### Examples

Forward input methods:
```js
const initialPropValue = (propName: string, alias: string) => ({
  imperativeMethodInjector: setImperativeMethod => {
    setImperativeMethod('focus', (args, props, context, state, child) => child.focus(...args));
    setImperativeMethod('select', (args, props, context, state, child) => child.select(...args));
    setImperativeMethod('blur', (args, props, context, state, child) => child.blur(...args));
  },
});
```
