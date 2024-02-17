import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { NoteContainer, NoteContainerNote } from '../../types/beatmap/wrapper/container';
import { isIntersect } from '../../analyzers/placement/note';
import swing from '../../analyzers/swing/swing';
import UIInput from '../../ui/helpers/input';
import { printResultTime } from '../helpers';
import { NoteColor, NoteDirection } from '../../beatmap/shared/constants';

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
function check(map: ToolArgs) {
   const { bpm, njs } = map.settings;
   const { noteContainer } = map.difficulty!;

   const lastNote: { [key: number]: NoteContainer } = {};
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
            swingNoteArray[note.data.color] = [];
         }
      }
      for (const other of swingNoteArray[(note.data.color + 1) % 2]) {
         if (other.type !== 'note') {
            continue;
         }
         if (other.data.direction !== NoteDirection.ANY) {
            if (!(bpm.toRealTime(note.data.time) > bpm.toRealTime(other.data.time) + 0.01)) {
               continue;
            }
            const isDiagonal = other.data.getAngle() % 90 > 15 && other.data.getAngle() % 90 < 75;
            // magic number 1.425 from saber length + good/bad hitbox
            if (
               njs.value <
                  1.425 /
                     ((60 * (note.data.time - other.data.time)) / bpm.value +
                        (isDiagonal ? constantDiagonal : constant)) &&
               isIntersect(note.data, other.data, [[15, 1.5]])[1]
            ) {
               arr.push(other);
               break;
            }
         }
      }
      lastNote[note.data.color] = note;
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
      tool.output.html = printResultTime(
         'Hitbox reverse Staircase',
         result,
         map.settings.bpm,
         'rank',
      );
   } else {
      tool.output.html = null;
   }
}

export default tool;
