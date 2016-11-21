import { expect } from 'chai';
import remix, { Remix } from './remix';

describe('react-mixout: remix', () => {

  it('should fail if no renderer is provided', () => {
    expect(() => remix(null!)).to.throw();
    expect(() => remix(null!, null!)).to.throw();
    expect(() => remix('Blah', null!)).to.throw();
  });

  it('should return an instance of Remix', () => {
    expect(remix(() => null!)).to.be.instanceOf(Remix);
  });

  it('should return an instance of Remix with correct properties', () => {
    const renderer = () => null!;
    const displayName = 'Component';
    const remixed = remix(displayName, renderer);
    expect(remixed.displayName).to.be.equals(displayName);
    expect(remixed.renderer).to.be.equals(renderer);

    const remixed2 = remix(renderer);
    expect(remixed2.displayName).to.be.equals(null);
    expect(remixed2.renderer).to.be.equals(renderer);
  });
});
