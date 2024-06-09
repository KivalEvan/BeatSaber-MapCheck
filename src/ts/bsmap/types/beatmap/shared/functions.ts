import type { Vector2 } from '../../vector.ts';

export type MirrorFn<T> = (object: T) => T;
export type GetAngleFn<T> = (object: T) => number | null | undefined;
export type GetPositionFn<T> = (object: T) => Vector2 | null | undefined;
