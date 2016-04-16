"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var injector_1 = require('./injector');
// copied from https://github.com/acdlite/recompose
function isClassComponent(Component) {
    return Boolean(Component && Component.prototype && typeof Component.prototype.isReactComponent === 'object');
}
exports.__esModule = true;
exports["default"] = (function mixout() {
    var injectors = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        injectors[_i - 0] = arguments[_i];
    }
    var _a = injector_1.decompose(injectors), ids = _a.ids, propTypeInjectors = _a.propTypeInjectors, contextTypeInjectors = _a.contextTypeInjectors, propInjectors = _a.propInjectors, initialStateInjectors = _a.initialStateInjectors, imperativeMethodInjectors = _a.imperativeMethodInjectors, componentWillMountHooks = _a.componentWillMountHooks, componentDidMountHooks = _a.componentDidMountHooks, componentWillReceivePropsHooks = _a.componentWillReceivePropsHooks, shouldComponentUpdateHooks = _a.shouldComponentUpdateHooks, componentWillUpdateHooks = _a.componentWillUpdateHooks, componentDidUpdateHooks = _a.componentDidUpdateHooks, componentWillUnmountHooks = _a.componentWillUnmountHooks;
    return function mixoutWrapper(Component) {
        var isClass = isClassComponent(Component);
        var defaultProps = {};
        var propTypes = {};
        function setPropType(name, validator, defaultValue) {
            propTypes[name] = validator;
            if (typeof defaultValue !== 'undefined') {
                defaultProps[name] = defaultValue;
            }
        }
        ;
        propTypeInjectors.forEach(function (propTypeInjector) { return propTypeInjector(setPropType); });
        var contextTypes = {};
        function setContextType(name, validator) {
            contextTypes[name] = validator;
        }
        ;
        contextTypeInjectors.forEach(function (contextTypeInjector) { return contextTypeInjector(setContextType); });
        var Mixout = (function (_super) {
            __extends(Mixout, _super);
            function Mixout(props, context) {
                var _this = this;
                _super.call(this, props, context);
                this.setChild = function (instance) {
                    _this.child = instance;
                };
                var state = {};
                var forceUpdater = function (callback) { return _this.forceUpdate(callback); };
                ids.forEach(function (id) { return state[id] = ({}); });
                initialStateInjectors.forEach(function (initialStateInjector) {
                    initialStateInjector.method(props, context, state[initialStateInjector.id], forceUpdater);
                });
                this.injectorStates = state;
            }
            Mixout.prototype.componentWillMount = function () {
                var ownProps = this.props;
                var ownContext = this.context;
                var states = this.injectorStates;
                var child = this.child;
                componentWillMountHooks.forEach(function (componentWillMountHook) {
                    var ownState = states[componentWillMountHook.id];
                    componentWillMountHook.method(ownProps, ownContext, ownState, child);
                });
            };
            Mixout.prototype.componentDidMount = function () {
                var ownProps = this.props;
                var ownContext = this.context;
                var states = this.injectorStates;
                var child = this.child;
                componentDidMountHooks.forEach(function (componentDidMountHook) {
                    var ownState = states[componentDidMountHook.id];
                    componentDidMountHook.method(ownProps, ownContext, ownState, child);
                });
            };
            Mixout.prototype.componentWillReceiveProps = function (nextProps, nextContext) {
                var ownProps = this.props;
                var ownContext = this.context;
                var states = this.injectorStates;
                var child = this.child;
                componentWillReceivePropsHooks.forEach(function (componentWillReceivePropsHook) {
                    var ownState = states[componentWillReceivePropsHook.id];
                    componentWillReceivePropsHook.method(nextProps, nextContext, ownProps, ownContext, ownState, child);
                });
            };
            Mixout.prototype.shouldComponentUpdate = function (nextProps, nextState, nextContext) {
                var ownProps = this.props;
                var ownContext = this.context;
                if (shouldComponentUpdateHooks.length === 0) {
                    return true;
                }
                var shouldUpdate = false;
                shouldComponentUpdateHooks.forEach(function (shouldComponentUpdateHook) {
                    var result = shouldComponentUpdateHook(nextProps, nextContext, ownProps, ownContext);
                    if (typeof result === 'boolean') {
                        shouldUpdate = shouldUpdate || result;
                    }
                    else {
                        shouldUpdate = true;
                    }
                });
                return shouldUpdate;
            };
            Mixout.prototype.componentWillUpdate = function (nextProps, nextState, nextContext) {
                var ownProps = this.props;
                var ownContext = this.context;
                var states = this.injectorStates;
                var child = this.child;
                componentWillUpdateHooks.forEach(function (componentWillUpdateHook) {
                    var ownState = states[componentWillUpdateHook.id];
                    componentWillUpdateHook.method(nextProps, nextContext, ownProps, ownContext, ownState, child);
                });
            };
            Mixout.prototype.componentDidUpdate = function (prevProps, prevState, prevContext) {
                var ownProps = this.props;
                var ownContext = this.context;
                var states = this.injectorStates;
                var child = this.child;
                componentDidUpdateHooks.forEach(function (componentDidUpdateHook) {
                    var ownState = states[componentDidUpdateHook.id];
                    componentDidUpdateHook.method(prevProps, prevContext, ownProps, ownContext, ownState, child);
                });
            };
            Mixout.prototype.componentWillUnmount = function () {
                var ownProps = this.props;
                var ownContext = this.context;
                var states = this.injectorStates;
                componentWillUnmountHooks.forEach(function (componentWillUnmountHook) {
                    var ownState = states[componentWillUnmountHook.id];
                    componentWillUnmountHook.method(ownProps, ownContext, ownState);
                });
            };
            Mixout.prototype.render = function () {
                // do not let "this" be captured in a closure.
                var ownProps = this.props;
                var ownContext = this.context;
                var states = this.injectorStates;
                var passDownProps = {};
                if (isClass) {
                    passDownProps.ref = this.setChild;
                }
                // pass down own props.
                for (var prop in ownProps) {
                    passDownProps[prop] = ownProps[prop];
                }
                function setProp(name, value) {
                    passDownProps[name] = value;
                }
                ;
                propInjectors.forEach(function (propInjector) {
                    propInjector.method(setProp, ownProps, ownContext, states[propInjector.id]);
                });
                return React.createElement(Component, passDownProps);
            };
            Mixout.propTypes = propTypes;
            Mixout.contextTypes = contextTypes;
            Mixout.defaultProps = defaultProps;
            return Mixout;
        }(React.Component));
        imperativeMethodInjectors.forEach(function (imperativeMethodInjector) {
            var id = imperativeMethodInjector.id;
            function setImperativeMethod(name, implementation) {
                Mixout.prototype['name'] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    var ownProps = this.props;
                    var ownContext = this.context;
                    var ownState = this.injectorStates[id];
                    var child = this.child;
                    return implementation(args, ownProps, ownContext, ownState, child);
                };
            }
            imperativeMethodInjector.method(setImperativeMethod);
        });
        return Mixout;
    };
});
