import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import { NoteContainerType, INoteContainer } from '../../types/tools/container';
import UIInput from '../../ui/helpers/input';
import { printResultTime } from '../helpers';
import { NoteDirection } from '../../bsmap/beatmap/shared/constants';

const name = 'Improper Arc';
const description = 'Check for correct use of arc.';
const enabled = true;

const tool: Tool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_IMPROPER_ARC,
      output: ToolOutputOrder.NOTES_IMPROPER_ARC,
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
   // kinda slow but i need arc first
   const noteContainer = [...args.beatmap!.noteContainer]
      .sort((a, b) =>
         a.type !== NoteContainerType.ARC ? 1 : b.type !== NoteContainerType.ARC ? -1 : 0,
      )
      .sort((a, b) => a.data.time - b.data.time);

   const arr: INoteContainer[] = [];
   for (let i = 0, potential = true, len = noteContainer.length; i < len; i++) {
      const arc = noteContainer[i];
      const lastTime = noteContainer.at(-1)!.data.time;
      if (arc.type === NoteContainerType.ARC) {
         potential = true;
         for (let j = i, sike = false; j < len; j++) {
            const head = noteContainer[j];
            if (head.type === NoteContainerType.COLOR) {
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
                     if (tail.type === NoteContainerType.BOMB) {
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
                        tail.type !== NoteContainerType.COLOR ||
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
            if (head.type === NoteContainerType.COLOR) {
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
               (head.type === NoteContainerType.ARC || head.type === NoteContainerType.CHAIN) &&
               head.data.time + 0.001 > lastTime
            ) {
               potential = false;
            }
         }
         if (potential) {
            arr.push(arc);
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
         'Improper arc',
         result,
         args.settings.timeProcessor,
         'error',
      );
   } else {
      tool.output.html = null;
   }
}

export default tool;
