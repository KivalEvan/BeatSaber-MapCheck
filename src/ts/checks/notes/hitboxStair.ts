import {
   degToRad,
   NoteColor,
   NoteDirection,
   NoteDirectionSpace,
   Vector2,
   vectorDistance,
   wrapper,
} from 'bsmap';
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
import { UIInput } from '../../ui/helpers/input';
import * as placement from 'bsmap/extensions/placement';
import * as swing from 'bsmap/extensions/swing';
import { PrecalculateKey } from '../../types/precalculate';

const name = 'Hitbox Staircase';
const description = 'Check for overlapping post-swing hitbox with note hitbox during swing.';
const enabled = true;

const [htmlInput, htmlLabel] = UIInput.createCheckbox(
   function (this: HTMLInputElement) {
      tool.input.params.enabled = this.checked;
   },
   name,
   description,
   enabled,
);

function update() {
   htmlInput.checked = tool.input.params.enabled;
}

const tool: ICheck = {
   name,
   description,
   type: CheckType.NOTE,
   order: {
      input: CheckInputOrder.NOTES_HITBOX_STAIR,
      output: CheckOutputOrder.NOTES_HITBOX_STAIR,
   },
   input: {
      params: { enabled },
      ui: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function isDouble(
   note: wrapper.IWrapColorNote,
   nc: wrapper.IWrapColorNote[],
   index: number,
): boolean {
   for (let i = index, len = nc.length; i < len; i++) {
      if (nc[i].time < note.time + 0.01 && nc[i].color !== note.color) {
         return true;
      }
      if (nc[i].time > note.time + 0.01) {
         return false;
      }
   }
   return false;
}

function check(args: CheckArgs) {
   const { timeProcessor } = args.beatmap;
   const notes = args.beatmap.data.difficulty.colorNotes;
   const hitboxTime = 0.15;

   const lastNote: { [key: number]: wrapper.IWrapColorNote } = {};
   const lastNoteDirection: { [key: number]: number } = {};
   const lastSpeed: { [key: number]: number } = {};
   const swingNoteArray: { [key: number]: wrapper.IWrapColorNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };
   const noteOccupiedSpace: { [key: number]: Vector2 } = {
      [NoteColor.RED]: [-999, -999],
      [NoteColor.BLUE]: [-999, -999],
   };

   const result: wrapper.IWrapColorNote[] = [];
   for (let i = 0, len = notes.length; i < len; i++) {
      const note = notes[i];
      const occupiedSpace = getOccupiedSpace(note);
      if (lastNote[note.color]) {
         if (swing.next(note, lastNote[note.color], timeProcessor, swingNoteArray[note.color])) {
            lastSpeed[note.color] =
               note.customData[PrecalculateKey.SECOND_TIME] -
               lastNote[note.color].customData[PrecalculateKey.SECOND_TIME];
            if (note.direction !== NoteDirection.ANY) {
               noteOccupiedSpace[note.color][0] =
                  note.customData[PrecalculateKey.POSITION][0] + occupiedSpace[0];
               noteOccupiedSpace[note.color][1] =
                  note.customData[PrecalculateKey.POSITION][1] + occupiedSpace[1];
            } else {
               noteOccupiedSpace[note.color][0] = -999;
               noteOccupiedSpace[note.color][1] = -999;
            }
            swingNoteArray[note.color] = [];
            lastNoteDirection[note.color] = note.direction;
         } else if (
            placement.isEndNote(note, lastNote[note.color], lastNoteDirection[note.color])
         ) {
            if (note.direction !== NoteDirection.ANY) {
               noteOccupiedSpace[note.color][0] =
                  note.customData[PrecalculateKey.POSITION][0] + occupiedSpace[0];
               noteOccupiedSpace[note.color][1] =
                  note.customData[PrecalculateKey.POSITION][1] + occupiedSpace[1];
               lastNoteDirection[note.color] = note.direction;
            } else {
               noteOccupiedSpace[note.color][0] =
                  note.customData[PrecalculateKey.POSITION][0] +
                  (NoteDirectionSpace[lastNoteDirection[note.color] as 0]?.[0] || 0);
               noteOccupiedSpace[note.color][1] =
                  note.customData[PrecalculateKey.POSITION][1] +
                  (NoteDirectionSpace[lastNoteDirection[note.color] as 0]?.[1] || 0);
            }
         }
         if (
            lastNote[(note.color + 1) % 2] &&
            note.customData[PrecalculateKey.SECOND_TIME] -
               lastNote[(note.color + 1) % 2].customData[PrecalculateKey.SECOND_TIME] !==
               0 &&
            note.customData[PrecalculateKey.SECOND_TIME] -
               lastNote[(note.color + 1) % 2].customData[PrecalculateKey.SECOND_TIME] <
               Math.min(hitboxTime, lastSpeed[(note.color + 1) % 2])
         ) {
            if (
               vectorDistance(
                  note.customData[PrecalculateKey.POSITION],
                  noteOccupiedSpace[(note.color + 1) % 2],
               ) < 0.5 &&
               !isDouble(note, args.beatmap.data.difficulty.colorNotes, i)
            ) {
               result.push(note);
            }
         }
      } else {
         if (note.direction !== NoteDirection.ANY) {
            noteOccupiedSpace[note.color][0] =
               note.customData[PrecalculateKey.POSITION][0] + occupiedSpace[0];
            noteOccupiedSpace[note.color][1] =
               note.customData[PrecalculateKey.POSITION][1] + occupiedSpace[1];
         } else {
            noteOccupiedSpace[note.color][0] = -999;
            noteOccupiedSpace[note.color][1] = -999;
         }
         lastNoteDirection[note.color] = note.direction;
      }
      lastNote[note.color] = note;
      swingNoteArray[note.color].push(note);
   }
   return result;
}

function run(args: CheckArgs): ICheckOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            status: OutputStatus.RANK,
            label: 'Hitbox staircase',
            type: OutputType.TIME,
            value: result,
         },
      ];
   }
   return [];
}

export default tool;

function getOccupiedSpace(note: wrapper.IWrapColorNote): Vector2 {
   const angle = note.customData[PrecalculateKey.ANGLE] as number;
   return [-Math.cos(degToRad(angle - 90)), -Math.sin(degToRad(angle - 90))];
}
