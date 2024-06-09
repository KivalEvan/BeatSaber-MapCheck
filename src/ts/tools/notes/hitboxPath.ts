import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import { isIntersect } from '../../bsmap/extensions/placement/note';
import UIInput from '../../ui/helpers/input';
import { printResultTime } from '../helpers';
import { IWrapColorNote } from '../../bsmap/types/beatmap/wrapper/colorNote';
import { NoteContainerType } from '../../types/tools/container';

const name = 'Hitbox Path';
const description = 'Check for overlapping pre-swing note hitbox at same time.';
const enabled = true;

const tool: Tool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_HITBOX_PATH,
      output: ToolOutputOrder.NOTES_HITBOX_PATH,
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

function check(args: ToolArgs) {
   const { timeProcessor } = args.settings;
   const noteContainer = args.beatmap!.noteContainer.filter(
      (n) => n.type === NoteContainerType.BOMB || n.type === NoteContainerType.COLOR,
   );

   const arr: IWrapColorNote[] = [];
   // to avoid multiple of stack popping up, ignore anything within this time
   let lastTime: number = 0;
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      const currentNote = noteContainer[i];
      if (
         currentNote.type === NoteContainerType.BOMB ||
         currentNote.type === NoteContainerType.ARC ||
         currentNote.type === NoteContainerType.CHAIN ||
         timeProcessor.toRealTime(currentNote.data.time) < lastTime + 0.01
      ) {
         continue;
      }
      for (let j = i + 1; j < len; j++) {
         const compareTo = noteContainer[j];
         if (
            timeProcessor.toRealTime(compareTo.data.time) >
            timeProcessor.toRealTime(currentNote.data.time) + 0.01
         ) {
            break;
         }
         if (
            compareTo.type === NoteContainerType.COLOR &&
            currentNote.data.color === compareTo.data.color
         ) {
            continue;
         }
         if (
            ((currentNote.data.isHorizontal(compareTo.data) ||
               currentNote.data.isVertical(compareTo.data)) &&
               isIntersect(currentNote.data, compareTo.data, [
                  [45, 1],
                  [15, 2],
               ]).some((b) => b)) ||
            (currentNote.data.isDiagonal(compareTo.data) &&
               isIntersect(currentNote.data, compareTo.data, [
                  [45, 1],
                  [15, 1.5],
               ]).some((b) => b))
         ) {
            arr.push(currentNote.data);
            lastTime = timeProcessor.toRealTime(currentNote.data.time);
         }
      }
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
         'Hitbox path',
         result,
         args.settings.timeProcessor,
         'error',
      );
   } else {
      tool.output.html = null;
   }
}

export default tool;
