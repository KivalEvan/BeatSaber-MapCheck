import { NoteColor, NoteDirection, NoteDirectionAngle, PosX, PosY, types } from 'bsmap';
import {
   IBeatmapItem,
   ITool,
   IToolOutput,
   ToolArgs,
   ToolInputOrder,
   ToolOutputOrder,
} from '../../types';
import { ObjectContainerType } from '../../types/checks/container';
import UIInput from '../../ui/helpers/input';
import { swing, placement } from 'bsmap/extensions';

const name = 'Double-directional';
const description = 'Check double-directional note swing (this may not mean parity break).';
const enabled = true;

const tool: ITool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_DOUBLE_DIRECTIONAL,
      output: ToolOutputOrder.NOTES_DOUBLE_DIRECTIONAL,
   },
   input: {
      enabled,
      params: {},
      html: UIInput.createBlock(
         UIInput.createCheckbox(
            function (this: HTMLInputElement) {
               tool.input.enabled = this.checked;
            },
            name,
            description,
            enabled,
         ),
      ),
   },
   run,
};

function check(beatmapItem: IBeatmapItem) {
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
               lastNoteAngle[note.data.color] = note.data.getAngle();
            }
            swingNoteArray[note.data.color] = [];
         } else {
            if (
               startNoteDot[note.data.color] &&
               placement.checkDirection(note.data, lastNoteAngle[note.data.color], 45, true)
            ) {
               arr.push(note.data);
               startNoteDot[note.data.color] = null;
               lastNoteAngle[note.data.color] = note.data.getAngle();
            }
            if (note.data.direction !== NoteDirection.ANY) {
               startNoteDot[note.data.color] = null;
               lastNoteAngle[note.data.color] = note.data.getAngle();
            }
         }
      } else if (note.type === ObjectContainerType.COLOR) {
         lastNoteAngle[note.data.color] = note.data.getAngle();
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

function run(args: ToolArgs): IToolOutput[] {
   const result = check(args.beatmap);

   if (result.length) {
      return [
         {
            type: 'time',
            label: 'Double-directional',
            value: result,
            symbol: 'warning',
         },
      ];
   }
   return [];
}

export default tool;
