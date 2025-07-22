import { NoteDirection } from 'bsmap';
import * as types from 'bsmap/types';
import {
   ICheck,
   ICheckOutput,
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   OutputType,
   OutputStatus,
} from '../../types';
import { ObjectContainerType } from '../../types/container';
import { UIInput } from '../../ui/helpers/input';
import { nearEqual } from 'bsmap/utils';
import { isNotePointing } from '../../utils/beatmap';

const name = 'Improper Arc';
const description = 'Check for correct use of arc.';
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
      input: CheckInputOrder.NOTES_IMPROPER_ARC,
      output: CheckOutputOrder.NOTES_IMPROPER_ARC,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function check(args: CheckArgs) {
   // kinda slow but i need arc first
   const noteContainer = [...args.beatmap.noteContainer]
      .sort((a, b) =>
         a.type !== ObjectContainerType.ARC ? 1 : b.type !== ObjectContainerType.ARC ? -1 : 0,
      )
      .sort((a, b) => a.data.time - b.data.time);

   const result: types.wrapper.IWrapArc[] = [];
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      const arc = noteContainer[i];
      if (arc.type === ObjectContainerType.ARC) {
         if (nearEqual(arc.data.time, arc.data.tailTime)) {
            result.push(arc.data);
            continue;
         }

         for (let j = i; j < len; j++) {
            const other = noteContainer[j];
            if (other.data.time > arc.data.tailTime + 0.001) {
               break;
            }
            if (other.type === ObjectContainerType.COLOR) {
               if (
                  (arc.data.posX === other.data.posX &&
                     arc.data.posY === other.data.posY &&
                     nearEqual(other.data.time, arc.data.time) &&
                     arc.data.color !== other.data.color) ||
                  (arc.data.tailPosX === other.data.posX &&
                     arc.data.tailPosY === other.data.posY &&
                     nearEqual(other.data.time, arc.data.tailTime) &&
                     arc.data.color !== other.data.color)
               ) {
                  result.push(arc.data);
                  break;
               }
            }
            if (other.type === ObjectContainerType.BOMB) {
               if (
                  (arc.data.posX === other.data.posX &&
                     arc.data.posY === other.data.posY &&
                     nearEqual(other.data.time, arc.data.time)) ||
                  (arc.data.tailPosX === other.data.posX &&
                     arc.data.tailPosY === other.data.posY &&
                     nearEqual(other.data.time, arc.data.tailTime))
               ) {
                  result.push(arc.data);
                  break;
               }
            }
         }
      }
   }
   return result;
}

function run(args: CheckArgs): ICheckOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            status: OutputStatus.ERROR,
            label: 'Improper arc',
            type: OutputType.TIME,
            value: result,
         },
      ];
   }
   return [];
}

export default tool;
