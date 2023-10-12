import { ISwingContainer } from './types/swing';

export function getMinSliderSpeed(swings: ISwingContainer[]): number {
   return Math.max(...swings.map((s) => s.minSpeed), 0);
}

export function getMaxSliderSpeed(swings: ISwingContainer[]): number {
   const arr = swings.map((s) => s.maxSpeed).filter((n) => n !== 0);
   return arr.length ? Math.min(...arr) : 0;
}
