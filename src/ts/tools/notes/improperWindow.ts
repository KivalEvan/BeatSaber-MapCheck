import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import { NoteContainerType } from '../../types/tools/container';
import UIInput from '../../ui/helpers/input';
import swing from '../../bsmap/extensions/swing/swing';
import { printResultTime } from '../helpers';
import { NoteColor, NoteDirection } from '../../bsmap/beatmap/shared/constants';
import { IWrapColorNote } from '../../bsmap/types/beatmap/wrapper/colorNote';

const name = 'Improper Window Snap';
const description = 'Check for slanted window snap timing.';
const enabled = true;

const tool: Tool = {
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
   output: {
      html: null,
   },
   run,
};

function check(args: ToolArgs) {
   const { timeProcessor } = args.settings;
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
      const note = noteContainer[i].data as IWrapColorNote;
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
            arr.push(lastNote[note.color]);
         }
      } else {
         lastNote[note.color] = note;
      }
      swingNoteArray[note.color].push(note);
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
         'Improper window snap',
         result,
         args.settings.timeProcessor,
         'error',
      );
   } else {
      tool.output.html = null;
   }
}

export default tool;
