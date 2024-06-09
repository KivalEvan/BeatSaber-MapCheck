import {
   IBeatmapItem,
   IBeatmapSettings,
   Tool,
   ToolArgs,
   ToolInputOrder,
   ToolOutputOrder,
} from '../../types';
import { NoteContainerType } from '../../types/tools/container';
import { checkDirection } from '../../bsmap/extensions/placement/note';
import swing from '../../bsmap/extensions/swing/swing';
import UIInput from '../../ui/helpers/input';
import { printResultTime } from '../helpers';
import {
   NoteColor,
   NoteDirection,
   NoteDirectionAngle,
   PosX,
   PosY,
} from '../../bsmap/beatmap/shared/constants';
import { IWrapColorNote } from '../../bsmap/types/beatmap/wrapper/colorNote';

const name = 'Double-directional';
const description = 'Check double-directional note swing (this may not mean parity break).';
const enabled = true;

const tool: Tool = {
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
   output: {
      html: null,
   },
   run,
};

function check(settings: IBeatmapSettings, difficulty: IBeatmapItem) {
   const { timeProcessor } = settings;
   const noteContainer = difficulty.noteContainer;
   const lastNote: { [key: number]: IWrapColorNote } = {};
   const lastNoteAngle: { [key: number]: number } = {};
   const startNoteDot: { [key: number]: IWrapColorNote | null } = {};
   const swingNoteArray: { [key: number]: IWrapColorNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };

   const arr: IWrapColorNote[] = [];
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      const note = noteContainer[i];
      if (note.type === NoteContainerType.COLOR && lastNote[note.data.color]) {
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
            if (checkDirection(note.data, lastNoteAngle[note.data.color], 45, true)) {
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
               checkDirection(note.data, lastNoteAngle[note.data.color], 45, true)
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
      } else if (note.type === NoteContainerType.COLOR) {
         lastNoteAngle[note.data.color] = note.data.getAngle();
      }
      if (note.type === NoteContainerType.COLOR) {
         lastNote[note.data.color] = note.data;
         swingNoteArray[note.data.color].push(note.data);
      }
      if (note.type === NoteContainerType.BOMB) {
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
   return arr
      .map((n) => n.time)
      .filter(function (x, i, ary) {
         return !i || x !== ary[i - 1];
      });
}

function run(args: ToolArgs) {
   if (!args.beatmap) {
      console.error('Something went wrong!');
      return;
   }
   const result = check(args.settings, args.beatmap);

   if (result.length) {
      tool.output.html = printResultTime(
         'Double-directional',
         result,
         args.settings.timeProcessor,
         'warning',
      );
   } else {
      tool.output.html = null;
   }
}

export default tool;
