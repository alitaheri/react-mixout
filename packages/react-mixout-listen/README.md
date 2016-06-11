# [React Mixout - Listen](https://github.com/alitaheri/react-mixout-listen)
[![npm](https://badge.fury.io/js/react-mixout-listen.svg)](https://badge.fury.io/js/react-mixout-listen)
[![Build Status](https://travis-ci.org/alitaheri/react-mixout.svg?branch=master)](https://travis-ci.org/alitaheri/react-mixout)

For a full description of what this is please refer to 
the main [README](https://github.com/alitaheri/react-mixout) file of this project.

Heavily inspired by [react-event-listener](https://github.com/oliviertassinari/react-event-listener).

You can use this mixout to bind global events to methods on your component.
It will also manage memory for you, i.e. register on mount, remove on unmount.

## Installation

You can install this package with the following command:

```sh
npm install react-mixout-listen
```

## Examples

### Simple

You can easily bind a class method with a global event.

```js
import React from 'react';
import mixout from 'react-mixout';
import listen from 'react-mixout-listen';

class MyComponent extends React.Component {
  onResize(event) {
    // handle resize
  }

  render() {
    return null;
  }
}

// By default mixout will attach the listener to window.
export default mixout(listen('resize', 'onResize'))(MyComponent);
```

### Modify Target

If you need to attach the listener to another node you can use the target
property on options.

The target can be either a string (key on window) like: `document` or `window`, or
a callback returning the element to attach the listener on. Defaults to `window`.

**Why a callback?** Server doesn't have `window` or `document`. Since the target
is not needed until after mounting, this can approach ensure that server-side rendering
is always supported out of box.

```js
import React from 'react';
import mixout from 'react-mixout';
import listen from 'react-mixout-listen';

class MyComponent extends React.Component {
  onClick(event) {
    // handle resize
  }

  render() {
    return null;
  }
}

export default mixout(listen('click', 'onClick', { target: 'document' }))(MyComponent);

// Or ...

// You can return any node you wish from the callback.
export default mixout(listen('click', 'onClick', { target: () => document.body }))(MyComponent);
```

### Use Capture

If you need to pass down the `useCapture` argument you can add `useCapture: true` to the options.

```js
import React from 'react';
import mixout from 'react-mixout';
import listen from 'react-mixout-listen';

class MyComponent extends React.Component {
  onResize(event) {
    // handle resize
  }

  render() {
    return null;
  }
}

export default mixout(listen('resize', 'onResize', { useCapture: true }))(MyComponent);
```

## API Reference

### listen

```js
function listen(event: string, method: string, options?: ListenOptions): Injector

interface ListenOptions {
  target?: string | (() => EventTarget);
  useCapture?: boolean;
}
```

* `event`: The name of the event to pass to `addEventListener`.
* `method`: The name of the method on the wrapped component to call when the event fires.
* `options`: The extra options to customize behavior.
  * `target`: The name of the key on `window` or a callback returning the target node.
  * `useCapture`: Determines whether the `addEventListener` should be called with `useCapture: true`.

## Typings

The typescript type definitions are also available and are installed via npm.

## License
This project is licensed under the [MIT license](https://github.com/alitaheri/react-mixout/blob/master/LICENSE).
