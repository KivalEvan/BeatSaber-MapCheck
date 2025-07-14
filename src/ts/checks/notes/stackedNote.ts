import * as types from 'bsmap/types';
import {
   IBeatmapContainer,
   ICheck,
   ICheckOutput,
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   OutputStatus,
   OutputType,
} from '../../types';
import { UIInput } from '../../ui/helpers/input';
import { isInline } from 'bsmap';
import { PrecalculateKey } from '../../types/precalculate';

const name = 'Stacked Note';
const description = 'Look for stacked note.';
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
      input: CheckInputOrder.NOTES_STACKED_NOTE,
      output: CheckOutputOrder.NOTES_STACKED_NOTE,
   },
   input: { params: { enabled }, ui: () => UIInput.createBlock(htmlInput, htmlLabel), update },
   run,
};

function checkNote(map: IBeatmapContainer) {
   const colorNotes = map.data.difficulty.colorNotes;

   const result: types.wrapper.IWrapBaseObject[] = [];
   // to avoid multiple of stack popping up, ignore anything within this time
   let lastTime: number = 0;
   for (let i = 0, len = colorNotes.length; i < len; i++) {
      if (colorNotes[i].customData[PrecalculateKey.SECOND_TIME] < lastTime + 0.01) {
         continue;
      }
      for (let j = i + 1; j < len; j++) {
         if (
            colorNotes[j].customData[PrecalculateKey.SECOND_TIME] >
            colorNotes[i].customData[PrecalculateKey.SECOND_TIME] + 0.01
         ) {
            break;
         }
         if (isInline(colorNotes[j], colorNotes[i])) {
            result.push(colorNotes[i]);
            lastTime = colorNotes[i].customData[PrecalculateKey.SECOND_TIME];
         }
      }
   }
   return result;
}

function checkBomb(map: IBeatmapContainer) {
   const timeProcessor = map.timeProcessor;
   const njs = map.njs;
   const bombNotes = map.data.difficulty.bombNotes;

   const result: types.wrapper.IWrapBaseObject[] = [];
   for (let i = 0, len = bombNotes.length; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
         // arbitrary break after 1s to not loop too much often
         if (
            bombNotes[j].customData[PrecalculateKey.SECOND_TIME] >
            bombNotes[i].customData[PrecalculateKey.SECOND_TIME] + 1
         ) {
            break;
         }
         if (
            isInline(bombNotes[i], bombNotes[j]) &&
            (njs.value <
               (bombNotes[j].customData[PrecalculateKey.SECOND_TIME] -
                  bombNotes[i].customData[PrecalculateKey.SECOND_TIME]) *
                  2 ||
               bombNotes[j].customData[PrecalculateKey.SECOND_TIME] <
                  bombNotes[i].customData[PrecalculateKey.SECOND_TIME] + 0.02)
         ) {
            result.push(bombNotes[i]);
         }
      }
   }
   return result;
}

function run(args: CheckArgs): ICheckOutput[] {
   const resultNote = checkNote(args.beatmap);
   const resultBomb = checkBomb(args.beatmap);

   const results: ICheckOutput[] = [];
   if (resultNote.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Stacked note',
         type: OutputType.TIME,
         value: resultNote,
      });
   }
   if (resultBomb.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Stacked bomb',
         type: OutputType.TIME,
         value: resultBomb,
      });
   }

   return results;
}

export default tool;
