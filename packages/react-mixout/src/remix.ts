export interface RemixRenderer<P> {
  (props: P): JSX.Element;
}

export class Remix<P> {
  public displayName: string;
  public renderer: RemixRenderer<P>;

  constructor(renderer: RemixRenderer<P>, displayName: string = null) {
    this.displayName = displayName;
    this.renderer = renderer;
  }
}

export default function remix<P>(displayName: string, renderer: RemixRenderer<P>): Remix<P>;
export default function remix<P>(renderer: RemixRenderer<P>): Remix<P>;
export default function remix<P>(displayName: string | RemixRenderer<P>, renderer?: RemixRenderer<P>): Remix<P> {
  if (typeof displayName === 'function') {
    return new Remix<P>(displayName);
  }
  if (typeof renderer === 'function') {
    return new Remix<P>(renderer, <string>displayName);
  }

  throw new TypeError('No renderer was provided.');
}
