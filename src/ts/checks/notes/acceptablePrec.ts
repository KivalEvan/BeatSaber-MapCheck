import { sortObjectFn } from 'bsmap';
import {
   IBeatmapContainer,
   ICheck,
   ICheckOutput,
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   OutputType,
   OutputStatus,
} from '../../types';
import { UIInput } from '../../ui/helpers/input';
import { PrecalculateKey } from '../../types/precalculate';

const name = 'Acceptable Beat Precision';
const description = 'Validate note timing placement is within timing precision.\ni.e: 1/8 1/6 1/x';
const enabled = true;

const defaultPrec = [8, 6];

const [htmlInput, htmlLabel] = UIInput.createCheckbox(
   function (this: HTMLInputElement) {
      tool.input.params.enabled = this.checked;
   },
   name + ': ',
   description,
   enabled,
);
const [htmlPrec, htmlPrecLabel] = UIInput.createText(
   function (this: HTMLInputElement) {
      tool.input.params.prec = this.value
         .trim()
         .split(' ')
         .map((x) => parseInt(x))
         .filter((x) => (x > 0 ? !Number.isNaN(x) : false));
      this.value = tool.input.params.prec.join(' ');
   },
   '',
   defaultPrec.join(' '),
);

function update() {
   htmlInput.checked = tool.input.params.enabled;
   htmlPrec.value = tool.input.params.prec.join(' ');
}

const tool: ICheck<{ prec: number[] }> = {
   name,
   description,
   type: CheckType.NOTE,
   order: {
      input: CheckInputOrder.NOTES_ACCEPTABLE_PRECISION,
      output: CheckOutputOrder.NOTES_ACCEPTABLE_PRECISION,
   },
   input: {
      params: {
         enabled,
         prec: [...defaultPrec],
      },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel, htmlPrec, htmlPrecLabel),
      update,
   },
   run,
};

function check(beatmapItem: IBeatmapContainer) {
   const swingContainer = beatmapItem.swingAnalysis.container;
   const { prec } = tool.input.params;

   return swingContainer
      .map((n) => n.data.sort(sortObjectFn)[0])
      .filter((n) => {
         if (!prec.length) {
            return false;
         }
         const beat = n.customData[PrecalculateKey.BEAT_TIME];
         for (let i = 0; i < prec.length; i++) {
            if ((beat + 0.001) % (1 / prec[i]) < 0.01) {
               return false;
            }
         }
         return true;
      });
}

function run(args: CheckArgs): ICheckOutput[] {
   const result = check(args.beatmap);

   if (result.length) {
      return [
         {
            status: OutputStatus.WARNING,
            label: 'Off-beat precision',
            type: OutputType.TIME,
            value: result,
         },
      ];
   }
   return [];
}

export default tool;
