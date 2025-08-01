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
import { UIInput } from '../../ui/helpers/input';
import { ObjectContainerType } from '../../types/container';
import * as types from 'bsmap/types';
import { PrecalculateKey } from '../../types/precalculate';
import { isNotePointing, noteDistance } from '../../utils/beatmap';

const name = 'Hitbox Path';
const description = 'Check for overlapping pre-swing note hitbox at same time.';
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
      input: CheckInputOrder.NOTES_HITBOX_PATH,
      output: CheckOutputOrder.NOTES_HITBOX_PATH,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function check(args: CheckArgs) {
   const noteContainer = args.beatmap.noteContainer.filter(
      (n) => n.type === ObjectContainerType.BOMB || n.type === ObjectContainerType.COLOR,
   );

   const result: types.wrapper.IWrapColorNote[] = [];
   // to avoid multiple of stack popping up, ignore anything within this time
   let lastTime: number = 0;
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      const currentNote = noteContainer[i];
      if (
         currentNote.type !== ObjectContainerType.COLOR ||
         currentNote.data.customData[PrecalculateKey.SECOND_TIME] < lastTime + 0.01 ||
         currentNote.data.direction === types.NoteDirection.ANY
      ) {
         continue;
      }
      for (let j = i + 1; j < len; j++) {
         const compareTo = noteContainer[j];
         if (
            compareTo.data.customData[PrecalculateKey.SECOND_TIME] >
            currentNote.data.customData[PrecalculateKey.SECOND_TIME] + 0.01
         ) {
            break;
         }
         if (
            compareTo.type === ObjectContainerType.COLOR &&
            currentNote.data.color === compareTo.data.color
         ) {
            continue;
         }
         if (
            noteDistance(currentNote.data, compareTo.data) <= 2 &&
            (!isNotePointing(currentNote.data, compareTo.data, 150) ||
               !isNotePointing(compareTo.data, currentNote.data, 150))
         ) {
            result.push(currentNote.data);
            lastTime = currentNote.data.customData[PrecalculateKey.SECOND_TIME];
         }
      }
   }
   return result;
}

function run(args: CheckArgs): ICheckOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            status: OutputStatus.ERROR,
            label: 'Hitbox path',
            type: OutputType.TIME,
            value: result,
         },
      ];
   }
   return [];
}

export default tool;
