# [React Mixout - Forward Context](https://github.com/alitaheri/react-mixout-forward-context)
[![npm](https://badge.fury.io/js/react-mixout-forward-context.svg)](https://badge.fury.io/js/react-mixout-forward-context)
[![Build Status](https://travis-ci.org/alitaheri/react-mixout.svg?branch=master)](https://travis-ci.org/alitaheri/react-mixout)

For a full description of what this is please refer to 
the main [README](https://github.com/alitaheri/react-mixout) file of this project.

This mixout will provide an easy way to forward values from context as props.
It also allows you to transform, rename and validate the value before it's passed down.

## Installation

You can install this package with the following command:

```sh
npm install react-mixout-forward-context
```

## Examples

### Simple:

For most cases only a name is enough, it will handle all implementation details
necessary to make it happen.

```js
import React from 'react';
import mixout from 'react-mixout';
import forwardContext from 'react-mixout-forward-context';

const Component = props => <span style={{color: props.theme.textColor}}>Hello</span>;

export default mixout(forwardContext('theme'))(Component);
```

### Validator:

You can provide custom validator. `forwardContext` uses `React.PropTypes.any` by default
for the provided name.

```js
import React from 'react';
import mixout from 'react-mixout';
import forwardContext from 'react-mixout-forward-context';

const Component = props => <span style={{color: props.theme.textColor}}>Hello</span>;

export default mixout(forwardContext('theme', { validator: React.PropTypes.object }))(Component);
```

### Rename:

If there are name conflicts with other props passed down from parent components
you can rename the key on the props passed down to the wrapped component.

```js
import React from 'react';
import mixout from 'react-mixout';
import forwardContext from 'react-mixout-forward-context';

const Component = props => <span style={{color: props.globalTheme.textColor}}>Hello</span>;

export default mixout(forwardContext('theme', { alias: 'globalTheme' }))(Component);
```

### Default Value:

It's also possible to choose a default value if the context doesn't provide the
required value.

There are two ways to provide a default. a simple value or a value generator.
Sometimes you may need to build the value from the props passed down from parent component.
The generator helps you do that.

```js
import React from 'react';
import mixout from 'react-mixout';
import forwardContext from 'react-mixout-forward-context';

const Component = props => <span style={{color: props.theme.textColor}}>Hello</span>;

const defaultTheme = { textColor: '#212121' };

export default mixout(forwardContext('theme', { defaultValue: defaultTheme }))(Component);
```

Or using generator:

```js
import React from 'react';
import mixout from 'react-mixout';
import forwardContext from 'react-mixout-forward-context';

const Component = props => <span style={{color: props.theme.textColor}}>Hello</span>;

const defaultThemeGenerator = props => ({ textColor: props.color || '#212121' });

export default mixout(forwardContext('theme', { defaultGenerator: defaultThemeGenerator }))(Component);
```

### Transformation:

In some cases you might need to transform the context before passing it down.
It's best used to provide backward compatibility by library authors.

```js
import React from 'react';
import mixout from 'react-mixout';
import forwardContext from 'react-mixout-forward-context';

const Component = props => <span style={{color: props.textColor}}>Hello</span>;

const mapToProp = theme => theme.textColor;

export default mixout(forwardContext('theme', { mapToProp, alias: 'textColor' }))(Component);
```

## API Reference

### forwardContext

Gets value from context and passes it down as props.

```js
function forwardContext(name: string, options?: ForwardContextOptions) => Injector;
```

* `name`: The name of the key on context to be passed down. It's also used
to name the passed property if an alias is not provided as option.
* `options`: The optional settings you can provide to manipulate its behavior:

```js
interface ForwardContextOptions<T> {
  alias?: string;
  validator?: React.Validator<T>;
  defaultValue?: T;
  defaultGenerator?: (ownProps: any) => T;
  mapToProp?: (value: T) => any;
}
```

* `alias`: Used to name the property passed down.
* `validator`: Context validator function.
* `defaultValue`: The default value to use if the context is not available.
* `defaultGenerator`: Default value generator function, this takes precedence
over `defaultValue` if both are provided.
* `mapToProp`: Transforms the value taken from context before passing it down as property.

## Typings

The typescript type definitions are also available and are installed via npm.

## License
This project is licensed under the [MIT license](https://github.com/alitaheri/react-mixout/blob/master/LICENSE).
