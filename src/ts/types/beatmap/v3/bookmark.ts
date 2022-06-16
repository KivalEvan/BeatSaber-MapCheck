import { ColorArray } from '../../colors';

/** Bookmark custom data for difficulty. */
export interface IBookmark {
    beat: number;
    name: string;
    color?: ColorArray;
}
