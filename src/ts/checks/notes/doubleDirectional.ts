import { NoteColor, NoteDirection, NoteDirectionAngle, PosX, PosY } from 'bsmap';
import * as types from 'bsmap/types';
import {
   IBeatmapContainer,
   ICheck,
   ICheckOutput,
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   OutputStatus,
   OutputType,
} from '../../types';
import { ObjectContainerType } from '../../types/container';
import { UIInput } from '../../ui/helpers/input';
import { placement, swing } from 'bsmap/extensions';
import { PrecalculateKey } from '../../types/precalculate';

const name = 'Double-directional';
const description = 'Check double-directional note swing (this may not mean parity break).';
const enabled = true;

const [htmlInput, htmlLabel] = UIInput.createCheckbox(
   function (this: HTMLInputElement) {
      tool.input.params.enabled = this.checked;
   },
   name,
   description,
   enabled,
);

function update() {
   htmlInput.checked = tool.input.params.enabled;
}

const tool: ICheck = {
   name,
   description,
   type: CheckType.NOTE,
   order: {
      input: CheckInputOrder.NOTES_DOUBLE_DIRECTIONAL,
      output: CheckOutputOrder.NOTES_DOUBLE_DIRECTIONAL,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function check(beatmapItem: IBeatmapContainer) {
   const timeProcessor = beatmapItem.timeProcessor;
   const noteContainer = beatmapItem.noteContainer;
   const lastNote: { [key: number]: types.wrapper.IWrapColorNote } = {};
   const lastNoteAngle: { [key: number]: number } = {};
   const startNoteDot: { [key: number]: types.wrapper.IWrapColorNote | null } = {};
   const swingNoteArray: { [key: number]: types.wrapper.IWrapColorNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };

   const arr: types.wrapper.IWrapColorNote[] = [];
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      const note = noteContainer[i];
      if (note.type === ObjectContainerType.COLOR && lastNote[note.data.color]) {
         if (
            swing.next(
               note.data,
               lastNote[note.data.color],
               timeProcessor,
               swingNoteArray[note.data.color],
            )
         ) {
            if (startNoteDot[note.data.color]) {
               startNoteDot[note.data.color] = null;
               lastNoteAngle[note.data.color] = (lastNoteAngle[note.data.color] + 180) % 360;
            }
            if (placement.checkDirection(note.data, lastNoteAngle[note.data.color], 45, true)) {
               arr.push(note.data);
            }
            if (note.data.direction === NoteDirection.ANY) {
               startNoteDot[note.data.color] = note.data;
            } else {
               lastNoteAngle[note.data.color] = note.data.customData[PrecalculateKey.ANGLE];
            }
            swingNoteArray[note.data.color] = [];
         } else {
            if (
               startNoteDot[note.data.color] &&
               placement.checkDirection(note.data, lastNoteAngle[note.data.color], 45, true)
            ) {
               arr.push(note.data);
               startNoteDot[note.data.color] = null;
               lastNoteAngle[note.data.color] = note.data.customData[PrecalculateKey.ANGLE];
            }
            if (note.data.direction !== NoteDirection.ANY) {
               startNoteDot[note.data.color] = null;
               lastNoteAngle[note.data.color] = note.data.customData[PrecalculateKey.ANGLE];
            }
         }
      } else if (note.type === ObjectContainerType.COLOR) {
         lastNoteAngle[note.data.color] = note.data.customData[PrecalculateKey.ANGLE];
      }
      if (note.type === ObjectContainerType.COLOR) {
         lastNote[note.data.color] = note.data;
         swingNoteArray[note.data.color].push(note.data);
      }
      if (note.type === ObjectContainerType.BOMB) {
         // on bottom row
         if (note.data.posY === PosY.BOTTOM) {
            //on right center
            if (note.data.posX === PosX.MIDDLE_LEFT) {
               lastNoteAngle[NoteColor.RED] = NoteDirectionAngle[NoteDirection.UP];
               startNoteDot[NoteColor.RED] = null;
            }
            //on left center
            if (note.data.posX === PosX.MIDDLE_RIGHT) {
               lastNoteAngle[NoteColor.BLUE] = NoteDirectionAngle[NoteDirection.UP];
               startNoteDot[NoteColor.BLUE] = null;
            }
            //on top row
         }
         if (note.data.posY === PosY.TOP) {
            //on right center
            if (note.data.posX === PosX.MIDDLE_LEFT) {
               lastNoteAngle[NoteColor.RED] = NoteDirectionAngle[NoteDirection.DOWN];
               startNoteDot[NoteColor.RED] = null;
            }
            //on left center
            if (note.data.posX === PosX.MIDDLE_RIGHT) {
               lastNoteAngle[NoteColor.BLUE] = NoteDirectionAngle[NoteDirection.DOWN];
               startNoteDot[NoteColor.BLUE] = null;
            }
         }
      }
   }
   return arr;
}

function run(args: CheckArgs): ICheckOutput[] {
   const result = check(args.beatmap);

   if (result.length) {
      return [
         {
            status: OutputStatus.WARNING,
            label: 'Double-directional',
            type: OutputType.TIME,
            value: result,
         },
      ];
   }
   return [];
}

export default tool;
