# React Mixout Injector API

In order to build features using mixout you need to provide a correlated set of hooks
and injectors inside a single object know as `Injector` that will be passed into mixout.

## Principles

There are 2 very important principles about injectors.

1. All injectors and hooks **must** be pure. At all cost! seriously!
1. The `Injector` object that has the hooks and injectors **should never be modified**
after creation.

If any of the above are violated you will exprience twisted, hard-to-track bugs
all over your/your user's application.

## Creation

There are 2 general ways you can build an injector.

1. Single purpose plain object.
1. Injector factory function.

Before introducing the API take a look at a few examples of the 3 methods:

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
The good news is that your work can almost never conflict with anothers, that is because
There are some constraints you need to be aware of.

1. **Zero access to Mixout instance:** There is no way you can modify the Mixout
instance, prototype, etc. directly.
1. **No React state:** Instead, each feature will have it's own absolutely isolated state
1. **No direct access to passed down props:** Features can only call `setPorp` to add/override
a prop, then can never directly modify the object passed down.

All these constraints ensure compatibility between various features used in a single Mixout instance.

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

### PropTypeInjector:

You can use this injector to set validators and default props on the Mixout component class.

```js
export interface PropTypeInjector {
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

