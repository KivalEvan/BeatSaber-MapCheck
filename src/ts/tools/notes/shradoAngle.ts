import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { round } from '../../utils';
import { NoteContainer, NoteContainerNote } from '../../types/beatmap/wrapper/container';
import swing from '../../analyzers/swing/swing';
import { printResultTime } from '../helpers';
import UIInput from '../../ui/helpers/input';
import { BeatPerMinute } from '../../beatmap/shared/bpm';
import { NoteColor, NoteDirection, NoteDirectionFlip } from '../../beatmap/shared/constants';

const name = 'shrado Angle';
const description = 'Look for common negative curvature pattern.';
const enabled = false;
const defaultMaxTime = 0.15;
const defaultDistance = 1;
let localBPM!: BeatPerMinute;

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

const tool: Tool<{ distance: number; maxTime: number }> = {
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
   output: {
      html: null,
   },
   run,
};

function adjustTimeHandler(bpm: BeatPerMinute) {
   localBPM = bpm;
   htmlInputMaxBeat.value = round(localBPM.toBeatTime(tool.input.params.maxTime), 2).toString();
}

function check(map: ToolArgs) {
   const { bpm } = map.settings;
   const { noteContainer } = map.difficulty!;
   const { maxTime: temp, distance } = tool.input.params;
   const maxTime = bpm.toBeatTime(temp) + 0.001;

   const lastNote: { [key: number]: NoteContainer } = {};
   const lastNoteDirection: { [key: number]: number } = {};
   const startNoteDot: { [key: number]: NoteContainer | null } = {};
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
            // FIXME: maybe fix rotation or something
            if (startNoteDot[note.data.color]) {
               startNoteDot[note.data.color] = null;
               lastNoteDirection[note.data.color] =
                  NoteDirectionFlip[lastNoteDirection[note.data.color] as 0] ?? 8;
            }
            if (
               note.data.getDistance(lastNote[note.data.color].data) >= distance &&
               checkShrAngle(
                  note.data.direction,
                  lastNoteDirection[note.data.color],
                  note.data.color,
               ) &&
               note.data.time - lastNote[note.data.color].data.time <= maxTime
            ) {
               arr.push(note);
            }
            if (note.data.direction === NoteDirection.ANY) {
               startNoteDot[note.data.color] = note;
            } else {
               lastNoteDirection[note.data.color] = note.data.direction;
            }
            swingNoteArray[note.data.color] = [];
         } else {
            if (
               startNoteDot[note.data.color] &&
               note.data.getDistance(lastNote[note.data.color].data) >= distance &&
               checkShrAngle(
                  note.data.direction,
                  lastNoteDirection[note.data.color],
                  note.data.color,
               ) &&
               note.data.time - lastNote[note.data.color].data.time <= maxTime
            ) {
               arr.push(startNoteDot[note.data.color]!);
               startNoteDot[note.data.color] = null;
            }
            if (note.data.direction !== NoteDirection.ANY) {
               lastNoteDirection[note.data.color] = note.data.direction;
            }
         }
      } else {
         lastNoteDirection[note.data.color] = note.data.direction;
      }
      lastNote[note.data.color] = note;
      swingNoteArray[note.data.color].push(note);
   }
   return arr
      .map((n) => n.data.time)
      .filter(function (x, i, ary) {
         return !i || x !== ary[i - 1];
      });
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

function run(map: ToolArgs) {
   if (!map.difficulty) {
      console.error('Something went wrong!');
      return;
   }
   const result = check(map);

   if (result.length) {
      tool.output.html = printResultTime('Shrado angle', result, map.settings.bpm, 'warning');
   } else {
      tool.output.html = null;
   }
}

export default tool;
