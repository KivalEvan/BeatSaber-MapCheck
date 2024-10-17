import { ColorNote, NoteColor, NoteDirection, NoteDirectionSpace } from 'bsmap';
import * as types from 'bsmap/types';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';
import { placement, swing } from 'bsmap/extensions';

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

const tool: ITool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_HITBOX_STAIR,
      output: ToolOutputOrder.NOTES_HITBOX_STAIR,
   },
   input: {
      params: { enabled },
      html: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function isDouble(
   note: types.wrapper.IWrapColorNote,
   nc: types.wrapper.IWrapColorNote[],
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

function check(args: ToolArgs) {
   const { timeProcessor } = args.beatmap;
   const notes = args.beatmap.data.colorNotes;
   const hitboxTime = timeProcessor.toBeatTime(0.15, false);

   const lastNote: { [key: number]: types.wrapper.IWrapColorNote } = {};
   const lastNoteDirection: { [key: number]: number } = {};
   const lastSpeed: { [key: number]: number } = {};
   const swingNoteArray: { [key: number]: types.wrapper.IWrapColorNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };
   const noteOccupy: { [key: number]: ColorNote } = {
      [NoteColor.RED]: new ColorNote(),
      [NoteColor.BLUE]: new ColorNote({ color: 1 }),
   };

   // FIXME: use new system
   const result: types.wrapper.IWrapColorNote[] = [];
   for (let i = 0, len = notes.length; i < len; i++) {
      const note = notes[i];
      const directionSpace = NoteDirectionSpace[note.direction as 0] || [0, 0];
      if (lastNote[note.color]) {
         if (swing.next(note, lastNote[note.color], timeProcessor, swingNoteArray[note.color])) {
            lastSpeed[note.color] = note.time - lastNote[note.color].time;
            if (note.direction !== NoteDirection.ANY) {
               noteOccupy[note.color].posX = note.posX + directionSpace[0];
               noteOccupy[note.color].posY = note.posY + directionSpace[1];
            } else {
               noteOccupy[note.color].posX = -1;
               noteOccupy[note.color].posY = -1;
            }
            swingNoteArray[note.color] = [];
            lastNoteDirection[note.color] = note.direction;
         } else if (placement.isEnd(note, lastNote[note.color], lastNoteDirection[note.color])) {
            if (note.direction !== NoteDirection.ANY) {
               noteOccupy[note.color].posX = note.posX + directionSpace[0];
               noteOccupy[note.color].posY = note.posY + directionSpace[1];
               lastNoteDirection[note.color] = note.direction;
            } else {
               noteOccupy[note.color].posX =
                  note.posX + (NoteDirectionSpace[lastNoteDirection[note.color] as 0]?.[0] || 0);
               noteOccupy[note.color].posY =
                  note.posY + (NoteDirectionSpace[lastNoteDirection[note.color] as 0]?.[1] || 0);
            }
         }
         if (
            lastNote[(note.color + 1) % 2] &&
            note.time - lastNote[(note.color + 1) % 2].time !== 0 &&
            note.time - lastNote[(note.color + 1) % 2].time <
               Math.min(hitboxTime, lastSpeed[(note.color + 1) % 2])
         ) {
            if (
               note.posX === noteOccupy[(note.color + 1) % 2].posX &&
               note.posY === noteOccupy[(note.color + 1) % 2].posY &&
               !isDouble(note, args.beatmap.data.colorNotes, i)
            ) {
               result.push(note);
            }
         }
      } else {
         if (note.direction !== NoteDirection.ANY) {
            noteOccupy[note.color].posX = note.posX + directionSpace[0];
            noteOccupy[note.color].posY = note.posY + directionSpace[1];
         } else {
            noteOccupy[note.color].posX = -1;
            noteOccupy[note.color].posY = -1;
         }
         lastNoteDirection[note.color] = note.direction;
      }
      lastNote[note.color] = note;
      swingNoteArray[note.color].push(note);
   }
   return result;
}

function run(args: ToolArgs): IToolOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            type: 'time',
            label: 'Hitbox staircase',
            value: result,
            symbol: 'rank',
         },
      ];
   }
   return [];
}

export default tool;
