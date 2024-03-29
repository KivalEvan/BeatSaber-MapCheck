import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { round } from '../../utils';
import { NoteContainer } from '../../types/beatmap/wrapper/container';
import { checkDirection } from '../../analyzers/placement/note';
import swing from '../../analyzers/swing/swing';
import { ColorNote } from '../../beatmap/v3/colorNote';
import { printResultTime } from '../helpers';
import UIInput from '../../ui/helpers/input';
import { BeatPerMinute } from '../../beatmap/shared/bpm';
import {
   NoteColor,
   NoteDirection,
   NoteDirectionAngle,
   PosX,
   PosY,
} from '../../beatmap/shared/constants';
import { IWrapColorNote } from '../../types/beatmap/wrapper/colorNote';

const name = 'Inline Sharp Angle';
const description = 'Check for angle changes within inline note.';
const enabled = true;
const defaultMaxTime = 0.15;
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

const tool: Tool<{ maxTime: number }> = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_INLINE_ANGLE,
      output: ToolOutputOrder.NOTES_INLINE_ANGLE,
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
   const noteContainer = map.difficulty!.noteContainer;
   const { maxTime: temp } = tool.input.params;
   const maxTime = bpm.toBeatTime(temp) + 0.001;

   const lastNote: { [key: number]: NoteContainer } = {};
   const lastNoteAngle: { [key: number]: number } = {};
   const startNoteDot: { [key: number]: IWrapColorNote | null } = {};
   const swingNoteArray: { [key: number]: NoteContainer[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };
   const arr: IWrapColorNote[] = [];
   let lastTime = 0;
   let lastIndex = 0;
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      const note = noteContainer[i];
      if (note.type === 'note' && lastNote[note.data.color]) {
         if (swing.next(note, lastNote[note.data.color], bpm, swingNoteArray[note.data.color])) {
            if (startNoteDot[note.data.color]) {
               startNoteDot[note.data.color] = null;
               lastNoteAngle[note.data.color] = (lastNoteAngle[note.data.color] + 180) % 360;
            }
            if (
               checkInline(note.data, noteContainer, lastIndex, maxTime) &&
               checkDirection(note.data, lastNoteAngle[note.data.color], 90, true)
            ) {
               arr.push(note.data);
            }
            if (note.data.direction === NoteDirection.ANY) {
               startNoteDot[note.data.color] = note.data;
            } else {
               lastNoteAngle[note.data.color] = note.data.getAngle();
            }
            swingNoteArray[note.data.color] = [];
         } else {
            if (
               startNoteDot[note.data.color] &&
               checkInline(note.data, noteContainer, lastIndex, maxTime) &&
               checkDirection(note.data, lastNoteAngle[note.data.color], 90, true)
            ) {
               arr.push(startNoteDot[note.data.color] as ColorNote);
               startNoteDot[note.data.color] = null;
            }
            if (note.data.direction !== NoteDirection.ANY) {
               lastNoteAngle[note.data.color] = note.data.getAngle();
            }
         }
      } else if (note.type === 'note') {
         lastNoteAngle[note.data.color] = note.data.getAngle();
      }
      if (note.type === 'note') {
         lastNote[note.data.color] = note;
         swingNoteArray[note.data.color].push(note);
      }
      if (note.type === 'bomb') {
         // on bottom row
         if (note.data.posY === PosY.BOTTOM) {
            //on right center
            if (note.data.posX === PosX.MIDDLE_LEFT) {
               lastNoteAngle[NoteColor.RED] = NoteDirectionAngle[NoteDirection.UP];
               startNoteDot[NoteColor.RED] = null;
            }
            //on left center
            if (note.data.posX === PosX.MIDDLE_RIGHT) {
               lastNoteAngle[NoteColor.BLUE] = NoteDirectionAngle[NoteDirection.UP];
               startNoteDot[NoteColor.BLUE] = null;
            }
            //on top row
         }
         if (note.data.posY === PosY.TOP) {
            //on right center
            if (note.data.posX === PosX.MIDDLE_LEFT) {
               lastNoteAngle[NoteColor.RED] = NoteDirectionAngle[NoteDirection.DOWN];
               startNoteDot[NoteColor.RED] = null;
            }
            //on left center
            if (note.data.posX === PosX.MIDDLE_RIGHT) {
               lastNoteAngle[NoteColor.BLUE] = NoteDirectionAngle[NoteDirection.DOWN];
               startNoteDot[NoteColor.BLUE] = null;
            }
         }
      }
   }
   return arr
      .map((n) => n.time)
      .filter(function (x, i, ary) {
         return !i || x !== ary[i - 1];
      });
}

function checkInline(n: IWrapColorNote, notes: NoteContainer[], index: number, maxTime: number) {
   for (let i = index; notes[i].data.time < n.time; i++) {
      const note = notes[i];
      if (note.type !== 'note') {
         continue;
      }
      if (n.isInline(note.data) && n.time - notes[i].data.time <= maxTime) {
         return true;
      }
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
      tool.output.html = printResultTime('Inline sharp angle', result, map.settings.bpm, 'warning');
   } else {
      tool.output.html = null;
   }
}

export default tool;
