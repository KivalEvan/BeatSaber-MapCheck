import type { IWrapBaseNote, IWrapBaseNoteAttribute } from './baseNote.ts';
import type { ICustomDataNote } from './custom/note.ts';

export interface IWrapBombNoteAttribute extends IWrapBaseNoteAttribute {
   customData: ICustomDataNote;
}

export interface IWrapBombNote extends Omit<IWrapBaseNote, 'customData'>, IWrapBombNoteAttribute {
   setCustomData(object: this['customData']): this;
   addCustomData(object: this['customData']): this;
}
