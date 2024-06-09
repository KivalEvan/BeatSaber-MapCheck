import type { ISwingContainer } from './types/swing.ts';

export function getMaxEffectiveBpm(swings: ISwingContainer[]): number {
   return Math.max(...swings.map((s) => s.ebpm), 0);
}

export function getMaxEffectiveBpmSwing(swings: ISwingContainer[]): number {
   return Math.max(...swings.map((s) => s.ebpmSwing), 0);
}
