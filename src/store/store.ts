export enum ActivationState {
  Activated,
  Available
}

export interface IActivationData {
  // eslint-disable-next-line functional/prefer-readonly-type
  activationState: ActivationState;
  // eslint-disable-next-line functional/prefer-readonly-type
  attemptNumber: number;
}

// eslint-disable-next-line functional/no-let, prefer-const
export let store: Record<string, IActivationData> = {};
