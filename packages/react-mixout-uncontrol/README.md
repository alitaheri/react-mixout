# [React Mixout - Uncontrol](https://github.com/alitaheri/react-mixout-uncontrol)
[![npm](https://badge.fury.io/js/react-mixout-uncontrol.svg)](https://badge.fury.io/js/react-mixout-uncontrol)
[![Build Status](https://travis-ci.org/alitaheri/react-mixout.svg?branch=master)](https://travis-ci.org/alitaheri/react-mixout)

For a full description of what this is please refer to 
the main [README](https://github.com/alitaheri/react-mixout) file of this project.

Common patterns of uncontrolled components giving you a hard time? You are
a library author and supporting both controlled and uncontrolled API is
complicating your component? Then this mixout is for you.

You can provide only a controlled API (which is a lot simpler and a lot
easier to maintain) and use this mixout to provide an uncontrolled API
for your component.

The way it works is pretty straightforward. You provide `myProp` and
`onMyPropChange` properties (passing them to `input` etc.) and this mixout
keeps the current value inside it's isolated state. Then it provides imperative
methods to make building forms easier (`setMyProp`, `getMyProp` and `clearMyProp`)
and the usual props (`onMyPropChange`, `defaultMyProp`). It gets it's value from
the `SyntheticEvent` react passes to it's callbacks. Of course, all these behaviors
are overridable.

## Installation

You can install this package with the following command:

```sh
npm install react-mixout-uncontrol
```

## Usage: 

```js
import mixout from 'react-mixout';
import uncontrol from 'react-mixout-uncontrol';

const MyComponent = ({foo, onFooChange}) => (
  <input value={foo} onChange={onFooChange}/>
);

export default mixout(uncontrol('foo'))(Component);
```

The resulting component will have the props:

1. `defaultFoo: any`: The default value to use for the `foo` prop.
1. `onFooChange: (...args: any[]) => void`: The callback function that informs the user of changes to the value.
The signature of the function depends on it's call side which in this case is `input`'s
`onChange` callback.

With the following imperative methods on it:

1. `setFoo: (value: any) => void`: Sets the value of the `foo` prop.
1. `getFoo: () => any`: Gets the value of the `foo` prop.
1. `clearFoo: () => any`: Resets the value of the `foo` prop back to it's default value.

## Examples

### Simple:

You can very easily uncontrol a property if your component
follows the convention.

```js
import React from 'react';
import mixout from 'react-mixout';
import uncontrol from 'react-mixout-uncontrol';

class MyComponent extends React.Component {
  render() {
    const {foo, onFooChange} = this.props;

    return (
      <input value={foo} onChange={onFooChange}/>
    );
  }
};

export default mixout(uncontrol('foo'))(Component);
```

Now you can use `MyComponent` as if it was uncontrolled.

```js
import React from 'react';
import MyComponent from './MyComponent';

class MyOtherComponent extends React.Component {

  componentDidMount() {
    this.myComponent.setFoo('baz');
    this.myComponent.getFoo(); // --> 'baz'
    this.myComponent.clearFoo();
    this.myComponent.getFoo(); // --> 'bar'
  }

  render() {
    return (
      <MyComponent
        ref={i => this.myComponent = i}
        defaultFoo={'bar'}
        onFooChange={event => alert(event.target.value)}/>
    );
  }
};

```

### Name Overrides:

If your component can't follow the defaults or you simply just
don't want it to you can override all public namings.

```js
import React from 'react';
import mixout from 'react-mixout';
import uncontrol from 'react-mixout-uncontrol';

class MyComponent extends React.Component {
  render() {
    const {bar, onChange} = this.props;

    return (
      <input value={bar} onChange={onChange}/>
    );
  }
};

// Notice the uppercase first character.
export default mixout(uncontrol('foo', {
  // These affect the API
  defaultValuePropName: 'myFoo', // defaults to 'defaultFoo'
  callbackPropName: 'onMyFooChange', // defaults to 'onFooChange'
  getValueMethodName: 'myFoo', // defaults to 'getFoo'
  setValueMethodName: 'setMyFoo', // defaults to 'setFoo'
  clearValueMethodName: 'clear', // defaults to 'clearFoo'

  // These affect the usage within the wrapped component
  passedDownValuePropName: 'bar', // defaults to 'foo'
  passedDownCallbackPropName: 'onChange', // defaults to 'onFooChange'
}))(Component);
```

You can see the impact on the usage as well as public API.

```js
import React from 'react';
import MyComponent from './MyComponent';

class MyOtherComponent extends React.Component {

  componentDidMount() {
    this.myComponent.setMyFoo('baz');
    this.myComponent.myFoo(); // --> 'baz'
    this.myComponent.clear();
    this.myComponent.myFoo(); // --> 'bar'
  }

  render() {
    return (
      <MyComponent
        ref={i => this.myComponent = i}
        myFoo={'bar'}
        onMyFooChange={event => alert(event.target.value)}/>
    );
  }
};

```

### Property Defaults and Validation:

If you wish, you can also provide default value and validation for
the API props.

```js
import React from 'react';
import mixout from 'react-mixout';
import uncontrol from 'react-mixout-uncontrol';

class MyComponent extends React.Component {
  render() {
    const {foo, onFooChange} = this.props;

    return (
      <input value={foo} onChange={onFooChange}/>
    );
  }
};

export default mixout(uncontrol('foo', {
  defaultValuePropValidator: React.PropTypes.string,
  defaultValuePropDefault: 'bar',
  callbackPropValidator: React.PropTypes.func,
  callbackPropDefault: event => console.log(event.target.value),
}))(Component);
```

### Eccentric Callback Function:

Since uncontrol needs to be informed of the value changes through
the callback it passes down, it needs a way to get the new value
whenever that function is called. It follows the convention and
gets it from the `SyntheticEvent` passed as the first argument.
However, if the component you are passing the `passedDownCallback` to
has eccentric callback signature you can override the default
value collection function to.

```js
import React from 'react';
import mixout from 'react-mixout';
import uncontrol from 'react-mixout-uncontrol';

class MyComponent extends React.Component {
  render() {
    const {foo, onFooChange} = this.props;

    return (
      <WeirdComponent value={foo} onChange={onFooChange}/>
    );
  }
};

export default mixout(uncontrol('foo', {
  // defaults to event => event.target.value
  getValueFromPassedDownCallback: (event, index, key, value) => value,
}))(Component);
```

### Common Patterns:

It is very common to use this library to forward standard funtionalities of
`input`, `select` and other elements. `uncontrolValue` provides some common
naming patterns to make it easier to do so.


```js
import React from 'react';
import mixout from 'react-mixout';
import {uncontrolValue} from 'react-mixout-uncontrol';

class MyComponent extends React.Component {
  render() {
    const {value, onChange} = this.props;

    return (
      // or simply: <input {...this.props}/>
      <input value={value} onChange={onChange}/>
    );
  }
};

export default mixout(uncontrolValue)(Component);
```

```js
import React from 'react';
import MyComponent from './MyComponent';

class MyOtherComponent extends React.Component {

  componentDidMount() {
    this.myComponent.setValue('baz');
    this.myComponent.getValue(); // --> 'baz'
    this.myComponent.clearValue();
    this.myComponent.getValue(); // --> 'bar'
  }

  render() {
    return (
      <MyComponent
        ref={i => this.myComponent = i}
        defaultValue={'bar'}
        onChange={event => alert(event.target.value)}/>
    );
  }
};

```

## API Reference

### uncontrol

```js

interface Options<T> {
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

function uncontrol<T>(name: string, options?: Options<T>): Injector;
```

* `name`: The name of the function that is put on the mixout.
* `options`: The extra options to override the default behavior, the options can include:
  * `defaultValuePropName`: The name to use for the default value property.
  * `defaultValuePropValidator`: The validator to use for the default value property.
  * `defaultValuePropDefault`: The value to use when the default value property has no value.
  * `callbackPropName`: The name to use for the change callback property.
  * `callbackPropValidator`: The validator to use for the change callback property.
  * `callbackPropDefault`: The default function to use when the change callback property has no value.
  * `getValueMethodName`: The name of the getter imperative method.
  * `setValueMethodName`: The name of the setter imperative method.
  * `clearValueMethodName`: The name of clear imperative method.
  * `passedDownValuePropName`: The name of the passed down value property.
  * `passedDownCallbackPropName`: The name of the passed down change callback property.
  * `getValueFromPassedDownCallback`: The method that gets the value from the invocation of the
passed down change callback.

### uncontrolValue:

```js
const uncontrolValue: Injector;
```

You can pass this directly to mixout out of box.

## Typings

The typescript type definitions are also available and are installed via npm.

## License
This project is licensed under the [MIT license](https://github.com/alitaheri/react-mixout/blob/master/LICENSE).
