"use strict";
var chai_1 = require('chai');
var combine_1 = require('./combine');
describe('combine + flatten', function () {
    it('should return empty array if input is not array', function () {
        chai_1.expect(combine_1.flatten({})).to.deep.equal([]);
    });
    it('should act as identity when directly flattening combined array', function () {
        var injectors = [{}, {}];
        chai_1.expect(combine_1.flatten([combine_1.combine.apply(void 0, injectors)])).to.deep.equal(injectors);
    });
    it('should properly flatten a tree of combined injectors', function () {
        var i1 = { i: 1 };
        var i2 = { i: 2 };
        var i3 = { i: 3 };
        var i4 = { i: 4 };
        var i5 = { i: 5 };
        var i6 = { i: 6 };
        var tree = [combine_1.combine(i1, null, combine_1.combine(i2, false, i3, combine_1.combine(i4, combine_1.combine(i5)), i6)), undefined];
        chai_1.expect(combine_1.flatten(tree)).to.deep.equal([i1, i2, i3, i4, i5, i6]);
    });
});
