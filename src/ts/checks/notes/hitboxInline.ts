import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import {
   NoteContainerType,
   INoteContainer,
   INoteContainerColor,
} from '../../types/checks/container';
import swing from '../../bsmap/extensions/swing/swing';
import UIInput from '../../ui/helpers/input';
import { printResultTime } from '../helpers';
import { NoteColor } from '../../bsmap/beatmap/shared/constants';
import { IWrapColorNote } from '../../bsmap/types/beatmap/wrapper/colorNote';

const name = 'Hitbox Inline';
const description = 'Check for overlapping note hitbox for inline note.';
const enabled = true;

const tool: Tool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_HITBOX_INLINE,
      output: ToolOutputOrder.NOTES_HITBOX_INLINE,
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

const constant = 0;
function check(args: ToolArgs) {
   const { timeProcessor, njs } = args.settings;
   const { noteContainer } = args.beatmap!;

   const lastNote: { [key: number]: INoteContainerColor } = {};
   const swingNoteArray: { [key: number]: IWrapColorNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };

   const arr: INoteContainer[] = [];
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      if (noteContainer[i].type !== NoteContainerType.COLOR) {
         continue;
      }
      const note = noteContainer[i] as INoteContainerColor;
      if (lastNote[note.data.color]) {
         if (
            swing.next(
               note.data,
               lastNote[note.data.color].data,
               timeProcessor,
               swingNoteArray[note.data.color],
            )
         ) {
            swingNoteArray[note.data.color] = [];
         }
      }
      for (const other of swingNoteArray[(note.data.color + 1) % 2]) {
         // magic number 1.425 from saber length + good/bad hitbox
         if (
            njs.value <
               1.425 / ((60 * (note.data.time - other.time)) / timeProcessor.bpm + constant) &&
            note.data.isInline(other)
         ) {
            arr.push(note);
            break;
         }
      }
      lastNote[note.data.color] = note;
      swingNoteArray[note.data.color].push(note.data);
   }
   return arr
      .map((n) => n.data.time)
      .filter(function (x, i, ary) {
         return !i || x !== ary[i - 1];
      });
}

function run(args: ToolArgs) {
   const result = check(args);

   if (result.length) {
      tool.output.html = printResultTime(
         'Hitbox inline',
         result,
         args.settings.timeProcessor,
         'rank',
      );
   } else {
      tool.output.html = null;
   }
}

export default tool;
