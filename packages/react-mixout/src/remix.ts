export interface RemixRenderer {
  (props: any): JSX.Element | null;
}

export class Remix<R extends RemixRenderer> {
  public displayName: string | null;
  public renderer: R;

  constructor(renderer: R, displayName: string | null = null) {
    this.displayName = displayName;
    this.renderer = renderer;
  }
}

export default function remix<R extends RemixRenderer>(displayName: string, renderer: R): Remix<R>;
export default function remix<R extends RemixRenderer>(renderer: R): Remix<R>;
export default function remix<R extends RemixRenderer>(displayName: string | R, renderer?: R): Remix<R> {
  if (typeof displayName === 'function') {
    return new Remix<R>(displayName, (<any>displayName).name || 'AnonymousRemix');
  }
  if (typeof renderer === 'function') {
    return new Remix<R>(renderer, <string>displayName || (<any>renderer).name || 'AnonymousRemix');
  }

  throw new TypeError('No renderer was provided.');
}
