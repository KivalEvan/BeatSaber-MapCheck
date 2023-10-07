import { IBookmark } from '../../v2/custom/bookmark';
import { IBPMChangeOld } from '../../v2/custom/bpmChange';

/** Difficulty interface for difficulty file. */
export interface ICustomDifficulty {
   _time?: number;
   _BPMChanges?: Omit<IBPMChangeOld, '_BPM'>[];
   _bookmarks?: Omit<IBookmark, '_color'>[];
}
