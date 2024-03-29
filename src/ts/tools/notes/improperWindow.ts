import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { NoteContainer, NoteContainerNote } from '../../types/beatmap/wrapper/container';
import UIInput from '../../ui/helpers/input';
import swing from '../../analyzers/swing/swing';
import { printResultTime } from '../helpers';
import { NoteColor, NoteDirection } from '../../beatmap/shared/constants';

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

function check(map: ToolArgs) {
   const { bpm } = map.settings;
   const { noteContainer } = map.difficulty!;
   const lastNote: { [key: number]: NoteContainerNote } = {};
   const swingNoteArray: { [key: number]: NoteContainer[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };

   const arr: NoteContainer[] = [];
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      if (noteContainer[i].type !== 'note') {
         continue;
      }
      const note = noteContainer[i] as NoteContainerNote;
      if (lastNote[note.data.color]) {
         if (swing.next(note, lastNote[note.data.color], bpm, swingNoteArray[note.data.color])) {
            lastNote[note.data.color] = note;
            swingNoteArray[note.data.color] = [];
         } else if (
            note.data.isSlantedWindow(lastNote[note.data.color].data) &&
            note.data.time - lastNote[note.data.color].data.time >= 0.001 &&
            note.data.direction === lastNote[note.data.color].data.direction &&
            note.data.direction !== NoteDirection.ANY &&
            lastNote[note.data.color].data.direction !== NoteDirection.ANY
         ) {
            arr.push(lastNote[note.data.color]);
         }
      } else {
         lastNote[note.data.color] = note;
      }
      swingNoteArray[note.data.color].push(note);
   }
   return arr
      .map((n) => n.data.time)
      .filter(function (x, i, ary) {
         return !i || x !== ary[i - 1];
      });
}

function run(map: ToolArgs) {
   if (!map.difficulty) {
      console.error('Something went wrong!');
      return;
   }
   const result = check(map);

   if (result.length) {
      tool.output.html = printResultTime('Improper window snap', result, map.settings.bpm, 'error');
   } else {
      tool.output.html = null;
   }
}

export default tool;
