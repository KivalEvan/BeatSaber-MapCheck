import { NoteColor, NoteDirection } from 'bsmap';
import * as types from 'bsmap/types';
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
import { IObjectContainerColor, ObjectContainerType } from '../../types/container';
import { UIInput } from '../../ui/helpers/input';
import { swing } from 'bsmap/extensions';
import { PrecalculateKey } from '../../types/precalculate';
import { isNotePointing, noteDistance } from '../../utils/beatmap';

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

const tool: ICheck = {
   name,
   description,
   type: CheckType.NOTE,
   order: {
      input: CheckInputOrder.NOTES_HITBOX_REVERSE_STAIR,
      output: CheckOutputOrder.NOTES_HITBOX_REVERSE_STAIR,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

const constant = 0.03414823529;
const constantDiagonal = 0.03414823529;
function check(args: CheckArgs) {
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
                  note.data.customData[PrecalculateKey.SECOND_TIME] >
                  other.customData[PrecalculateKey.SECOND_TIME] + 0.01
               )
            ) {
               continue;
            }
            const isDiagonal =
               other.customData[PrecalculateKey.ANGLE] % 90 > 15 &&
               other.customData[PrecalculateKey.ANGLE] % 90 < 75;
            // magic number 1.425 from saber length + good/bad hitbox
            if (
               njs.value <
                  1.425 /
                     (note.data.customData[PrecalculateKey.SECOND_TIME] -
                        other.customData[PrecalculateKey.SECOND_TIME] +
                        (isDiagonal ? constantDiagonal : constant)) &&
               noteDistance(note.data, other) <= 1.5 &&
               isNotePointing(note.data, other, 15)
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

function run(args: CheckArgs): ICheckOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            status: OutputStatus.RANK,
            label: 'Hitbox reverse staircase',
            type: OutputType.TIME,
            value: result,
         },
      ];
   }
   return [];
}

export default tool;
