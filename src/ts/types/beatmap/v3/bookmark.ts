import { ColorArray } from '../../colors';

/** Bookmark custom data for difficulty. */
export interface IBookmark {
    _time: number;
    _name: string;
    _color?: ColorArray;
}
