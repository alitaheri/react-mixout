# [React Mixout - Pass Context](https://github.com/alitaheri/react-mixout-pass-context)
[![npm](https://badge.fury.io/js/react-mixout-pass-context.svg)](https://badge.fury.io/js/react-mixout-pass-context)
[![Build Status](https://travis-ci.org/alitaheri/react-mixout.svg?branch=master)](https://travis-ci.org/alitaheri/react-mixout)

For a full description of what this is please refer to 
the main [README](https://github.com/alitaheri/react-mixout) file of this project.

This mixout allows you to easily forward props as context.

## Installation

You can install this package with the following command:

```sh
npm install react-mixout-pass-context
```

## Example

```js
import React from 'react';
import mixout from 'react-mixout';
import passContext from 'react-mixout-pass-context';

class MyComponent extends React.Component {
  static contextTypes = {
    color: React.PropTypes.string,
  };

  render() {
    return <span style={{color: this.context.color}}>Hello</span>;
  }
}

// Although directly using context when props could do doesn't make sense,
// but you get the point. :D 
export default mixout(passContext('color', ({r, g, b}) => `rgb(${r},${g},${b})`))(MyComponent);
```

## API Reference

### passContext

```js
function passContext(name: string, builder: (ownProps: any) => any): Injector;
```

* `name`: The name context to be passed down the tree.
* `builder`: Calculates the context value from the component props.

## Typings

The typescript type definitions are also available and are installed via npm.

## License
This project is licensed under the [MIT license](https://github.com/alitaheri/react-mixout/blob/master/LICENSE).
