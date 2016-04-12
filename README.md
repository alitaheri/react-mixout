# [React Mixout](https://github.com/alitaheri/react-mixout)
[![npm](https://badge.fury.io/js/react-mixout.svg)](https://badge.fury.io/js/react-mixout)
[![Build Status](https://travis-ci.org/alitaheri/react-mixout.svg?branch=master)](https://travis-ci.org/alitaheri/react-mixout)

Using React's mixins is known to be an anti pattern. But they do provide more performance
over higher-order-component chain. This library tends to bring the two approaches closer.

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

### TL;DR

Mixout _n._ Mixin that lives outside the component to keep the component's logic simple.

## Installation

You can install this package with the following command:

```sh
npm install react-mixout
```

## Example


## API Reference

## Typings

The typescript type definitions are also available and are installed via npm.

## Thanks

Great thanks to material-ui team and specially @nathanmarks for providing
valuable insight that made this possible. 

## License
This project is licensed under the [MIT license](https://github.com/alitaheri/react-mixout/blob/master/LICENSE).
