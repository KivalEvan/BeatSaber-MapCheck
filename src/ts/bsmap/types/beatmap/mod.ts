/**
 * Beatmap JSON schema for base game, modded and external.
 *
 * Current model version:
 * ```ts
 * Beatmap V1: 1.5.0
 * Beatmap V2: 2.6.0
 * Beatmap V3: 3.3.0
 * Beatmap V4: 4.0.0
 * ```
 *
 * Wrapper is used within the library for cross-version compatibility reason.
 *
 * @module
 */

export * from './shared/mod.ts';
export * as external from './external/mod.ts';
export * as v1 from './v1/mod.ts';
export * as v2 from './v2/mod.ts';
export * as v3 from './v3/mod.ts';
export * as v4 from './v4/mod.ts';
export * as wrapper from './wrapper/mod.ts';
export * as container from './container/mod.ts';
