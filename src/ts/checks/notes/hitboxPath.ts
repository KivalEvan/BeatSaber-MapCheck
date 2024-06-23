import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import { isIntersect } from '../../bsmap/extensions/placement/note';
import UIInput from '../../ui/helpers/input';
import { IWrapColorNote } from '../../bsmap/types/beatmap/wrapper/colorNote';
import { ObjectContainerType } from '../../types/checks/container';

const name = 'Hitbox Path';
const description = 'Check for overlapping pre-swing note hitbox at same time.';
const enabled = true;

const tool: ITool = {
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
   run,
};

function check(args: ToolArgs) {
   const timeProcessor = args.beatmap.timeProcessor;
   const noteContainer = args.beatmap.noteContainer.filter(
      (n) => n.type === ObjectContainerType.BOMB || n.type === ObjectContainerType.COLOR,
   );

   const result: IWrapColorNote[] = [];
   // to avoid multiple of stack popping up, ignore anything within this time
   let lastTime: number = 0;
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      const currentNote = noteContainer[i];
      if (
         currentNote.type === ObjectContainerType.BOMB ||
         currentNote.type === ObjectContainerType.ARC ||
         currentNote.type === ObjectContainerType.CHAIN ||
         currentNote.data.customData.__mapcheck_secondtime < lastTime + 0.01
      ) {
         continue;
      }
      for (let j = i + 1; j < len; j++) {
         const compareTo = noteContainer[j];
         if (compareTo.data.customData.__mapcheck_secondtime > currentNote.data.customData.__mapcheck_secondtime + 0.01) {
            break;
         }
         if (
            compareTo.type === ObjectContainerType.COLOR &&
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
            result.push(currentNote.data);
            lastTime = currentNote.data.customData.__mapcheck_secondtime;
         }
      }
   }
   return result
}

function run(args: ToolArgs): IToolOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            type: 'time',
            label: 'Hitbox path',
            value: result,
            symbol: 'error',
         },
      ];
   }
   return [];
}

export default tool;
