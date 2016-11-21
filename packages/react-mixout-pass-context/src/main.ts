import * as React from 'react';
import { Injector } from 'react-mixout';

export default function passContext(name: string, builder: (ownProps: any) => any): Injector {
  return {
    childContextTypeInjector: setChildContextType => setChildContextType(name, React.PropTypes.any),
    contextInjector: (setContext, ownProps) => setContext(name, builder(ownProps)),
  };
}
