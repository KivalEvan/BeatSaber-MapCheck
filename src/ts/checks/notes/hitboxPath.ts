import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';
import { ObjectContainerType } from '../../types/checks/container';
import * as types from 'bsmap/types';
import { placement } from 'bsmap/extensions';

const name = 'Hitbox Path';
const description = 'Check for overlapping pre-swing note hitbox at same time.';
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
      input: ToolInputOrder.NOTES_HITBOX_PATH,
      output: ToolOutputOrder.NOTES_HITBOX_PATH,
   },
   input: {
      params: { enabled },
      html: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function check(args: ToolArgs) {
   const timeProcessor = args.beatmap.timeProcessor;
   const noteContainer = args.beatmap.noteContainer.filter(
      (n) => n.type === ObjectContainerType.BOMB || n.type === ObjectContainerType.COLOR,
   );

   const result: types.wrapper.IWrapColorNote[] = [];
   // to avoid multiple of stack popping up, ignore anything within this time
   let lastTime: number = 0;
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      const currentNote = noteContainer[i];
      if (
         currentNote.type !== ObjectContainerType.COLOR ||
         currentNote.data.customData.__mapcheck_secondtime < lastTime + 0.01
      ) {
         continue;
      }
      for (let j = i + 1; j < len; j++) {
         const compareTo = noteContainer[j];
         if (
            compareTo.data.customData.__mapcheck_secondtime >
            currentNote.data.customData.__mapcheck_secondtime + 0.01
         ) {
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
               placement
                  .isIntersect(currentNote.data, compareTo.data, [
                     [45, 1],
                     [15, 2],
                  ])
                  .some((b) => b)) ||
            (currentNote.data.isDiagonal(compareTo.data) &&
               placement
                  .isIntersect(currentNote.data, compareTo.data, [
                     [45, 1],
                     [15, 1.5],
                  ])
                  .some((b) => b))
         ) {
            result.push(currentNote.data);
            lastTime = currentNote.data.customData.__mapcheck_secondtime;
         }
      }
   }
   return result;
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
