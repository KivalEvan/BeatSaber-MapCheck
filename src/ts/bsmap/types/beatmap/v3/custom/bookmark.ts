import type { ColorArray } from '../../../colors.ts';

/** Bookmark custom data for difficulty. */
export interface IBookmark {
   b: number;
   n: string;
   c?: ColorArray;
}
