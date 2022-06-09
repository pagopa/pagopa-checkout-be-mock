export enum ActivationState {
  Activated,
  Available
}

// eslint-disable-next-line functional/no-let, prefer-const
export let store: Record<string, ActivationState> = {};
