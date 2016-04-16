"use strict";
var combine_1 = require('./combine');
function decompose(injectors) {
    injectors = combine_1.flatten(injectors);
    var id = 0;
    var ids = [];
    var propTypeInjectors = [];
    var contextTypeInjectors = [];
    var propInjectors = [];
    var initialStateInjectors = [];
    var imperativeMethodInjectors = [];
    var componentWillMountHooks = [];
    var componentWillReceivePropsHooks = [];
    var shouldComponentUpdateHooks = [];
    var componentWillUnmountHooks = [];
    var componentWillUpdateHooks = [];
    var componentDidUpdateHooks = [];
    var componentDidMountHooks = [];
    injectors.forEach(function (injector) {
        id += 1;
        ids.push(id);
        if (injector.propTypeInjector) {
            propTypeInjectors.push(injector.propTypeInjector);
        }
        if (injector.contextTypeInjector) {
            contextTypeInjectors.push(injector.contextTypeInjector);
        }
        if (injector.propInjector) {
            propInjectors.push({ id: id, method: injector.propInjector });
        }
        if (injector.initialStateInjector) {
            initialStateInjectors.push({ id: id, method: injector.initialStateInjector });
        }
        if (injector.imperativeMethodInjector) {
            imperativeMethodInjectors.push({ id: id, method: injector.imperativeMethodInjector });
        }
        if (injector.componentWillMountHook) {
            componentWillMountHooks.push({ id: id, method: injector.componentWillMountHook });
        }
        if (injector.componentDidMountHook) {
            componentDidMountHooks.push({ id: id, method: injector.componentDidMountHook });
        }
        if (injector.componentWillReceivePropsHook) {
            componentWillReceivePropsHooks.push({ id: id, method: injector.componentWillReceivePropsHook });
        }
        if (injector.shouldComponentUpdateHook) {
            shouldComponentUpdateHooks.push(injector.shouldComponentUpdateHook);
        }
        if (injector.componentWillUpdateHook) {
            componentWillUpdateHooks.push({ id: id, method: injector.componentWillUpdateHook });
        }
        if (injector.componentDidUpdateHook) {
            componentDidUpdateHooks.push({ id: id, method: injector.componentDidUpdateHook });
        }
        if (injector.componentWillUnmountHook) {
            componentWillUnmountHooks.push({ id: id, method: injector.componentWillUnmountHook });
        }
    });
    return {
        ids: ids,
        propTypeInjectors: propTypeInjectors,
        contextTypeInjectors: contextTypeInjectors,
        propInjectors: propInjectors,
        initialStateInjectors: initialStateInjectors,
        imperativeMethodInjectors: imperativeMethodInjectors,
        componentWillMountHooks: componentWillMountHooks,
        componentDidMountHooks: componentDidMountHooks,
        componentWillReceivePropsHooks: componentWillReceivePropsHooks,
        shouldComponentUpdateHooks: shouldComponentUpdateHooks,
        componentWillUpdateHooks: componentWillUpdateHooks,
        componentDidUpdateHooks: componentDidUpdateHooks,
        componentWillUnmountHooks: componentWillUnmountHooks
    };
}
exports.decompose = decompose;
