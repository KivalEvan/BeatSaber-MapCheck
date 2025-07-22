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

const name = 'Handclap';
const description =
   'Note pattern that may induce controller clashing during swing, does not capture implicit handclap such as crossover.';
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
      input: CheckInputOrder.NOTES_HANDCLAP,
      output: CheckOutputOrder.NOTES_HANDCLAP,
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
         currentNote.data.customData[PrecalculateKey.SECOND_TIME] < lastTime + 0.01
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
            compareTo.type !== ObjectContainerType.COLOR ||
            currentNote.data.color === compareTo.data.color ||
            currentNote.data.direction === types.NoteDirection.ANY ||
            compareTo.data.direction === types.NoteDirection.ANY
         ) {
            continue;
         }

         if (
            (noteDistance(currentNote.data, compareTo.data) <= 1 &&
               isNotePointing(currentNote.data, compareTo.data, 45) &&
               isNotePointing(compareTo.data, currentNote.data, 45)) ||
            (noteDistance(currentNote.data, compareTo.data) <= 1.5 &&
               isNotePointing(currentNote.data, compareTo.data, 30) &&
               isNotePointing(compareTo.data, currentNote.data, 30)) ||
            (noteDistance(currentNote.data, compareTo.data) <= 2 &&
               isNotePointing(currentNote.data, compareTo.data, 15) &&
               isNotePointing(compareTo.data, currentNote.data, 15)) ||
            (noteDistance(currentNote.data, compareTo.data) <= 1 &&
               !isNotePointing(currentNote.data, compareTo.data, 135 - 0.001) &&
               !isNotePointing(compareTo.data, currentNote.data, 135 - 0.001)) ||
            (noteDistance(currentNote.data, compareTo.data) <= 1.5 &&
               !isNotePointing(currentNote.data, compareTo.data, 160 - 0.001) &&
               !isNotePointing(compareTo.data, currentNote.data, 160 - 0.001))
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
            label: 'Handclap pattern',
            type: OutputType.TIME,
            value: result,
         },
      ];
   }
   return [];
}

export default tool;
