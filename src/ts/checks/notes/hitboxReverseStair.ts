import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import {
   INoteContainer,
   INoteContainerColor,
   NoteContainerType,
} from '../../types/checks/container';
import { isIntersect } from '../../bsmap/extensions/placement/note';
import swing from '../../bsmap/extensions/swing/swing';
import UIInput from '../../ui/helpers/input';
import { printResultTime } from '../helpers';
import { NoteColor, NoteDirection } from '../../bsmap/beatmap/shared/constants';
import { IWrapColorNote } from '../../bsmap/types/beatmap/wrapper/colorNote';

const name = 'Hitbox Reverse Staircase';
const description = 'Check for overlapping pre-swing hitbox with note hitbox during swing.';
const enabled = true;

const tool: Tool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_HITBOX_REVERSE_STAIR,
      output: ToolOutputOrder.NOTES_HITBOX_REVERSE_STAIR,
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

const constant = 0.03414823529;
const constantDiagonal = 0.03414823529;
function check(args: ToolArgs) {
   const { timeProcessor, njs } = args.settings;
   const { noteContainer } = args.beatmap!;

   const lastNote: { [key: number]: IWrapColorNote } = {};
   const swingNoteArray: { [key: number]: IWrapColorNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };

   const arr: IWrapColorNote[] = [];
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      if (noteContainer[i].type !== NoteContainerType.COLOR) {
         continue;
      }
      const note = noteContainer[i] as INoteContainerColor;
      if (lastNote[note.data.color]) {
         if (
            swing.next(
               note.data,
               lastNote[note.data.color],
               timeProcessor,
               swingNoteArray[note.data.color],
            )
         ) {
            swingNoteArray[note.data.color] = [];
         }
      }
      for (const other of swingNoteArray[(note.data.color + 1) % 2]) {
         if (other.direction !== NoteDirection.ANY) {
            if (
               !(
                  timeProcessor.toRealTime(note.data.time) >
                  timeProcessor.toRealTime(other.time) + 0.01
               )
            ) {
               continue;
            }
            const isDiagonal = other.getAngle() % 90 > 15 && other.getAngle() % 90 < 75;
            // magic number 1.425 from saber length + good/bad hitbox
            if (
               njs.value <
                  1.425 /
                     ((60 * (note.data.time - other.time)) / timeProcessor.bpm +
                        (isDiagonal ? constantDiagonal : constant)) &&
               isIntersect(note.data, other, [[15, 1.5]])[1]
            ) {
               arr.push(other);
               break;
            }
         }
      }
      lastNote[note.data.color] = note.data;
      swingNoteArray[note.data.color].push(note.data);
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
   const result = check(args);

   if (result.length) {
      tool.output.html = printResultTime(
         'Hitbox reverse Staircase',
         result,
         args.settings.timeProcessor,
         'rank',
      );
   } else {
      tool.output.html = null;
   }
}

export default tool;
