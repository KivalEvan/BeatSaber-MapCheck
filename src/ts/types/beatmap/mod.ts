/**
 * Beatmap JSON schema for base game, modded and external.
 *
 * Current model version:
 * ```ts
 * Beatmap V1: 1.5.0
 * Beatmap V2: 2.6.0
 * Beatmap V3: 3.2.0
 * ```
 *
 * Wrapper is used within the library for cross-version compatibility reason.
 *
 * @module
 */

export * from './shared/mod';
export * as external from './external/mod';
export * as v1 from './v1/mod';
export * as v2 from './v2/mod';
export * as v3 from './v3/mod';
export * as wrapper from './wrapper/mod';
