import { expect } from 'chai';
import { combine, flatten } from './combine';

describe('react-mixout: combine + flatten', () => {

  it('should return empty array if input is not array', () => {
    expect(flatten({} as any)).to.deep.equal([]);
  });

  it('should act as identity when directly flattening combined array', () => {
    const injectors = [{}, {}];
    expect(flatten([combine(...injectors)])).to.deep.equal(injectors);
  });

  it('should properly flatten a tree of combined injectors', () => {
    const i1 = { i: 1 };
    const i2 = { i: 2 };
    const i3 = { i: 3 };
    const i4 = { i: 4 };
    const i5 = { i: 5 };
    const i6 = { i: 6 };
    const tree = [
      combine(i1, null!, combine(i2, false, i3, combine(i4, combine(i5)), i6)),
      undefined!,
    ];
    expect(flatten(tree)).to.deep.equal([i1, i2, i3, i4, i5, i6]);
  });

});
