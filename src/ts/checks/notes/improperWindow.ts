import { isSlantedWindow, NoteColor, NoteDirection } from 'bsmap';
import * as types from 'bsmap/types';
import { swing } from 'bsmap/extensions';
import {
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   ICheck,
   ICheckOutput,
   OutputStatus,
   OutputType,
} from '../../types';
import { ObjectContainerType } from '../../types/container';
import { UIInput } from '../../ui/helpers/input';

const name = 'Improper Window Snap';
const description = 'Check for slanted window snap timing.';
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
      input: CheckInputOrder.NOTES_IMPROPER_WINDOW,
      output: CheckOutputOrder.NOTES_IMPROPER_WINDOW,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function check(args: CheckArgs) {
   const { timeProcessor, noteContainer } = args.beatmap;
   const lastNote: { [key: number]: types.wrapper.IWrapColorNote } = {};
   const swingNoteArray: { [key: number]: types.wrapper.IWrapColorNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };

   const result: types.wrapper.IWrapColorNote[] = [];
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      if (noteContainer[i].type !== ObjectContainerType.COLOR) {
         continue;
      }
      const note = noteContainer[i].data as types.wrapper.IWrapColorNote;
      if (lastNote[note.color]) {
         if (swing.next(note, lastNote[note.color], timeProcessor, swingNoteArray[note.color])) {
            lastNote[note.color] = note;
            swingNoteArray[note.color] = [];
         } else if (
            isSlantedWindow(note, lastNote[note.color]) &&
            note.time - lastNote[note.color].time >= 0.001 &&
            note.direction === lastNote[note.color].direction &&
            note.direction !== NoteDirection.ANY &&
            lastNote[note.color].direction !== NoteDirection.ANY
         ) {
            result.push(lastNote[note.color]);
         }
      } else {
         lastNote[note.color] = note;
      }
      swingNoteArray[note.color].push(note);
   }
   return result;
}

function run(args: CheckArgs): ICheckOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            status: OutputStatus.ERROR,
            label: 'Improper window snap',
            type: OutputType.TIME,
            value: result,
         },
      ];
   }
   return [];
}

export default tool;
