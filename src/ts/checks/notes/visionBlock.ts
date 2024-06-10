import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import { round } from '../../bsmap/utils/mod';
import { INoteContainer, NoteContainerType } from '../../types/checks/container';
import { printResultTime } from '../helpers';
import UIInput from '../../ui/helpers/input';
import { TimeProcessor } from '../../bsmap/beatmap/helpers/timeProcessor';
import { PosX, PosY } from '../../bsmap/beatmap/shared/constants';

const name = 'Vision Block';
const description = 'Check for vision block caused by center note.';
const enabled = true;
const defaultMinTime = 0.1;
const defaultMaxTime = 0.5;

let localBPM!: TimeProcessor;

const vbDiff: { [key: string]: { min: number; max: number } } = {
   Easy: {
      min: 0.025,
      max: 1.2,
   },
   Normal: {
      min: 0.05,
      max: 1,
   },
   Hard: {
      min: 0.08,
      max: 0.75,
   },
   Expert: {
      min: 0.1,
      max: 0.625,
   },
   ExpertPlus: {
      min: 0.1,
      max: 0.5,
   },
};

const [htmlLabelTimeCheck, htmlInputTimeCheck] = UIInput.createRadio(
   inputSpecCheckHandler,
   ' VB time specific ',
   'vb-spec',
   'time',
   false,
);
const [htmlLabelDiffCheck, htmlInputDiffCheck] = UIInput.createRadio(
   inputSpecCheckHandler,
   ' VB difficulty specific ',
   'vb-spec',
   'difficulty',
   true,
);
const [htmlLabelMinTime, htmlInputMinTime] = UIInput.createNumber(
   function (this: HTMLInputElement) {
      tool.input.params.minTime = Math.abs(parseFloat(this.value)) / 1000;
      this.value = round(tool.input.params.minTime * 1000, 1).toString();
      if (localBPM) {
         htmlInputMinBeat.value = round(
            localBPM.toBeatTime(tool.input.params.minTime),
            2,
         ).toString();
         if (tool.input.params.minTime > tool.input.params.maxTime) {
            tool.input.params.maxTime = tool.input.params.minTime;
            htmlInputMaxTime.value = round(tool.input.params.maxTime * 1000, 1).toString();
            htmlInputMaxBeat.value = round(
               localBPM.toBeatTime(tool.input.params.maxTime),
               2,
            ).toString();
         }
      }
   },
   'min time (ms): ',
   round(defaultMinTime * 1000, 1),
   0,
);
const [htmlLabelMinBeat, htmlInputMinBeat] = UIInput.createNumber(
   function (this: HTMLInputElement) {
      if (!localBPM) {
         this.value = '0';
         return;
      }
      const val = Math.abs(parseFloat(this.value)) || 1;
      tool.input.params.minTime = localBPM.toRealTime(val);
      htmlInputMinTime.value = round(tool.input.params.minTime * 1000, 1).toString();
      this.value = round(val, 2).toString();
      if (tool.input.params.minTime > tool.input.params.maxTime) {
         tool.input.params.maxTime = tool.input.params.minTime;
         htmlInputMaxTime.value = round(tool.input.params.maxTime * 1000, 1).toString();
         htmlInputMaxBeat.value = round(
            localBPM.toBeatTime(tool.input.params.maxTime),
            2,
         ).toString();
      }
   },
   ' (beat): ',
   0,
   0,
   null,
   0.1,
);
const [htmlLabelMaxTime, htmlInputMaxTime] = UIInput.createNumber(
   function (this: HTMLInputElement) {
      tool.input.params.maxTime = Math.abs(parseFloat(this.value)) / 1000;
      this.value = round(tool.input.params.maxTime * 1000, 1).toString();
      if (localBPM) {
         htmlInputMaxBeat.value = round(
            localBPM.toBeatTime(tool.input.params.maxTime),
            2,
         ).toString();
      }
   },
   'max time (ms): ',
   round(defaultMaxTime * 1000, 1),
   0,
);
const [htmlLabelMaxBeat, htmlInputMaxBeat] = UIInput.createNumber(
   function (this: HTMLInputElement) {
      if (!localBPM) {
         this.value = '0';
         return;
      }
      const val = Math.abs(parseFloat(this.value)) || 1;
      tool.input.params.maxTime = localBPM.toRealTime(val);
      htmlInputMaxTime.value = round(tool.input.params.maxTime * 1000, 1).toString();
      this.value = round(val, 2).toString();
   },
   ' (beat): ',
   0,
   0,
   null,
   0.1,
);

const tool: Tool<{ specific: 'difficulty' | 'time'; minTime: number; maxTime: number }> = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_VISION_BLOCK,
      output: ToolOutputOrder.NOTES_VISION_BLOCK,
   },
   input: {
      enabled,
      params: {
         specific: 'difficulty',
         minTime: defaultMinTime,
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
         htmlInputTimeCheck,
         htmlLabelTimeCheck,
         htmlInputDiffCheck,
         htmlLabelDiffCheck,
         document.createElement('br'),
         htmlLabelMinTime,
         htmlInputMinTime,
         htmlLabelMinBeat,
         htmlInputMinBeat,
         document.createElement('br'),
         htmlLabelMaxTime,
         htmlInputMaxTime,
         htmlLabelMaxBeat,
         htmlInputMaxBeat,
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
   htmlInputMinBeat.value = round(localBPM.toBeatTime(tool.input.params.minTime), 2).toString();
   htmlInputMaxBeat.value = round(localBPM.toBeatTime(tool.input.params.maxTime), 2).toString();
}

function inputSpecCheckHandler(this: HTMLInputElement) {
   // FIXME: check for string
   tool.input.params.specific = this.value as 'difficulty' | 'time';
}

function check(args: ToolArgs) {
   const { timeProcessor, njs } = args.settings;
   const noteContainer = args.beatmap!.noteContainer.filter(
      (n) => n.type !== NoteContainerType.ARC,
   );
   const { minTime: temp1, maxTime: temp2, specific: vbSpecific } = tool.input.params;
   const minTime =
      vbSpecific === 'time'
         ? timeProcessor.toBeatTime(temp1)
         : timeProcessor.toBeatTime(vbDiff[args.beatmap!.settings.difficulty].min);
   const maxTime =
      vbSpecific === 'time'
         ? timeProcessor.toBeatTime(temp2)
         : Math.min(
              njs.hjd,
              timeProcessor.toBeatTime(vbDiff[args.beatmap!.settings.difficulty].max),
           );

   let lastMidL: INoteContainer | null = null;
   let lastMidR: INoteContainer | null = null;
   const arr: INoteContainer[] = [];
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      const note = noteContainer[i];
      if (lastMidL) {
         if (
            note.data.time - lastMidL.data.time >= minTime &&
            note.data.time - lastMidL.data.time <= maxTime
         ) {
            if (note.data.posX < PosX.MIDDLE_RIGHT) {
               arr.push(note);
            }
         } // yeet the last note if nothing else found so we dont have to perform check every note
         else if (note.data.time - lastMidL.data.time > maxTime) {
            lastMidL = null;
         }
      }
      if (lastMidR) {
         if (
            note.data.time - lastMidR.data.time >= minTime &&
            note.data.time - lastMidR.data.time <= maxTime
         ) {
            if (note.data.posX > PosX.MIDDLE_LEFT) {
               arr.push(note);
            }
         } else if (note.data.time - lastMidR.data.time > maxTime) {
            lastMidR = null;
         }
      }
      if (note.data.posY === PosY.MIDDLE && note.data.posX === PosX.MIDDLE_LEFT) {
         lastMidL = note;
      }
      if (note.data.posY === PosY.MIDDLE && note.data.posX === PosX.MIDDLE_RIGHT) {
         lastMidR = note;
      }
   }
   return arr
      .map((n) => n.data.time)
      .filter(function (x, i, ary) {
         return !i || x !== ary[i - 1];
      });
}

function run(args: ToolArgs) {
   if (!args.beatmap) {
      console.error('Something went wrong!');
      return;
   }
   const result = check(args);

   if (result.length) {
      tool.output.html = printResultTime(
         'Vision block',
         result,
         args.settings.timeProcessor,
         'warning',
      );
   } else {
      tool.output.html = null;
   }
}

export default tool;
