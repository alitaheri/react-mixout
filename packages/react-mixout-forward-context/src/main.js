"use strict";
var React = require('react');
function forwardContext(name, options) {
    if (options === void 0) { options = {}; }
    var validator = options.validator;
    if (typeof validator !== 'function') {
        validator = React.PropTypes.any;
    }
    var alias = typeof options.alias === 'string' ? options.alias : name;
    var hasDefault = 'defaultValue' in options || 'defaultGenerator' in options;
    var getDefault;
    if (hasDefault) {
        var defaultValue_1 = options.defaultValue;
        getDefault = typeof options.defaultGenerator === 'function'
            ? options.defaultGenerator
            : function () { return defaultValue_1; };
    }
    var mapToPropValue = typeof options.mapToProp === 'function' ? options.mapToProp : function (v) { return v; };
    var contextTypeInjector = function (setContextType) { return setContextType(name, validator); };
    var propInjector = function (setProp, ownProp, ownContext, ownState) {
        if (ownContext && name in ownContext) {
            setProp(alias, mapToPropValue(ownContext[name]));
        }
        else if (hasDefault) {
            setProp(alias, mapToPropValue(getDefault(ownProp)));
        }
    };
    return { contextTypeInjector: contextTypeInjector, propInjector: propInjector };
}
exports.__esModule = true;
exports["default"] = forwardContext;
