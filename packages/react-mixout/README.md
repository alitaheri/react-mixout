# [React Mixout](https://github.com/alitaheri/react-mixout)
[![npm](https://badge.fury.io/js/react-mixout.svg)](https://badge.fury.io/js/react-mixout)
[![Build Status](https://travis-ci.org/alitaheri/react-mixout.svg?branch=master)](https://travis-ci.org/alitaheri/react-mixout)

For a full description of what this is please refer to 
the main [README](https://github.com/alitaheri/react-mixout) file of this project.

## Installation

You can install this package with the following command:

```sh
npm install react-mixout
```

## API Reference

### mixout

Analyzes and applies features to your component as an HOC.

```js
// Returns a wrapper that can wrap your component and apply the
// desired features on it. Or you can pass in a remix to enable
// direct rendering.
function mixout(...injectors: Injector[]): Wrapper;

// Wrapper: Component => WrappedComponent;
// Wrapper: Remix => Component;
```

`injectors`: The features or combination of features to apply to this component.

**note:** if you wish to know what these injectors look like take a look at the
[INJECTOR.md](https://github.com/alitaheri/react-mixout/blob/master/packages/react-mixout/INJECTOR.md)
file.

##### Example

```js
import mixout from 'react-mixout';
import pure from 'react-mixout-pure';
import forwardContext from 'react-mixout-forward-context';

const Component = props => /* Your everyday component*/ null;

export default mixout(pure, forwardContext('theme'))(Component);
```

### combine

Combines multiple features into a pack of features for easier shipping.
Please note that this function supports nested combinations, that means
you can combine packs with other packs and features as you wish, but a cyclic
combination (if at all possible) will probably hang your application.

```js
// Returns the packed feature made up of the provided features
function combine(...injectors: Injector[]): Injector;
```

`injectors`: The features to pack as one.

##### Example

```js
// commonFeatures.js
import {combine} from 'react-mixout';
import pure from 'react-mixout-pure';
import forwardContext from 'react-mixout-forward-context';
export default combine(pure, forwardContext('theme'));

// Component.js
import mixout from 'react-mixout';
import commonFeatures from './commonFeatures';

const Component = props => /* Your everyday component*/ null;

export default mixout(commonFeatures)(Component);
```

### remix

Builds a representation of what the render function on mixout will
return. Useful for small wrapped components.

```js
function remix<P>(renderer: RemixRenderer<P>): Remix<P>;
function remix<P>(displayName: string, renderer: RemixRenderer<P>): Remix<P>;

type RemixRenderer<P> = (props: P) => ReactElement;
```

`renderer`: The renderer function that takes the passed props and returns a react element.
`displayName`: The display name to use to override Mixout's default `displayName`.

##### Example

```js
import mixout, {remix} from 'react-mixout';
import pure from 'react-mixout-pure';

const Component = remix(props => /* Your everyday tiny component*/ null);

export default mixout(pure)(Component);
```

## Typings

The typescript type definitions are also available and are installed via npm.

## Thanks

Great thanks to [material-ui](https://github.com/callemall/material-ui)
team and specially [@nathanmarks](https://github.com/nathanmarks) for
providing valuable insight that made this possible.

## License
This project is licensed under the [MIT license](https://github.com/alitaheri/react-mixout/blob/master/LICENSE).
