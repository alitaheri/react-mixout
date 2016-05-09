# [React Mixout](https://github.com/alitaheri/react-mixout)
[![npm](https://badge.fury.io/js/react-mixout.svg)](https://badge.fury.io/js/react-mixout)
[![Build Status](https://travis-ci.org/alitaheri/react-mixout.svg?branch=master)](https://travis-ci.org/alitaheri/react-mixout)

Using React's mixins is known to be an anti pattern. But they do provide more performance
over higher order component (HOC) chain. This library tends to bring the two approaches closer.

Mixout is a higher order component which can have an arbitrary number of features.

Imagine you have 3 concerns: 
1. shouldComponentUpdate
2. get values from context
3. externalize state

These concerns don't overlap, they can be easily implemented inside a single
higher-order-component. But that won't scale very well, and sometimes you want to
pick 1 or 2 for a particular component. You can have 3 HOCs for this purpose. But
that would also mean 3 extra instances for React to track and call render on.

After some discussion that happened on [material-ui](https://github.com/callemall/material-ui)
we realized, the best approach would be this:

> A single higher-order-component that can host specific features.

Well, that's like a mixin. Except that it doesn't pollute the component's logic. they reside
inside a single wrapper outside the component's life cycle methods.

This repository is a monorepo consisting of the main package [react-mixout](packages/react-mixout)
and some [included features](packages) that you can use out of box.

### TL;DR

Mixout _n._ Mixin that lives outside the component to keep the component's logic simple.

## Installation

You can install this package with the following command:

```sh
npm install react-mixout
```

Also some included features:

```sh
# Forwards context properties as props
npm install react-mixout-forward-context

# Forwards imperative method calls to it's wrapped 
# child, useful for ReactTransitionGroup and focus.
npm install react-mixout-forward-method

# Shallow compares context and props implementing shouldComponentUpdate
npm install react-mixout-pure

# Helps provide both controlled and uncontrolled behaviors for a component.
# You will only need to implement the controlled behavior using this mixout.
npm install react-mixout-uncontrol
```

You may find more mixouts in the wild [here](https://www.npmjs.com/browse/keyword/mixout).

## How does it work?

It works by providing hooks, injectors and an isolated state to each feature. Those
features can then use the API provided by mixout to implement their logic. The API
is very strick and tries to make sure plugins play nicely with each other. When these
plugins are bundled with a call to `mixout(plugin1, plugin2, ...)` they will all reside
inside a single component to avoid performance issues with HOC chains. It will then
invoke appropiate hooks like `componentDidMountHook` and call injectors throughout it's lifecycle.

## Word of caution 

This library does not enforce class components to be wrapped, function components can be wrapped
too. But if there is a mixout that relies on `ref` you might need to turn your function component
into a class one.

## Examples

These examples will give you a brief overview of how this library is used:

### Simple Usage

This example uses 2 of the mixouts included in this repository.

```js
import mixout from 'react-mixout';
import pure from 'react-mixout-pure';
import forwardContext from 'react-mixout-forward-context';

const MyComponent = ({themeFromContext}) => <input /*...*/ />;

// This will result in a HOC that implements shouldComponentUpdate that checks context
// and props and also gets theme from context and passes it down as themeFromContext.
// All done within a sigle component, no HOC chain overhead :D
export default mixout(pure, forwardContext('theme', { alias: 'themeFromContext' }))(MyComponent);
```

### Common features

If you have features in your application and need to put them in all of your components
without having to import and call mixout for every one of them like:

```js
import feature1 from 'react-mixout-feature1';
import feature2 from 'react-mixout-feature2';
import feature3 from 'react-mixout-feature3';
import feature4 from 'react-mixout-feature4';

// Component ...

export default mixout(feature1, feature2, feature3, feature4)(Component);
```

You can `combine` features and make a feature combination. Feature combinations
can be used alongside other features and will all be flatten with a `mixout` call:

`myPackedFeatures`:
```js
import {combine} from 'react-mixout';
import feature1 from 'react-mixout-feature1';
import feature2 from 'react-mixout-feature2';
import feature3 from 'react-mixout-feature3';
import feature4 from 'react-mixout-feature4';

export default combine(feature1, feature2, feature3, feature4);
```

`Component`:
```js
import mixout from 'react-mixout';
import myPackedFeatures from './myPackedFeatures';
import {forwardReactTransitionGroupMethods} from 'react-mixout-forward-method';

// AnimatedComponent

export default mixout(forwardReactTransitionGroupMethods, myPackedFeatures)(AnimatedComponent);
```

## Write your own mixout

The included features only use the public API of react-mixout. You can implement your own
set of features and publish to npm so others can use too. You can read more about how you
can implement your own mixout [here](packages/react-mixout/INJECTOR.md).

## API Reference

[react-mixout](packages/react-mixout/README.md)

##### included features

* [react-mixout-forward-context](packages/react-mixout-forward-context/README.md)
* [react-mixout-forward-method](packages/react-mixout-forward-method/README.md)
* [react-mixout-pure](packages/react-mixout-pure/README.md)
* [react-mixout-uncontrol](packages/react-mixout-uncontrol/README.md)

## Typings

The typescript type definitions are also available and are installed via npm.

## Thanks

Great thanks to [material-ui](https://github.com/callemall/material-ui)
team and specially [@nathanmarks](https://github.com/nathanmarks) for
providing valuable insight that made this possible.

## License
This project is licensed under the [MIT license](https://github.com/alitaheri/react-mixout/blob/master/LICENSE).
