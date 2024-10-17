import * as types from 'bsmap/types';
import {
   IBeatmapItem,
   ITool,
   IToolOutput,
   ToolArgs,
   ToolInputOrder,
   ToolOutputOrder,
} from '../../types';
import UIInput from '../../ui/helpers/input';

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

const tool: ITool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_STACKED_NOTE,
      output: ToolOutputOrder.NOTES_STACKED_NOTE,
   },
   input: {
      params: { enabled },
      html: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function checkNote(map: IBeatmapItem) {
   const colorNotes = map.data.colorNotes;

   const result: types.wrapper.IWrapBaseObject[] = [];
   // to avoid multiple of stack popping up, ignore anything within this time
   let lastTime: number = 0;
   for (let i = 0, len = colorNotes.length; i < len; i++) {
      if (colorNotes[i].customData.__mapcheck_secondtime < lastTime + 0.01) {
         continue;
      }
      for (let j = i + 1; j < len; j++) {
         if (
            colorNotes[j].customData.__mapcheck_secondtime >
            colorNotes[i].customData.__mapcheck_secondtime + 0.01
         ) {
            break;
         }
         if (colorNotes[j].isInline(colorNotes[i])) {
            result.push(colorNotes[i]);
            lastTime = colorNotes[i].customData.__mapcheck_secondtime;
         }
      }
   }
   return result;
}

function checkBomb(map: IBeatmapItem) {
   const timeProcessor = map.timeProcessor;
   const njs = map.njs;
   const bombNotes = map.data.bombNotes;

   const result: types.wrapper.IWrapBaseObject[] = [];
   for (let i = 0, len = bombNotes.length; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
         // arbitrary break after 1s to not loop too much often
         if (
            bombNotes[j].customData.__mapcheck_secondtime >
            bombNotes[i].customData.__mapcheck_secondtime + 1
         ) {
            break;
         }
         if (
            bombNotes[i].isInline(bombNotes[j]) &&
            (njs.value < timeProcessor.bpm / (120 * (bombNotes[j].time - bombNotes[i].time)) ||
               bombNotes[j].customData.__mapcheck_secondtime <
                  bombNotes[i].customData.__mapcheck_secondtime + 0.02)
         ) {
            result.push(bombNotes[i]);
         }
      }
   }
   return result;
}

function run(args: ToolArgs): IToolOutput[] {
   const resultNote = checkNote(args.beatmap);
   const resultBomb = checkBomb(args.beatmap);

   const results: IToolOutput[] = [];
   if (resultNote.length) {
      results.push({
         type: 'time',
         label: 'Stacked note',
         value: resultNote,
         symbol: 'error',
      });
   }
   if (resultBomb.length) {
      results.push({
         type: 'time',
         label: 'Stacked bomb',
         value: resultBomb,
         symbol: 'error',
      });
   }

   return results;
}

export default tool;
