import { TimeProcessor, round, NoteColor, NoteDirectionFlip, NoteDirection, types } from 'bsmap';
import { swing } from 'bsmap/extensions';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import {  ObjectContainerType } from '../../types/checks/container';
import UIInput from '../../ui/helpers/input';

const name = 'shrado Angle';
const description = 'Look for common negative curvature pattern.';
const enabled = false;
const defaultMaxTime = 0.15;
const defaultDistance = 1;
let localBPM!: TimeProcessor;

const [htmlLabelMaxTime, htmlInputMaxTime] = UIInput.createNumber(
   function (this: HTMLInputElement) {
      tool.input.params.maxTime = Math.abs(parseFloat(this.value)) / 1000;
      this.value = round(tool.input.params.maxTime * 1000, 1).toString();
      if (localBPM) {
         htmlInputMaxBeat.value = round(
            localBPM.toBeatTime(tool.input.params.maxTime, false),
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
      let val = round(Math.abs(parseFloat(this.value)), 2) || 1;
      tool.input.params.maxTime = localBPM.toRealTime(val);
      htmlInputMaxTime.value = round(tool.input.params.maxTime * 1000, 1).toString();
      this.value = val.toString();
   },
   ' (beat): ',
   0,
   0,
   null,
   0.1,
);

const tool: ITool<{ distance: number; maxTime: number }> = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_SHRADO_ANGLE,
      output: ToolOutputOrder.NOTES_SHRADO_ANGLE,
   },
   input: {
      enabled,
      params: {
         distance: defaultDistance,
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
         UIInput.createNumber(
            function (this: HTMLInputElement) {
               tool.input.params.distance = Math.max(parseInt(this.value), 0);
               this.value = tool.input.params.distance.toString();
            },
            'min distance: ',
            0,
            0,
         ),
         document.createElement('br'),
         htmlLabelMaxTime,
         htmlInputMaxTime,
         htmlLabelMaxBeat,
         htmlInputMaxBeat,
      ),
      adjustTime: adjustTimeHandler,
   },
   run,
};

function adjustTimeHandler(bpm: TimeProcessor) {
   localBPM = bpm;
   htmlInputMaxBeat.value = round(
      localBPM.toBeatTime(tool.input.params.maxTime, false),
      2,
   ).toString();
}

function check(args: ToolArgs) {
   const { timeProcessor, noteContainer } = args.beatmap;
   const { maxTime: temp, distance } = tool.input.params;
   const maxTime = timeProcessor.toBeatTime(temp, false) + 0.001;

   const lastNote: { [key: number]: types.wrapper.IWrapColorNote } = {};
   const lastNoteDirection: { [key: number]: number } = {};
   const startNoteDot: { [key: number]: types.wrapper.IWrapColorNote | null } = {};
   const swingNoteArray: { [key: number]: types.wrapper.IWrapColorNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };
   const result: types.wrapper.IWrapColorNote[] = [];
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      if (noteContainer[i].type !== ObjectContainerType.COLOR) {
         continue;
      }
      const note = noteContainer[i].data as types.wrapper.IWrapColorNote;
      if (lastNote[note.color]) {
         if (swing.next(note, lastNote[note.color], timeProcessor, swingNoteArray[note.color])) {
            // FIXME: maybe fix rotation or something
            if (startNoteDot[note.color]) {
               startNoteDot[note.color] = null;
               lastNoteDirection[note.color] =
                  NoteDirectionFlip[lastNoteDirection[note.color] as 0] ?? 8;
            }
            if (
               note.getDistance(lastNote[note.color]) >= distance &&
               checkShrAngle(note.direction, lastNoteDirection[note.color], note.color) &&
               note.time - lastNote[note.color].time <= maxTime
            ) {
               result.push(note);
            }
            if (note.direction === NoteDirection.ANY) {
               startNoteDot[note.color] = note;
            } else {
               lastNoteDirection[note.color] = note.direction;
            }
            swingNoteArray[note.color] = [];
         } else {
            if (
               startNoteDot[note.color] &&
               note.getDistance(lastNote[note.color]) >= distance &&
               checkShrAngle(note.direction, lastNoteDirection[note.color], note.color) &&
               note.time - lastNote[note.color].time <= maxTime
            ) {
               result.push(startNoteDot[note.color]!);
               startNoteDot[note.color] = null;
            }
            if (note.direction !== NoteDirection.ANY) {
               lastNoteDirection[note.color] = note.direction;
            }
         }
      } else {
         lastNoteDirection[note.color] = note.direction;
      }
      lastNote[note.color] = note;
      swingNoteArray[note.color].push(note);
   }
   return result;
}

function checkShrAngle(currCutDirection: number, prevCutDirection: number, type: number) {
   if (currCutDirection === 8 || prevCutDirection === 8) {
      return false;
   }
   if ((type === 0 ? prevCutDirection === 7 : prevCutDirection === 6) && currCutDirection === 0) {
      return true;
   }
   return false;
}

function run(args: ToolArgs): IToolOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            type: 'time',
            label: 'Shrado angle',
            value: result,
            symbol: 'warning',
         },
      ];
   }
   return [];
}

export default tool;
