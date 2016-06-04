# [React Mixout - Pure](https://github.com/alitaheri/react-mixout-pure)
[![npm](https://badge.fury.io/js/react-mixout-pure.svg)](https://badge.fury.io/js/react-mixout-pure)
[![Build Status](https://travis-ci.org/alitaheri/react-mixout.svg?branch=master)](https://travis-ci.org/alitaheri/react-mixout)

For a full description of what this is please refer to 
the main [README](https://github.com/alitaheri/react-mixout) file of this project.

## Installation

You can install this package with the following command:

```sh
npm install react-mixout-pure
```

## API Reference

### pure

Provides an implantation of shouldComponentUpdate shallowly
checking the equality of next and previous props and context for your mixout.

This is only a tiny feature so, one example is enough.

##### Example

```js
import mixout from 'react-mixout';
import pure from 'react-mixout-pure';

const Component = props => /* Your everyday component*/ null;

export default mixout(pure)(Component);
```

## Typings

The typescript type definitions are also available and are installed via npm.

## License
This project is licensed under the [MIT license](https://github.com/alitaheri/react-mixout/blob/master/LICENSE).
