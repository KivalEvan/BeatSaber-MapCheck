import {
   IBeatmapItem,
   ITool,
   IToolOutput,
   ToolArgs,
   ToolInputOrder,
   ToolOutputOrder,
} from '../../types';
import { round } from '../../bsmap/utils/mod';
import swing from '../../bsmap/extensions/swing/swing';
import UIInput from '../../ui/helpers/input';
import { TimeProcessor } from '../../bsmap/beatmap/helpers/timeProcessor';
import { NoteColor } from '../../bsmap/beatmap/shared/constants';
import {
   IObjectContainer,
   IObjectContainerColor,
   ObjectContainerType,
} from '../../types/checks/container';
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
      tool.input.params.maxTime = localBPM.toRealTime(1 / val);
      htmlInputMinTime.value = round(tool.input.params.maxTime * 1000, 1).toString();
      this.value = val.toString();
   },
   ' (prec): ',
   0,
   0,
);

const tool: ITool<{ maxTime: number }> = {
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
   const colorNotes = beatmapItem.data.colorNotes;
   const { maxTime: temp } = tool.input.params;
   const maxTime = timeProcessor.toBeatTime(temp, false) + 0.001;

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

   const result: IWrapColorNote[] = [];
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
