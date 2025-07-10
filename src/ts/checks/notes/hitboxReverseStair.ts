import { NoteColor, NoteDirection, resolveNoteAngle } from 'bsmap';
import * as types from 'bsmap/types';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import { IObjectContainerColor, ObjectContainerType } from '../../types/checks/container';
import { UIInput } from '../../ui/helpers/input';
import { placement, swing } from 'bsmap/extensions';

const name = 'Hitbox Reverse Staircase';
const description = 'Check for overlapping pre-swing hitbox with note hitbox during swing.';
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

const tool: ITool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_HITBOX_REVERSE_STAIR,
      output: ToolOutputOrder.NOTES_HITBOX_REVERSE_STAIR,
   },
   input: {
      params: { enabled },
      html: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

const constant = 0.03414823529;
const constantDiagonal = 0.03414823529;
function check(args: ToolArgs) {
   const { timeProcessor, njs, noteContainer } = args.beatmap;

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
      const note = noteContainer[i] as IObjectContainerColor;
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
                  note.data.customData.__mapcheck_secondtime >
                  other.customData.__mapcheck_secondtime + 0.01
               )
            ) {
               continue;
            }
            const isDiagonal =
               resolveNoteAngle(other.direction) % 90 > 15 &&
               resolveNoteAngle(other.direction) % 90 < 75;
            // magic number 1.425 from saber length + good/bad hitbox
            if (
               njs.value <
                  1.425 /
                     (note.data.customData.__mapcheck_secondtime -
                        other.customData.__mapcheck_secondtime +
                        (isDiagonal ? constantDiagonal : constant)) &&
               placement.isIntersectNote(note.data, other, [[15, 1.5]])[1]
            ) {
               result.push(other);
               break;
            }
         }
      }
      lastNote[note.data.color] = note.data;
      swingNoteArray[note.data.color].push(note.data);
   }
   return result;
}

function run(args: ToolArgs): IToolOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            type: 'time',
            label: 'Hitbox reverse Staircase',
            value: result,
            symbol: 'rank',
         },
      ];
   }
   return [];
}

export default tool;
