# [React Mixout - Forward Method](https://github.com/alitaheri/react-mixout-forward-method)
[![npm](https://badge.fury.io/js/react-mixout-forward-method.svg)](https://badge.fury.io/js/react-mixout-forward-method)
[![Build Status](https://travis-ci.org/alitaheri/react-mixout.svg?branch=master)](https://travis-ci.org/alitaheri/react-mixout)

For a full description of what this is please refer to 
the main [README](https://github.com/alitaheri/react-mixout) file of this project.

You can use this tiny mixout to forward method calls to the wrapped component.
As they say, HOCs break imperative methods and libraries that depend on it.
`ReactTransitionGroup` is of them, and since it's very common we also provide
a mixout solely for that lib called `forwardReactTransitionGroupMethods`.

## Installation

You can install this package with the following command:

```sh
npm install react-mixout-forward-method
```

## Examples

### Simple:

You can simply forward a method using `forwardMethod`.

```js
import React from 'react';
import mixout from 'react-mixout';
import forwardMethod from 'react-mixout-forward-method';

class MyComponent extends React.Component {
  foo(a, b) {
    return a + b;
  }

  render() {
    return null;
  }
};

// The resulting component will forward the call, passing all the arguments
// and returning the returned value.
export default mixout(forwardMethod('foo'))(Component);
```

### Rename:

You can also rename the method.

```js
import React from 'react';
import mixout from 'react-mixout';
import forwardMethod from 'react-mixout-forward-method';

class MyComponent extends React.Component {
  foo(a, b) {
    return a + b;
  }

  render() {
    return null;
  }
};

// Does the same as previous example except that you will need to
// call .bar(1, 2) on the instance instead of .foo(1, 2)
export default mixout(forwardMethod('bar', 'foo'))(Component);
```

### Multiple functions:

Just use mixout's `combine` or pass in another forwardMethod:

```js
import React from 'react';
import mixout from 'react-mixout';
import forwardMethod from 'react-mixout-forward-method';

// MyComponent

export default mixout(
  forwardMethod('bar'),
  forwardMethod('baz', 'foo'),
  combine(forwardMethod('focus'), forwardMethod('blur'))
)(Component);
```

### ReactTransitionGroup:

Import `forwardReactTransitionGroupMethods` and add it to the mix.

```js
import React from 'react';
import mixout from 'react-mixout';
import {forwardReactTransitionGroupMethods} from 'react-mixout-forward-method';

// Implement componentWillAppear, etc...
// MyAnimatedComponent

export default mixout(forwardReactTransitionGroupMethods)(Component);
```

## API Reference

### forwardMethod

```js
function forwardMethod(name: string, targetName?: string): Injector;
```

* `name`: The name of the function that is put on the mixout.
* `targetName`: The name of the target function on the wrapped component.
`name` is used if omitted.

### forwardReactTransitionGroupMethods:

```js
const forwardReactTransitionGroupMethods: Injector;
```

You can pass this directly to mixout out of box.

## Typings

The typescript type definitions are also available and are installed via npm.

## License
This project is licensed under the [MIT license](https://github.com/alitaheri/react-mixout/blob/master/LICENSE).
