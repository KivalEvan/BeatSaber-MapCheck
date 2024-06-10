import {
   IBeatmapItem,
   IBeatmapSettings,
   Tool,
   ToolArgs,
   ToolInputOrder,
   ToolOutputOrder,
} from '../../types';
import { round } from '../../bsmap/utils/mod';
import swing from '../../bsmap/extensions/swing/swing';
import { printResultTime } from '../helpers';
import UIInput from '../../ui/helpers/input';
import { TimeProcessor } from '../../bsmap/beatmap/helpers/timeProcessor';
import { NoteColor } from '../../bsmap/beatmap/shared/constants';
import { NoteContainerType } from '../../types/checks/container';
import { IWrapColorNote } from '../../bsmap/types/beatmap/wrapper/colorNote';

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
            1 / localBPM.toBeatTime(tool.input.params.maxTime as number),
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
      tool.input.params.maxTime = localBPM.toRealTime(1 / val);
      htmlInputMinTime.value = round(tool.input.params.maxTime * 1000, 1).toString();
      this.value = val.toString();
   },
   ' (prec): ',
   0,
   0,
);

const tool: Tool<{ maxTime: number }> = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_SPEED_PAUSE,
      output: ToolOutputOrder.NOTES_SPEED_PAUSE,
   },
   input: {
      enabled,
      params: {
         maxTime: defaultMaxTime,
      },
      html: UIInput.createBlock(
         UIInput.createCheckbox(
            function (this: HTMLInputElement) {
               tool.input.enabled = this.checked;
            },
            name,
            description,
            enabled,
         ),
         document.createElement('br'),
         htmlLabelMinTime,
         htmlInputMinTime,
         htmlLabelMinPrec,
         htmlInputMinPrec,
      ),
      adjustTime: adjustTimeHandler,
   },
   output: {
      html: null,
   },
   run,
};

function adjustTimeHandler(bpm: TimeProcessor) {
   localBPM = bpm;
   htmlInputMinPrec.value = round(
      1 / localBPM.toBeatTime(tool.input.params.maxTime as number),
      2,
   ).toString();
}

function check(settings: IBeatmapSettings, difficulty: IBeatmapItem) {
   const { timeProcessor } = settings;
   const { noteContainer } = difficulty;
   const { maxTime: temp } = <{ maxTime: number }>tool.input.params;
   const maxTime = timeProcessor.toBeatTime(temp) + 0.001;

   const lastNote: { [key: number]: IWrapColorNote } = {};
   const lastNotePause: { [key: number]: IWrapColorNote } = {};
   const maybePause: { [key: number]: boolean } = {
      [NoteColor.RED]: false,
      [NoteColor.BLUE]: false,
   };
   const swingNoteArray: { [key: number]: IWrapColorNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };

   const arr: IWrapColorNote[] = [];
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      if (noteContainer[i].type !== NoteContainerType.COLOR) {
         continue;
      }
      const note = noteContainer[i].data as IWrapColorNote;
      if (lastNote[note.color]) {
         if (swing.next(note, lastNote[note.color], timeProcessor, swingNoteArray[note.color])) {
            if (note.time - lastNote[note.color].time <= maxTime * 2) {
               if (
                  maybePause[NoteColor.RED] &&
                  maybePause[NoteColor.BLUE] &&
                  lastNote[note.color].time - lastNotePause[note.color].time <= maxTime * 3
               ) {
                  arr.push(lastNote[note.color]);
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
   return arr
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
   const result = check(args.settings, args.beatmap);

   if (result.length) {
      tool.output.html = printResultTime(
         'Speed pause',
         result,
         args.settings.timeProcessor,
         'warning',
      );
   } else {
      tool.output.html = null;
   }
}

export default tool;
