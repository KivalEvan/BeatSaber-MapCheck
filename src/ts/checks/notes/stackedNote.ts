import {
   IBeatmapItem,
   IBeatmapSettings,
   Tool,
   ToolArgs,
   ToolInputOrder,
   ToolOutputOrder,
} from '../../types';
import UIInput from '../../ui/helpers/input';
import { printResultTime } from '../helpers';
import { IWrapGridObject } from '../../bsmap/types/beatmap/wrapper/gridObject';

const name = 'Stacked Note';
const description = 'Look for stacked note.';
const enabled = true;

const tool: Tool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_STACKED_NOTE,
      output: ToolOutputOrder.NOTES_STACKED_NOTE,
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

function checkNote(settings: IBeatmapSettings, map: IBeatmapItem) {
   const { timeProcessor } = settings;
   const { colorNotes } = map.data;

   const ary: IWrapGridObject[] = [];
   // to avoid multiple of stack popping up, ignore anything within this time
   let lastTime: number = 0;
   for (let i = 0, len = colorNotes.length; i < len; i++) {
      if (timeProcessor.toRealTime(colorNotes[i].time) < lastTime + 0.01) {
         continue;
      }
      for (let j = i + 1; j < len; j++) {
         if (
            timeProcessor.toRealTime(colorNotes[j].time) >
            timeProcessor.toRealTime(colorNotes[i].time) + 0.01
         ) {
            break;
         }
         if (colorNotes[j].isInline(colorNotes[i])) {
            ary.push(colorNotes[i]);
            lastTime = timeProcessor.toRealTime(colorNotes[i].time);
         }
      }
   }
   return ary
      .map((n) => n.time)
      .filter(function (x, i, ary) {
         return !i || x !== ary[i - 1];
      });
}

function checkBomb(settings: IBeatmapSettings, map: IBeatmapItem) {
   const { timeProcessor, njs } = settings;
   const { bombNotes } = map.data;

   const ary: IWrapGridObject[] = [];
   for (let i = 0, len = bombNotes.length; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
         // arbitrary break after 1s to not loop too much often
         if (
            timeProcessor.toRealTime(bombNotes[j].time) >
            timeProcessor.toRealTime(bombNotes[i].time) + 1
         ) {
            break;
         }
         if (
            bombNotes[i].isInline(bombNotes[j]) &&
            (njs.value < timeProcessor.bpm / (120 * (bombNotes[j].time - bombNotes[i].time)) ||
               timeProcessor.toRealTime(bombNotes[j].time) <
                  timeProcessor.toRealTime(bombNotes[i].time) + 0.02)
         ) {
            ary.push(bombNotes[i]);
         }
      }
   }
   return ary
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
   const resultNote = checkNote(args.settings, args.beatmap);
   const resultBomb = checkBomb(args.settings, args.beatmap);

   const htmlResult: HTMLElement[] = [];
   if (resultNote.length) {
      htmlResult.push(
         printResultTime('Stacked note', resultNote, args.settings.timeProcessor, 'error'),
      );
   }
   if (resultBomb.length) {
      htmlResult.push(
         printResultTime('Stacked bomb', resultBomb, args.settings.timeProcessor, 'error'),
      );
   }

   if (htmlResult.length) {
      const htmlContainer = document.createElement('div');
      htmlResult.forEach((h) => htmlContainer.append(h));
      tool.output.html = htmlContainer;
   } else {
      tool.output.html = null;
   }
}

export default tool;
