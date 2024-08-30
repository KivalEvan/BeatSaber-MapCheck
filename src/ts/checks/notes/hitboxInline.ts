import { NoteColor } from 'bsmap';
import * as types from 'bsmap/types';
import { swing } from 'bsmap/extensions';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';

const name = 'Hitbox Inline';
const description = 'Check for overlapping note hitbox for inline note.';
const enabled = true;

const tool: ITool = {
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
   run,
};

const constant = 0;
function check(args: ToolArgs) {
   const { timeProcessor, njs } = args.beatmap;

   const lastNote: { [key: number]: types.wrapper.IWrapColorNote } = {};
   const swingNoteArray: { [key: number]: types.wrapper.IWrapColorNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };

   const arr: types.wrapper.IWrapColorNote[] = [];
   for (let i = 0, len = args.beatmap.data.colorNotes.length; i < len; i++) {
      const note = args.beatmap.data.colorNotes[i];
      if (lastNote[note.color]) {
         if (swing.next(note, lastNote[note.color], timeProcessor, swingNoteArray[note.color])) {
            swingNoteArray[note.color] = [];
         }
      }
      for (const other of swingNoteArray[(note.color + 1) % 2]) {
         // magic number 1.425 from saber length + good/bad hitbox
         if (
            njs.value < 1.425 / ((60 * (note.time - other.time)) / timeProcessor.bpm + constant) &&
            note.isInline(other)
         ) {
            arr.push(note);
            break;
         }
      }
      lastNote[note.color] = note;
      swingNoteArray[note.color].push(note);
   }
   return arr;
}

function run(args: ToolArgs): IToolOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            type: 'time',
            label: 'Hitbox inline',
            value: result,
            symbol: 'rank',
         },
      ];
   }
   return [];
}

export default tool;
