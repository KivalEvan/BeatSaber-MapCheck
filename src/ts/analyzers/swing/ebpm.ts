import { ISwingContainer } from './types/swing';

export function getMaxEffectiveBPM(swings: ISwingContainer[]): number {
    return Math.max(...swings.map((s) => s.ebpm), 0);
}

export function getMaxEffectiveBPMSwing(swings: ISwingContainer[]): number {
    return Math.max(...swings.map((s) => s.ebpmSwing), 0);
}
