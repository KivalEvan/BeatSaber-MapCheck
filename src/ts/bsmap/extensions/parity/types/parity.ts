export type ParityState = 'forehand' | 'backhand' | 'neutral';
export type ParityStatus = 'error' | 'warning' | 'none';
export enum ParitySwitch {
   'forehand' = 'backhand',
   'backhand' = 'forehand',
}
