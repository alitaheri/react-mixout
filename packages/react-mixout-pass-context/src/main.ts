import { Injector } from 'react-mixout';

export default function passContext(name: string, builder: (ownProps: any) => any): Injector {
  return {
    childContextTypeInjector: setChildContextType => setChildContextType(name, () => null),
    contextInjector: (setContext, ownProps) => setContext(name, builder(ownProps)),
  };
}
