import type { ICustomDataNote as ICustomDataNoteV2 } from '../../v2/custom/note.ts';
import type { ICustomDataNote as ICustomDataNoteV3 } from '../../v3/custom/note.ts';

export type ICustomDataNote = ICustomDataNoteV3 & ICustomDataNoteV2;
