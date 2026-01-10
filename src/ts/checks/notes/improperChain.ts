import {
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   ICheck,
   ICheckOutput,
   OutputStatus,
   OutputType,
} from '../../types';
import { IChainLink, IObjectContainer, ObjectContainerType } from '../../types/container';
import { UIInput } from '../../ui/helpers/input';
import { NoteDirection } from 'bsmap';
import { isNotePointing, noteDistance } from '../../utils/beatmap';
import { PrecalculateKey } from '../../types/precalculate';
import { lowestDifferenceMod, vectorDistance } from 'bsmap';

const name = 'Improper Chain';
const description = 'Check for correct use of chain.';
const enabled = true;

const htmlList = document.createElement('ul');
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
   cachedHtmlDiff.Unrankable!.checked = tool.input.params.Unrankable;
}

type Params = { Unrankable: boolean };
const tool: ICheck<Params> = {
   name,
   description,
   type: CheckType.NOTE,
   order: {
      input: CheckInputOrder.NOTES_IMPROPER_CHAIN,
      output: CheckOutputOrder.NOTES_IMPROPER_CHAIN,
   },
   input: {
      params: { enabled, Unrankable: false },
      ui: UIInput.createBlock(UIInput.createBlock(htmlInput, htmlLabel), htmlList),
      update,
   },
   run,
};

const cachedHtmlDiff: {
   [key in keyof Params]: HTMLInputElement | null;
} = {
   Unrankable: null,
};

const list: (keyof Params)[] = ['Unrankable'];
for (const key of list) {
   const [htmlInput, htmlLabel] = UIInput.createCheckbox(
      function (this: HTMLInputElement) {
         tool.input.params[key] = this.checked;
      },
      key,
      `Check for ${key} angle offset.`,
      tool.input.params[key],
   );
   cachedHtmlDiff[key] = htmlInput;
   htmlList.appendChild(UIInput.createBlock(htmlInput, htmlLabel));
}

function chainImproper(args: CheckArgs) {
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
                  ((other.data.direction !== NoteDirection.ANY &&
                     chain.data.direction === other.data.direction &&
                     (chain.data.sliceCount === 1 ||
                        (vectorDistance(
                           other.data.customData[PrecalculateKey.POSITION],
                           chain.data.customData[PrecalculateKey.TAIL_POSITION],
                        ) > 0.1 &&
                           chain.data.sliceCount > 1 &&
                           isNotePointing(
                              other.data,
                              {
                                 posX: chain.data.tailPosX,
                                 posY: chain.data.tailPosY,
                                 customData: {
                                    [PrecalculateKey.POSITION]:
                                       chain.data.customData[PrecalculateKey.TAIL_POSITION],
                                 },
                              },
                              60,
                           )))) ||
                     (other.data.direction === NoteDirection.ANY &&
                        vectorDistance(
                           other.data.customData[PrecalculateKey.POSITION],
                           chain.data.customData[PrecalculateKey.TAIL_POSITION],
                        ) > 0.1 &&
                        chain.data.sliceCount > 1 &&
                        lowestDifferenceMod(
                           other.data.customData[PrecalculateKey.ANGLE],
                           chain.data.customData[PrecalculateKey.ANGLE],
                           360,
                        ) < 5))
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

function chainUnrankable(args: CheckArgs) {
   const noteContainer = [...args.beatmap.noteContainer]
      .sort((a, b) =>
         a.type !== ObjectContainerType.COLOR ? 1 : b.type !== ObjectContainerType.COLOR ? -1 : 0,
      )
      .sort((a, b) => a.data.time - b.data.time);

   let count = 0;
   const result = [];
   for (let i = 0; i < noteContainer.length; i++) {
      const object = noteContainer[i];
      if (object.type === ObjectContainerType.COLOR) {
         count++;
      }

      if (object.type === ObjectContainerType.CHAIN) {
         if (
            count <= 16 ||
            object.data.sliceCount < 1 ||
            object.data.customData[PrecalculateKey.CHAIN_LINKS].some(
               (l: IChainLink) =>
                  l.customData[PrecalculateKey.POSITION][0] < 0 - 0.5 ||
                  l.customData[PrecalculateKey.POSITION][1] < 0 - 0.5 ||
                  l.customData[PrecalculateKey.POSITION][0] > 3 + 0.5 ||
                  l.customData[PrecalculateKey.POSITION][1] > 2 + 0.5,
            ) ||
            (object.data.tailTime - object.data.time) /
               noteDistance(
                  object.data.customData[PrecalculateKey.CHAIN_LINKS].at(-1),
                  object.data,
               ) >
               0.1
         ) {
            result.push(object);
         }
      }
   }

   return result;
}

function run(args: CheckArgs): ICheckOutput[] {
   const improper = chainImproper(args);
   const unrankable = tool.input.params.Unrankable ? chainUnrankable(args) : [];

   const results: ICheckOutput[] = [];
   if (improper.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Improper chain',
         type: OutputType.TIME,
         value: improper.map((n) => n.data),
      });
   }
   if (unrankable.length) {
      results.push({
         status: OutputStatus.RANK,
         label: 'Unrankable chain',
         type: OutputType.TIME,
         value: unrankable.map((n) => n.data),
      });
   }
   return results;
}

export default tool;
