import { NoteColor, NoteDirection } from 'bsmap';
import * as types from 'bsmap/types';
import { swing } from 'bsmap/extensions';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import { ObjectContainerType } from '../../types/checks/container';
import UIInput from '../../ui/helpers/input';

const name = 'Improper Window Snap';
const description = 'Check for slanted window snap timing.';
const enabled = true;

const tool: ITool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_IMPROPER_WINDOW,
      output: ToolOutputOrder.NOTES_IMPROPER_WINDOW,
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

function check(args: ToolArgs) {
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
            note.isSlantedWindow(lastNote[note.color]) &&
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

function run(args: ToolArgs): IToolOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            type: 'time',
            label: 'Improper window snap',
            value: result,
            symbol: 'error',
         },
      ];
   }
   return [];
}

export default tool;
