import {
   IBeatmapItem,
   IBeatmapSettings,
   Tool,
   ToolArgs,
   ToolInputOrder,
   ToolOutputOrder,
} from '../../types/mapcheck';
import { round } from '../../utils';
import { NoteContainer, NoteContainerNote } from '../../types/beatmap/wrapper/container';
import swing from '../../analyzers/swing/swing';
import { printResultTime } from '../helpers';
import UIInput from '../../ui/helpers/input';
import { BeatPerMinute } from '../../beatmap/shared/bpm';
import { NoteColor } from '../../beatmap/shared/constants';

const name = 'Speed Pause';
const description = 'Look for stream/burst containing timing gap causing sudden change of pace.';
const enabled = false;
const defaultMaxTime = 0.075;
let localBPM!: BeatPerMinute;

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

function adjustTimeHandler(bpm: BeatPerMinute) {
   localBPM = bpm;
   htmlInputMinPrec.value = round(
      1 / localBPM.toBeatTime(tool.input.params.maxTime as number),
      2,
   ).toString();
}

function check(settings: IBeatmapSettings, difficulty: IBeatmapItem) {
   const { bpm } = settings;
   const { noteContainer } = difficulty;
   const { maxTime: temp } = <{ maxTime: number }>tool.input.params;
   const maxTime = bpm.toBeatTime(temp) + 0.001;

   const lastNote: { [key: number]: NoteContainer } = {};
   const lastNotePause: { [key: number]: NoteContainer } = {};
   const maybePause: { [key: number]: boolean } = {
      [NoteColor.RED]: false,
      [NoteColor.BLUE]: false,
   };
   const swingNoteArray: { [key: number]: NoteContainer[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };

   const arr: NoteContainer[] = [];
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      if (noteContainer[i].type !== 'note') {
         continue;
      }
      const note = noteContainer[i] as NoteContainerNote;
      if (lastNote[note.data.color]) {
         if (swing.next(note, lastNote[note.data.color], bpm, swingNoteArray[note.data.color])) {
            if (note.data.time - lastNote[note.data.color].data.time <= maxTime * 2) {
               if (
                  maybePause[NoteColor.RED] &&
                  maybePause[NoteColor.BLUE] &&
                  lastNote[note.data.color].data.time - lastNotePause[note.data.color].data.time <=
                     maxTime * 3
               ) {
                  arr.push(lastNote[note.data.color]);
               }
               maybePause[note.data.color] = false;
            } else if (!maybePause[note.data.color]) {
               maybePause[note.data.color] = true;
               lastNotePause[note.data.color] = lastNote[note.data.color];
            }
            swingNoteArray[note.data.color] = [];
            lastNote[note.data.color] = note;
         }
      } else {
         lastNote[note.data.color] = note;
      }
      swingNoteArray[note.data.color].push(note);
   }
   return arr
      .map((n) => n.data.time)
      .filter(function (x, i, ary) {
         return !i || x !== ary[i - 1];
      });
}

function run(map: ToolArgs) {
   if (!map.difficulty) {
      console.error('Something went wrong!');
      return;
   }
   const result = check(map.settings, map.difficulty);

   if (result.length) {
      tool.output.html = printResultTime('Speed pause', result, map.settings.bpm, 'warning');
   } else {
      tool.output.html = null;
   }
}

export default tool;
