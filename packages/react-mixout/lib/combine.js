"use strict";
function flatten(injectors, flatInjectors) {
    if (flatInjectors === void 0) { flatInjectors = []; }
    if (!Array.isArray(injectors)) {
        return [];
    }
    injectors.forEach(function (injector) {
        if (injector) {
            if (Array.isArray(injector['__combination'])) {
                flatten(injector['__combination'], flatInjectors);
            }
            else if (typeof injector === 'object') {
                flatInjectors.push(injector);
            }
        }
    });
    return flatInjectors;
}
exports.flatten = flatten;
function combine() {
    var injectors = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        injectors[_i - 0] = arguments[_i];
    }
    return { __combination: injectors };
}
exports.combine = combine;
