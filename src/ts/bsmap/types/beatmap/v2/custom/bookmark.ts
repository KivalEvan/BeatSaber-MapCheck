import type { ColorArray } from '../../../colors.ts';

/** Beatmap difficulty custom data interface for Bookmark. */
export interface IBookmark {
   _time: number;
   _name: string;
   _color?: ColorArray;
}
