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
import { ObjectContainerType } from '../../types/container';
import * as types from 'bsmap/types';
import { PrecalculateKey } from '../../types/precalculate';
import { isNotePointing, noteDistance } from '../../utils/beatmap';

const name = 'Hammer Hit';
const description =
   'Bomb placement that is too close to another note path causing risk of hitting the bomb.';
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
      input: CheckInputOrder.NOTES_HAMMER_HIT,
      output: CheckOutputOrder.NOTES_HAMMER_HIT,
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
   let lastIndex: number = 0;
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      const currentNote = noteContainer[i];
      if (
         currentNote.type !== ObjectContainerType.COLOR ||
         currentNote.data.customData[PrecalculateKey.SECOND_TIME] < lastTime + 0.01
      ) {
         continue;
      }
      for (let j = lastIndex; j < len; j++) {
         const compareTo = noteContainer[j];
         if (
            compareTo.data.customData[PrecalculateKey.SECOND_TIME] + 0.125 <
            currentNote.data.customData[PrecalculateKey.SECOND_TIME]
         ) {
            lastIndex = j;
            continue;
         }

         if (
            compareTo.data.customData[PrecalculateKey.SECOND_TIME] >
            currentNote.data.customData[PrecalculateKey.SECOND_TIME] + 0.25
         ) {
            break;
         }

         if (
            compareTo.type !== ObjectContainerType.BOMB ||
            currentNote.data.direction === types.NoteDirection.ANY
         ) {
            continue;
         }

         if (
            (noteDistance(currentNote.data, compareTo.data) <= 2 &&
               isNotePointing(currentNote.data, compareTo.data, 15)) ||
            (noteDistance(currentNote.data, compareTo.data) <= 2 &&
               !isNotePointing(currentNote.data, compareTo.data, 165 - 0.001))
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
            label: 'Hammer hit',
            type: OutputType.TIME,
            value: result,
         },
      ];
   }
   return [];
}

export default tool;
