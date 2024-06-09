import type { IWrapBaseNote, IWrapBaseNoteAttribute } from './baseNote.ts';
import type { ICustomDataNote } from './custom/note.ts';

export interface IWrapColorNoteAttribute extends IWrapBaseNoteAttribute {
   /** Angle offset in degree counter-clockwise `<int>` of note.*/
   angleOffset: number;
   customData: ICustomDataNote;
}

export interface IWrapColorNote extends Omit<IWrapBaseNote, 'customData'>, IWrapColorNoteAttribute {
   setCustomData(object: this['customData']): this;
   addCustomData(object: this['customData']): this;

   setAngleOffset(value: number): this;
}
