import { ColorArray } from './colors';

/** Beatmap difficulty custom data interface for Bookmark.
 * ```ts
 * _time: float,
 * _name: string,
 * _color: ColorArray
 * ```
 */
export interface Bookmark {
    _time: number;
    _name: string;
    _color?: ColorArray;
}
