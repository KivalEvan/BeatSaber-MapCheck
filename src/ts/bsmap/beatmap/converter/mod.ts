/**
 * Beatmap conversion module.
 *
 * The convertor will not perform copy operations on the beatmap data.
 * If you are handling or referencing any beatmap data elsewhere,
 * it is recommended to clone before passing over to conversion function.
 *
 * While the beatmap wrapper in the module is version agnostic,
 * the underlying data such as custom data are still required to be converted to respective version.
 *
 * @module
 */

export * from './lightGradient.ts';
export * from './oldChroma.ts';
export * from './toV1/mod.ts';
export * from './toV2/mod.ts';
export * from './toV3/mod.ts';
export * from './toV4/mod.ts';
