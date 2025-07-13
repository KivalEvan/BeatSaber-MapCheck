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
import { IObjectContainer, ObjectContainerType } from '../../types/container';
import { UIInput } from '../../ui/helpers/input';
import { NoteDirection } from 'bsmap';

const name = 'Improper Chain';
const description = 'Check for correct use of chain.';
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
      input: CheckInputOrder.NOTES_IMPROPER_CHAIN,
      output: CheckOutputOrder.NOTES_IMPROPER_CHAIN,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function check(args: CheckArgs) {
   // kinda slow but i need slider first
   const noteContainer = [...args.beatmap.noteContainer]
      .sort((a, b) =>
         a.type !== ObjectContainerType.CHAIN ? 1 : b.type !== ObjectContainerType.CHAIN ? -1 : 0,
      )
      .sort((a, b) => a.data.time - b.data.time);

   const result: IObjectContainer[] = [];
   for (let i = 0, potential = true, len = noteContainer.length; i < len; i++) {
      const chain = noteContainer[i];
      if (chain.type === ObjectContainerType.CHAIN) {
         potential = true;
         for (let j = i; j < len; j++) {
            const other = noteContainer[j];
            if (other.type === ObjectContainerType.COLOR) {
               if (
                  chain.data.posX === other.data.posX &&
                  chain.data.posY === other.data.posY &&
                  other.data.time <= chain.data.time + 0.001 &&
                  chain.data.color === other.data.color &&
                  (other.data.direction !== NoteDirection.ANY
                     ? chain.data.direction === other.data.direction
                     : true)
               ) {
                  potential = false;
                  break;
               }
            }
            if (other.type === ObjectContainerType.BOMB) {
               if (
                  chain.data.posX === other.data.posX &&
                  chain.data.posY === other.data.posY &&
                  other.data.time <= chain.data.time + 0.001
               ) {
                  break;
               }
            }
            if (other.data.time > chain.data.time + 0.001) {
               break;
            }
         }
         if (potential) {
            result.push(chain);
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
            label: 'Improper chain',
            type: OutputType.TIME,
            value: result.map((n) => n.data),
         },
      ];
   }
   return [];
}

export default tool;
