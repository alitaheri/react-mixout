# [React Mixout - Memoize](https://github.com/alitaheri/react-mixout-memoize)
[![npm](https://badge.fury.io/js/react-mixout-memoize.svg)](https://badge.fury.io/js/react-mixout-memoize)
[![Build Status](https://travis-ci.org/alitaheri/react-mixout.svg?branch=master)](https://travis-ci.org/alitaheri/react-mixout)

For a full description of what this is please refer to 
the main [README](https://github.com/alitaheri/react-mixout) file of this project.

Heavily inspired by [Reselect](https://github.com/reactjs/reselect).
This is a simply a caching and cache invalidation library. If you have
expensive data derivation logic, you can use this library to memoize
the results and only recalculate when needed (inputs change).

This is roughly how the library works:

1. Take data from prop and context.
2. Run selectors and get needed input values.
3. Run resolver with the input values if they are modified from the previous
invocation. (resolver must be cpu/memory intensive for this to have positive effect)
4. Pass the results down as property.
5. With each invocation of `componentWillReceiveProps` go to 1.

## Installation

You can install this package with the following command:

```sh
npm install react-mixout-memoize
```

## Examples

### Simple

You can simply memoize a prop with `memoize`.

```js
import React from 'react';
import mixout from 'react-mixout';
import memoize from 'react-mixout-memoize';

const ShowTotal = (props) => <span>{props.total}</span>;

// The resolver (last function) won't be called unless one of the selectors return
// a different value.
const memoizeTotal = memoize('total',
  (props) => props.account.credit,
  (props) => props.account.debt,
  (props) => props.pocket.cash,
  (credit, debt, cash) => credit - debt + cash
);

export default mixout(memoizeTotal)(ShowTotal);
```

### Context

It's also possible to select value from context, but be sure you add the
required `contextType` validator to the Mixout component, or context will not
be available to selectors. You can use the simple helper function `context` for this.

```js
import React from 'react';
import mixout from 'react-mixout';
import memoize, {context} from 'react-mixout-memoize';

const Name = (props) => <span style={props.style}>{props.name}</span>;

const memoizeStyle = memoize('style',
  (props, context) => context.theme.palette.color,
  (props) => (props.textStyles && props.textStyles.margin) || 0,
  (color, margin) => ({ color, margin })
);

export default mixout(memoizeStyle, context('theme'))(Name);
```

## API Reference

### memoize

```js
function memoize(name: string, ...selectors: Selector[], resolver: Resolver): Injector;

type Selector = (props, context) => any;
type Resolver = (...args: any[]) => any;
```

* `name`: The name of the function that is put on the mixout.
* `selectors`: The selectors to use to get values from props or context.
* `resolver`: The function to call the values with, this is the memoization function.

### context

Adds a key with `React.PropTypes.any` value to the `contextTypes` of Mixout.

```js
function context(name: string): Injector;
```

* `name`: The name of key to add on the `contextTypes` object.

## Typings

The typescript type definitions are also available and are installed via npm.

## License
This project is licensed under the [MIT license](https://github.com/alitaheri/react-mixout/blob/master/LICENSE).
