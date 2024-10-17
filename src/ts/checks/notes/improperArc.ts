import { NoteDirection } from 'bsmap';
import * as types from 'bsmap/types';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import { ObjectContainerType } from '../../types/checks/container';
import UIInput from '../../ui/helpers/input';

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

const tool: ITool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_IMPROPER_ARC,
      output: ToolOutputOrder.NOTES_IMPROPER_ARC,
   },
   input: {
      params: { enabled },
      html: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function check(args: ToolArgs) {
   // kinda slow but i need arc first
   const noteContainer = [...args.beatmap.noteContainer]
      .sort((a, b) =>
         a.type !== ObjectContainerType.ARC ? 1 : b.type !== ObjectContainerType.ARC ? -1 : 0,
      )
      .sort((a, b) => a.data.time - b.data.time);

   const result: types.wrapper.IWrapArc[] = [];
   for (let i = 0, potential = true, len = noteContainer.length; i < len; i++) {
      const arc = noteContainer[i];
      const lastTime = noteContainer.at(-1)!.data.time;
      if (arc.type === ObjectContainerType.ARC) {
         potential = true;
         for (let j = i, sike = false; j < len; j++) {
            const head = noteContainer[j];
            if (head.type === ObjectContainerType.COLOR) {
               if (
                  arc.data.posX === head.data.posX &&
                  arc.data.posY === head.data.posY &&
                  head.data.time <= arc.data.time + 0.001 &&
                  arc.data.color === head.data.color &&
                  (head.data.direction !== NoteDirection.ANY
                     ? arc.data.direction === head.data.direction
                     : true)
               ) {
                  for (let k = j; k < len; k++) {
                     const tail = noteContainer[j];
                     if (tail.type === ObjectContainerType.BOMB) {
                        if (
                           arc.data.posX === tail.data.posX &&
                           arc.data.posY === tail.data.posY &&
                           tail.data.time <= arc.data.time + 0.001
                        ) {
                           sike = true;
                           break;
                        }
                     }
                     if (
                        tail.type !== ObjectContainerType.COLOR ||
                        tail.data.time < arc.data.tailTime
                     ) {
                        continue;
                     }
                     if (
                        arc.data.posX === head.data.posX &&
                        arc.data.posY === head.data.posY &&
                        head.data.time <= arc.data.time + 0.001 &&
                        (arc.data.color !== head.data.color ||
                           (head.data.direction !== NoteDirection.ANY
                              ? arc.data.direction !== head.data.direction
                              : true))
                     ) {
                        sike = true;
                        break;
                     }
                     if (head.data.time > arc.data.tailTime + 0.001) {
                        break;
                     }
                  }
                  potential = sike || false;
                  break;
               }
            }
            if (head.type === ObjectContainerType.COLOR) {
               if (
                  arc.data.posX === head.data.posX &&
                  arc.data.posY === head.data.posY &&
                  head.data.time <= arc.data.time + 0.001
               ) {
                  break;
               }
            }
            if (head.data.time > arc.data.time + 0.001) {
               potential = false;
               break;
            }
            if (
               (head.type === ObjectContainerType.ARC || head.type === ObjectContainerType.CHAIN) &&
               head.data.time + 0.001 > lastTime
            ) {
               potential = false;
            }
         }
         if (potential) {
            result.push(arc.data);
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
            label: 'Improper arc',
            value: result,
            symbol: 'error',
         },
      ];
   }
   return [];
}

export default tool;
