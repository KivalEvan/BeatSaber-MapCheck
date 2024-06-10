import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import { INoteContainer, NoteContainerType } from '../../types/checks/container';
import UIInput from '../../ui/helpers/input';
import { printResultTime } from '../helpers';
import { NoteDirection } from '../../bsmap/beatmap/shared/constants';

const name = 'Improper Chain';
const description = 'Check for correct use of chain.';
const enabled = true;

const tool: Tool = {
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
   output: {
      html: null,
   },
   run,
};

function check(args: ToolArgs) {
   // kinda slow but i need slider first
   const noteContainer = [...args.beatmap!.noteContainer]
      .sort((a, b) =>
         a.type !== NoteContainerType.CHAIN ? 1 : b.type !== NoteContainerType.CHAIN ? -1 : 0,
      )
      .sort((a, b) => a.data.time - b.data.time);

   const arr: INoteContainer[] = [];
   for (let i = 0, potential = true, len = noteContainer.length; i < len; i++) {
      const chain = noteContainer[i];
      if (chain.type === NoteContainerType.CHAIN) {
         potential = true;
         for (let j = i; j < len; j++) {
            const other = noteContainer[j];
            if (other.type === NoteContainerType.COLOR) {
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
            if (other.type === NoteContainerType.BOMB) {
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
            arr.push(chain);
         }
      }
   }
   return arr
      .map((n) => n.data.time)
      .filter(function (x, i, ary) {
         return !i || x !== ary[i - 1];
      });
}

function run(args: ToolArgs) {
   const result = check(args);

   if (result.length) {
      tool.output.html = printResultTime(
         'Improper chain',
         result,
         args.settings.timeProcessor,
         'error',
      );
   } else {
      tool.output.html = null;
   }
}

export default tool;
