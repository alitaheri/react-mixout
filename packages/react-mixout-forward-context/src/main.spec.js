"use strict";
var React = require('react');
var chai_1 = require('chai');
var main_1 = require('./main');
describe('forwardContext', function () {
    it('should forward value from context to props', function () {
        var injector = main_1["default"]('myProp');
        var passedDownProps = {};
        injector.propInjector(function (name, value) { return passedDownProps[name] = value; }, {}, { myProp: 1 }, null);
        chai_1.expect(passedDownProps['myProp']).to.be.equals(1);
    });
    it('should not forward value from context if context does not have the prop', function () {
        var injector = main_1["default"]('myProp');
        var passedDownProps = {};
        injector.propInjector(function (name, value) { return passedDownProps[name] = value; }, {}, null, null);
        injector.propInjector(function (name, value) { return passedDownProps[name] = value; }, {}, {}, null);
        chai_1.expect(passedDownProps).not.haveOwnPropertyDescriptor('myProp');
    });
    it('should forward value from context to props as aliased', function () {
        var injector = main_1["default"]('myProp', { alias: 'yourProp' });
        var passedDownProps = {};
        injector.propInjector(function (name, value) { return passedDownProps[name] = value; }, {}, { myProp: 1 }, null);
        chai_1.expect(passedDownProps['yourProp']).to.be.equals(1);
    });
    it('should forward mapped value from context to props if mapper is provided', function () {
        var injector = main_1["default"]('myProp', { mapToProp: function (v) { return v * 10; } });
        var passedDownProps = {};
        injector.propInjector(function (name, value) { return passedDownProps[name] = value; }, {}, { myProp: 2 }, null);
        chai_1.expect(passedDownProps['myProp']).to.be.equals(20);
    });
    it('should properly set validator on contextType even if none is provided', function () {
        var injector = main_1["default"]('myProp');
        var contextTypes = {};
        injector.contextTypeInjector(function (name, value) { return contextTypes[name] = value; });
        chai_1.expect(contextTypes['myProp']).to.be.equals(React.PropTypes.any);
    });
    it('should properly override the provided validator on contextType', function () {
        var injector = main_1["default"]('myProp', { validator: React.PropTypes.number });
        var contextTypes = {};
        injector.contextTypeInjector(function (name, value) { return contextTypes[name] = value; });
        chai_1.expect(contextTypes['myProp']).to.be.equals(React.PropTypes.number);
    });
    it('should properly pass down default if no value is available on context', function () {
        var injector = main_1["default"]('myProp', { defaultValue: 2 });
        var passedDownProps = {};
        injector.propInjector(function (name, value) { return passedDownProps[name] = value; }, {}, {}, null);
        chai_1.expect(passedDownProps['myProp']).to.be.equals(2);
    });
    it('should properly generate default if no value is available on context', function () {
        var injector = main_1["default"]('myProp', { defaultGenerator: function (p) { return p.a ? p.a : 4; } });
        var passedDownProps = {};
        injector.propInjector(function (name, value) { return passedDownProps[name] = value; }, { a: 2 }, {}, null);
        chai_1.expect(passedDownProps['myProp']).to.be.equals(2);
        injector.propInjector(function (name, value) { return passedDownProps[name] = value; }, {}, {}, null);
        chai_1.expect(passedDownProps['myProp']).to.be.equals(4);
    });
});
