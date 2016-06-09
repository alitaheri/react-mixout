# [React Mixout - Proxy](https://github.com/alitaheri/react-mixout-proxy)
[![npm](https://badge.fury.io/js/react-mixout-proxy.svg)](https://badge.fury.io/js/react-mixout-proxy)
[![Build Status](https://travis-ci.org/alitaheri/react-mixout.svg?branch=master)](https://travis-ci.org/alitaheri/react-mixout)

For a full description of what this is please refer to 
the main [README](https://github.com/alitaheri/react-mixout) file of this project.

This mixout proxifies imperative method invocations through a ref callback passed down as property.
Some imperative DOM methods cannot be expressed through idiomatic React data flow, such as `focus`,
`blur`, `select`, etc. Therefore, when you have such DOM elements nested deep inside your component tree
and you need to expose these functions to the users of your library you have to manually write these
functions and have them forward the call to your reference of that particular DOM element. This mixout
automates that.

## Installation

You can install this package with the following command:

```sh
npm install react-mixout-proxy
```

## Examples

### Simple

You can pass proxy a single method name and it will forward that method.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import mixout from 'react-mixout';
import proxy from 'react-mixout-proxy';

const TextBox = ({myRef, style}) => <input type="text" ref={myRef} style={style} />;

// There is no way to access the input nested inside the div and call focus on it.
let CuteTextBox = (props) => <div><TextBox {...props} style={{color: 'pink'}}/></div>;

// But fortunately you can use proxy to work around that.
// "myref" is the name of the reference callback.
CuteTextBox = mixout(proxy('myRef', 'focus'))(CuteTextBox);

// Now you can do this:
const instance = ReactDOM(<CuteTextBox />, document.getElementById('container'));
instance.focus(); // This will be called on the input!
```

### Multiple Methods

You can pass an array to forward more than one method.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import mixout from 'react-mixout';
import proxy from 'react-mixout-proxy';

const TextBox = ({myRef, style}) => <input type="text" ref={myRef} style={style} />;

let CuteTextBox = (props) => <div><TextBox {...props} style={{color: 'pink'}}/></div>;

CuteTextBox = mixout(proxy('myRef', ['focus', 'blur', 'click', 'select']))(CuteTextBox);

const instance = ReactDOM(<CuteTextBox />, document.getElementById('container'));
instance.focus();
instance.blur();
instance.click();
instance.select();
```

### Alias

To alias a method simple import `alias` and put `alias(name: string, as: string)` instead of an string.

There are many cases when an alias is needed.

1. You have multiple proxies pointing to multiple input elements. You can't have `focus` focusing
2 elements. So you rename them: `focusName` -> `nameRef.focus` and `focusFamily` -> `familyRef.focus`.
1. You already have some methods on your API and want to provide backward compatibility.
1. You need multiple methods to point to one method on your target.
1. You **just** don't like the name of the DOM method name... who named you `setRangeText`? ewww!

```js
import React from 'react';
import ReactDOM from 'react-dom';
import mixout from 'react-mixout';
import proxy, {alias} from 'react-mixout-proxy';

class MultiTargetComponent extends React.Component {
  sayHello() {
    alert('hello');
  }

  render() {
    return (
      <div>
        <input ref={this.props.ref1} type="text"/>
        <input ref={this.props.ref2} type="text"/>
      </div> 
    );
  }
}

let SomeHOC = (props) => <MultiTargetComponent {...props}/>;

SomeHOC = mixout(
  proxy('ref1', [
    'focus',
    'blur',
    alias('click', 'clickFirst'),
    alias('click', 'clickMe'),
    'select',
  ]),
  proxy('ref2', alias('focus', 'focusSecond'))
)(SomeHOC);

const instance = ReactDOM(<SomeHOC />, document.getElementById('container'));

// All called on the first input.
instance.focus();
instance.blur();
// Both will call click on the first input.
instance.clickFirst();
instance.clickMe();
// Called on the second input.
instance.focusSecond();
```

### Handling Unmounted References

By default it is an error to call methods on components that are not mounted.
If you prefer ignoring that sort of error you can pass false as the last argument
to ignore invocations on null references. This will effectively make the function
a no-op when the reference is null.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import mixout from 'react-mixout';
import proxy from 'react-mixout-proxy';

const TextBox = ({myRef, style}) => <input type="text" ref={myRef} style={style} />;

let CuteTextBox = (props) => <div><TextBox {...props} style={{color: 'pink'}}/></div>;

CuteTextBox = mixout(proxy('blah-blah!', 'focus', false))(CuteTextBox);

const instance = ReactDOM(<CuteTextBox />, document.getElementById('container'));
instance.focus(); // This won't fail but it won't do anything either.
```

### Common Use Case

Since it's very common to want to forward methods on a deeply nested input element,
we ship a specialized mixout for it. The reference is called `inputRef` and it forwards
`focus`, `blur`, `select`, `setRangeText`, `setSelectionRange` and `click`.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import mixout from 'react-mixout';
import {proxyInput} from 'react-mixout-proxy';

const TextBox = ({inputRef, style}) => <input type="text" ref={inputRef} style={style} />;

let CuteTextBox = (props) => <div><TextBox {...props} style={{color: 'pink'}}/></div>;

CuteTextBox = mixout(proxyInput)(CuteTextBox);

const instance = ReactDOM(<CuteTextBox />, document.getElementById('container'));
instance.focus();
instance.blur();
instance.click();
instance.select();
instance.setRangeText();
instance.setSelectionRange();
```

## API Reference

### proxy

```js
function proxy(refName: string, methods: Array<string | Alias> | string | Alias, failOnNullRef = true): Injector;
```

* `refName`: The name of the reference callback passed down as prop.
* `methods`: The name of the method, an alias object or an array of names and aliases to forward.
* `failOnNullRef`: Determines whether calling methods on unmounted targets should fail.

### alias

This is a simple function that returns an object with `name` and `as` on it. It is only provided
as convenience.

```js
function alias(name: string, as: string): Alias;

interface Alias {
  name: string;
  as: string;
}
```

* `name`: The name of the actual method that is provided by the target of proxy.
* `as`: The name of the method to put on the Mixout component, i.e. the alias.

### proxyInput

```js
const proxyInput: Injector;
```

You can pass this directly to mixout out of box.

## Typings

The typescript type definitions are also available and are installed via npm.

## License
This project is licensed under the [MIT license](https://github.com/alitaheri/react-mixout/blob/master/LICENSE).
