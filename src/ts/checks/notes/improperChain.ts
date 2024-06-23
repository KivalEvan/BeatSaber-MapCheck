import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import { IObjectContainer, ObjectContainerType } from '../../types/checks/container';
import UIInput from '../../ui/helpers/input';
import { NoteDirection } from '../../bsmap/beatmap/shared/constants';

const name = 'Improper Chain';
const description = 'Check for correct use of chain.';
const enabled = true;

const tool: ITool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_IMPROPER_CHAIN,
      output: ToolOutputOrder.NOTES_IMPROPER_CHAIN,
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

function run(args: ToolArgs): IToolOutput[] {
   const result = check(args);

   if (result.length) {
      return [
         {
            type: 'time',
            label: 'Improper chain',
            value: result.map(n => n.data),
            symbol: 'error',
         },
      ];
   }
   return [];
}

export default tool;
