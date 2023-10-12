import { ColorArray } from '../../../colors';

/** Beatmap difficulty custom data interface for Bookmark. */
export interface IBookmark {
   _time: number;
   _name: string;
   _color?: ColorArray;
}
