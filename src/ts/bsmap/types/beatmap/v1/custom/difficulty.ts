import type { IBookmark } from '../../v2/custom/bookmark.ts';
import type { IBPMChangeOld } from '../../v2/custom/bpmChange.ts';

/** Difficulty interface for difficulty file. */
export interface ICustomDifficulty {
   _time?: number;
   _BPMChanges?: IBPMChangeOld[];
   _bookmarks?: Omit<IBookmark, '_color'>[];
}
