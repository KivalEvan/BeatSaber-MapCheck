import {
   lowestDifferenceMod,
   NoteColor,
   NoteDirection,
   NoteDirectionAngle,
   NoteDirectionFlip,
   resolveGridDistance,
   TimeProcessor,
   wrapper,
} from 'bsmap';
import { round } from 'bsmap';
import * as swing from 'bsmap/extensions/swing';
import {
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   ICheck,
   ICheckOutput,
   OutputStatus,
   OutputType,
} from '../../types';
import { ObjectContainerType } from '../../types/container';
import { UIInput } from '../../ui/helpers/input';
import { PrecalculateKey } from '../../types/precalculate';

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
      tool.input.params.maxTime = localBPM.toRealTime(val, false);
      htmlInputMaxTime.value = round(tool.input.params.maxTime * 1000, 1).toString();
      this.value = val.toString();
   },
   ' (beat): ',
   0,
   0,
   null,
   0.1,
);
const htmlDistance = UIInput.createNumber(
   function (this: HTMLInputElement) {
      tool.input.params.distance = Math.max(parseInt(this.value), 0);
      this.value = tool.input.params.distance.toString();
   },
   'min distance: ',
   defaultDistance,
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
   htmlDistance[1].value = tool.input.params.distance.toString();
   htmlInputMaxTime.value = (tool.input.params.maxTime * 1000).toString();
   if (timeProcessor) adjustTimeHandler(timeProcessor);
}

const tool: ICheck<{ distance: number; maxTime: number }> = {
   name,
   description,
   type: CheckType.NOTE,
   order: {
      input: CheckInputOrder.NOTES_SHRADO_ANGLE,
      output: CheckOutputOrder.NOTES_SHRADO_ANGLE,
   },
   input: {
      params: { enabled, distance: defaultDistance, maxTime: defaultMaxTime },
      ui: UIInput.createBlock(
         htmlEnabled,
         document.createElement('br'),
         htmlDistance,
         document.createElement('br'),
         htmlLabelMaxTime,
         htmlInputMaxTime,
         htmlLabelMaxBeat,
         htmlInputMaxBeat,
      ),
      update,
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

function check(args: CheckArgs) {
   const { timeProcessor, noteContainer } = args.beatmap;
   const { maxTime, distance } = tool.input.params;

   const lastNote: { [key: number]: wrapper.IWrapColorNote } = {};
   const lastNoteDirection: { [key: number]: [wrapper.IWrapColorNote, number] } = {};
   const startNoteDot: { [key: number]: wrapper.IWrapColorNote | null } = {};
   const swingNoteArray: { [key: number]: wrapper.IWrapColorNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };
   const result: wrapper.IWrapColorNote[] = [];
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      if (noteContainer[i].type !== ObjectContainerType.COLOR) {
         continue;
      }
      const note = noteContainer[i].data as wrapper.IWrapColorNote;
      if (lastNote[note.color]) {
         if (swing.next(note, lastNote[note.color], timeProcessor, swingNoteArray[note.color])) {
            if (startNoteDot[note.color]) {
               startNoteDot[note.color] = null;
               lastNoteDirection[note.color][1] =
                  NoteDirectionFlip[lastNoteDirection[note.color][1] as 0] ?? 8;
            }
            if (
               resolveGridDistance(note, lastNote[note.color]) >= distance &&
               checkShrAngle(note, lastNoteDirection[note.color][0]) &&
               note.customData[PrecalculateKey.SECOND_TIME] -
                  lastNote[note.color].customData[PrecalculateKey.SECOND_TIME] <=
                  maxTime
            ) {
               result.push(note);
            }
            if (note.direction === NoteDirection.ANY) {
               startNoteDot[note.color] = note;
            } else {
               lastNoteDirection[note.color][1] = note.direction;
            }
            swingNoteArray[note.color] = [];
         } else {
            if (
               startNoteDot[note.color] &&
               resolveGridDistance(note, lastNote[note.color]) >= distance &&
               checkShrAngle(note, lastNoteDirection[note.color][0]) &&
               note.customData[PrecalculateKey.SECOND_TIME] -
                  lastNote[note.color].customData[PrecalculateKey.SECOND_TIME] <=
                  maxTime
            ) {
               result.push(startNoteDot[note.color]!);
               startNoteDot[note.color] = null;
            }
            if (note.direction !== NoteDirection.ANY) {
               lastNoteDirection[note.color][1] = note.direction;
            }
         }
      } else {
         lastNoteDirection[note.color][1] = note.direction;
      }
      lastNote[note.color] = note;
      swingNoteArray[note.color].push(note);
   }
   return result;
}

function checkShrAngle(currNote: wrapper.IWrapBaseNote, prevNote: wrapper.IWrapBaseNote) {
   if (currNote.direction === 8 || prevNote.direction === 8) {
      return false;
   }
   if (
      lowestDifferenceMod(
         prevNote.color === NoteColor.RED
            ? NoteDirectionAngle[NoteDirection.DOWN_RIGHT]
            : NoteDirectionAngle[NoteDirection.DOWN_LEFT],
         prevNote.customData[PrecalculateKey.ANGLE] as number,
         360,
      ) < 22.5 &&
      lowestDifferenceMod(0, prevNote.customData[PrecalculateKey.ANGLE] as number, 360) < 11.25
   ) {
      return true;
   }
   return false;
}

function run(args: CheckArgs): ICheckOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            status: OutputStatus.WARNING,
            label: 'Shrado angle',
            type: OutputType.TIME,
            value: result,
         },
      ];
   }
   return [];
}

export default tool;
