import { isInline, NoteColor } from 'bsmap';
import * as types from 'bsmap/types';
import { swing } from 'bsmap/extensions';
import {
   ICheck,
   ICheckOutput,
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   OutputType,
   OutputStatus,
} from '../../types';
import { UIInput } from '../../ui/helpers/input';

const name = 'Hitbox Inline';
const description = 'Check for overlapping note hitbox for inline note.';
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
      input: CheckInputOrder.NOTES_HITBOX_INLINE,
      output: CheckOutputOrder.NOTES_HITBOX_INLINE,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

const constant = 0;
function check(args: CheckArgs) {
   const { timeProcessor, njs } = args.beatmap;

   const lastNote: { [key: number]: types.wrapper.IWrapColorNote } = {};
   const swingNoteArray: { [key: number]: types.wrapper.IWrapColorNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };

   const arr: types.wrapper.IWrapColorNote[] = [];
   for (let i = 0, len = args.beatmap.data.difficulty.colorNotes.length; i < len; i++) {
      const note = args.beatmap.data.difficulty.colorNotes[i];
      if (lastNote[note.color]) {
         if (swing.next(note, lastNote[note.color], timeProcessor, swingNoteArray[note.color])) {
            swingNoteArray[note.color] = [];
         }
      }
      for (const other of swingNoteArray[(note.color + 1) % 2]) {
         // magic number 1.425 from saber length + good/bad hitbox
         // i wished i remembered what this was
         if (
            njs.value <
               1.425 /
                  (note.customData.__mapcheck_secondtime -
                     other.customData.__mapcheck_secondtime +
                     constant) &&
            isInline(note, other)
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

function run(args: CheckArgs): ICheckOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            status: OutputStatus.RANK,
            label: 'Hitbox inline',
            type: OutputType.TIME,
            value: result,
         },
      ];
   }
   return [];
}

export default tool;
