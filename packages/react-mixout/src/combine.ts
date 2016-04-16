import {Injector} from './injector';

export function flatten(injectors: Injector[], flatInjectors: Injector[] = []): Injector[] {
  if (!Array.isArray(injectors)) {
    return [];
  }

  injectors.forEach(injector => {
    if (injector) {
      if (Array.isArray(injector['__combination'])) {
        flatten(injector['__combination'], flatInjectors);
      } else if (typeof injector === 'object') {
        flatInjectors.push(injector);
      }
    }
  });

  return flatInjectors;
}

export function combine(...injectors: Injector[]): Injector {
  return { __combination: injectors } as any;
}
