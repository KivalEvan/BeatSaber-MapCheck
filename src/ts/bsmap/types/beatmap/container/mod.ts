/**
 * Beatmap container interfaces for multiple JSON object output.
 *
 * This is mainly used to handle v4 object as the object are stored in separated arrays.
 *
 * This also means that the implementation has to handle the indexing of the object.
 *
 * @module
 */

export * as v4 from './v4.ts';
export * as v3 from './v3.ts';
