import { NoteColor, TimeProcessor } from 'bsmap';
import { round } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { swing } from 'bsmap/extensions';
import {
   IBeatmapItem,
   ITool,
   IToolOutput,
   ToolArgs,
   ToolInputOrder,
   ToolOutputOrder,
} from '../../types';
import UIInput from '../../ui/helpers/input';

const name = 'Speed Pause';
const description = 'Look for stream/burst containing timing gap causing sudden change of pace.';
const enabled = false;
const defaultMaxTime = 0.075;
let localBPM!: TimeProcessor;

const [htmlLabelMinTime, htmlInputMinTime] = UIInput.createNumber(
   function (this: HTMLInputElement) {
      tool.input.params.maxTime = Math.abs(parseFloat(this.value)) / 1000;
      this.value = round(tool.input.params.maxTime * 1000, 1).toString();
      if (localBPM) {
         htmlInputMinPrec.value = round(
            1 / localBPM.toBeatTime(tool.input.params.maxTime as number, false),
            2,
         ).toString();
      }
   },
   'stream speed (ms): ',
   round(defaultMaxTime * 1000, 1),
   0,
);
const [htmlLabelMinPrec, htmlInputMinPrec] = UIInput.createNumber(
   function inputPrecHandler(this: HTMLInputElement) {
      if (!localBPM) {
         this.value = '0';
         return;
      }
      let val = round(Math.abs(parseFloat(this.value)), 2) || 1;
      tool.input.params.maxTime = localBPM.toRealTime(1 / val, false);
      htmlInputMinTime.value = round(tool.input.params.maxTime * 1000, 1).toString();
      this.value = val.toString();
   },
   ' (prec): ',
   0,
   0,
);
const htmlEnabled = UIInput.createCheckbox(
   function (this: HTMLInputElement) {
      tool.input.params.enabled = this.checked;
   },
   name,
   description,
   enabled,
);

function update(timeProcessor?: TimeProcessor) {
   htmlEnabled[0].checked = tool.input.params.enabled;
   htmlInputMinTime.value = (tool.input.params.maxTime * 1000).toString();
   if (timeProcessor) adjustTimeHandler(timeProcessor);
}

const tool: ITool<{ maxTime: number }> = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_SPEED_PAUSE,
      output: ToolOutputOrder.NOTES_SPEED_PAUSE,
   },
   input: {
      params: {
         enabled,
         maxTime: defaultMaxTime,
      },
      html: UIInput.createBlock(
         htmlEnabled,
         document.createElement('br'),
         htmlLabelMinTime,
         htmlInputMinTime,
         htmlLabelMinPrec,
         htmlInputMinPrec,
      ),
      update,
      adjustTime: adjustTimeHandler,
   },
   run,
};

function adjustTimeHandler(bpm: TimeProcessor) {
   localBPM = bpm;
   htmlInputMinPrec.value = round(
      1 / localBPM.toBeatTime(tool.input.params.maxTime as number, false),
      2,
   ).toString();
}

function check(beatmapItem: IBeatmapItem) {
   const timeProcessor = beatmapItem.timeProcessor;
   const colorNotes = beatmapItem.data.difficulty.colorNotes;
   const { maxTime: temp } = tool.input.params;
   const maxTime = timeProcessor.toBeatTime(temp, false) + 0.001;

   const lastNote: { [key: number]: types.wrapper.IWrapColorNote } = {};
   const lastNotePause: { [key: number]: types.wrapper.IWrapColorNote } = {};
   const maybePause: { [key: number]: boolean } = {
      [NoteColor.RED]: false,
      [NoteColor.BLUE]: false,
   };
   const swingNoteArray: { [key: number]: types.wrapper.IWrapColorNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };

   const result: types.wrapper.IWrapColorNote[] = [];
   for (let i = 0, len = colorNotes.length; i < len; i++) {
      const note = colorNotes[i];
      if (lastNote[note.color]) {
         if (swing.next(note, lastNote[note.color], timeProcessor, swingNoteArray[note.color])) {
            if (note.time - lastNote[note.color].time <= maxTime * 2) {
               if (
                  maybePause[NoteColor.RED] &&
                  maybePause[NoteColor.BLUE] &&
                  lastNote[note.color].time - lastNotePause[note.color].time <= maxTime * 3
               ) {
                  result.push(lastNote[note.color]);
               }
               maybePause[note.color] = false;
            } else if (!maybePause[note.color]) {
               maybePause[note.color] = true;
               lastNotePause[note.color] = lastNote[note.color];
            }
            swingNoteArray[note.color] = [];
            lastNote[note.color] = note;
         }
      } else {
         lastNote[note.color] = note;
      }
      swingNoteArray[note.color].push(note);
   }
   return result;
}

function run(args: ToolArgs): IToolOutput[] {
   const result = check(args.beatmap);

   if (result.length) {
      return [
         {
            type: 'time',
            label: 'Speed pause',
            value: result,
            symbol: 'warning',
         },
      ];
   }
   return [];
}

export default tool;
