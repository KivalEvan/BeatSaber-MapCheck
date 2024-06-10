import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import { NoteContainerType } from '../../types/checks/container';
import { isEnd } from '../../bsmap/extensions/placement/note';
import swing from '../../bsmap/extensions/swing/swing';
import { ColorNote } from '../../bsmap/beatmap/core/colorNote';
import UIInput from '../../ui/helpers/input';
import { printResultTime } from '../helpers';
import { NoteColor, NoteDirection, NoteDirectionSpace } from '../../bsmap/beatmap/shared/constants';
import { IWrapColorNote } from '../../bsmap/types/beatmap/wrapper/colorNote';

const name = 'Hitbox Staircase';
const description = 'Check for overlapping post-swing hitbox with note hitbox during swing.';
const enabled = true;

const tool: Tool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_HITBOX_STAIR,
      output: ToolOutputOrder.NOTES_HITBOX_STAIR,
   },
   input: {
      enabled,
      params: {},
      html: UIInput.createBlock(
         UIInput.createCheckbox(
            function (this: HTMLInputElement) {
               tool.input.enabled = this.checked;
            },
            name,
            description,
            enabled,
         ),
      ),
   },
   output: {
      html: null,
   },
   run,
};

function isDouble(note: IWrapColorNote, nc: IWrapColorNote[], index: number): boolean {
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
   const { timeProcessor } = args.settings;
   const notes = args.beatmap!.data.colorNotes;
   const hitboxTime = timeProcessor.toBeatTime(0.15);

   const lastNote: { [key: number]: IWrapColorNote } = {};
   const lastNoteDirection: { [key: number]: number } = {};
   const lastSpeed: { [key: number]: number } = {};
   const swingNoteArray: { [key: number]: IWrapColorNote[] } = {
      [NoteColor.RED]: [],
      [NoteColor.BLUE]: [],
   };
   const noteOccupy: { [key: number]: ColorNote } = {
      [NoteColor.RED]: new ColorNote(),
      [NoteColor.BLUE]: new ColorNote({ color: 1 }),
   };

   // FIXME: use new system
   const arr: IWrapColorNote[] = [];
   for (let i = 0, len = notes.length; i < len; i++) {
      const note = notes[i];
      if (lastNote[note.color]) {
         if (swing.next(note, lastNote[note.color], timeProcessor, swingNoteArray[note.color])) {
            lastSpeed[note.color] = note.time - lastNote[note.color].time;
            if (note.direction !== NoteDirection.ANY) {
               noteOccupy[note.color].posX = note.posX + NoteDirectionSpace[note.direction as 0][0];
               noteOccupy[note.color].posY = note.posY + NoteDirectionSpace[note.direction as 0][1];
            } else {
               noteOccupy[note.color].posX = -1;
               noteOccupy[note.color].posY = -1;
            }
            swingNoteArray[note.color] = [];
            lastNoteDirection[note.color] = note.direction;
         } else if (isEnd(note, lastNote[note.color], lastNoteDirection[note.color])) {
            if (note.direction !== NoteDirection.ANY) {
               noteOccupy[note.color].posX = note.posX + NoteDirectionSpace[note.direction as 0][0];
               noteOccupy[note.color].posY = note.posY + NoteDirectionSpace[note.direction as 0][1];
               lastNoteDirection[note.color] = note.direction;
            } else {
               noteOccupy[note.color].posX =
                  note.posX + NoteDirectionSpace[lastNoteDirection[note.color] as 0][0];
               noteOccupy[note.color].posY =
                  note.posY + NoteDirectionSpace[lastNoteDirection[note.color] as 0][1];
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
               !isDouble(note, args.beatmap!.data.colorNotes, i)
            ) {
               arr.push(note);
            }
         }
      } else {
         if (note.direction !== NoteDirection.ANY) {
            noteOccupy[note.color].posX = note.posX + NoteDirectionSpace[note.direction as 0][0];
            noteOccupy[note.color].posY = note.posY + NoteDirectionSpace[note.direction as 0][1];
         } else {
            noteOccupy[note.color].posX = -1;
            noteOccupy[note.color].posY = -1;
         }
         lastNoteDirection[note.color] = note.direction;
      }
      lastNote[note.color] = note;
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
   const result = check(args);

   if (result.length) {
      tool.output.html = printResultTime(
         'Hitbox staircase',
         result,
         args.settings.timeProcessor,
         'rank',
      );
   } else {
      tool.output.html = null;
   }
}

export default tool;
