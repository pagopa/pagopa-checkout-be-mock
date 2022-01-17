export const splitAt: (index: number, x: string) => ReadonlyArray<string> = (
  index: number,
  x: string
) => [x.slice(0, index), x.slice(index)];
