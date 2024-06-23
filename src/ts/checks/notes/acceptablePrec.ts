import { sortObjectFn } from '../../bsmap/beatmap/mod';
import {
   IBeatmapItem,
   ITool,
   IToolOutput,
   ToolArgs,
   ToolInputOrder,
   ToolOutputOrder,
} from '../../types';
import UIInput from '../../ui/helpers/input';

const name = 'Acceptable Beat Precision';
const description = 'Validate note timing placement is within timing precision.\ni.e: 1/8 1/6 1/x';
const enabled = true;

const defaultPrec = [8, 6];

const tool: ITool<{ prec: number[] }> = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_ACCEPTABLE_PRECISION,
      output: ToolOutputOrder.NOTES_ACCEPTABLE_PRECISION,
   },
   input: {
      enabled,
      params: {
         prec: [...defaultPrec],
      },
      html: UIInput.createBlock(
         UIInput.createCheckbox(
            function (this: HTMLInputElement) {
               tool.input.enabled = this.checked;
            },
            name + ': ',
            description,
            enabled,
         ),
         UIInput.createText(
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
         ),
      ),
   },
   run,
};

function check(beatmapItem: IBeatmapItem) {
   const swingContainer = beatmapItem.swingAnalysis.container;
   const { prec } = tool.input.params;

   return swingContainer
      .filter((x, i, ary) => {
         return !i || x.time !== ary[i - 1].time;
      })
      .map((n) => n.data.sort(sortObjectFn)[0])
      .filter((n) => {
         if (!prec.length) {
            return false;
         }
         const beat = n.customData.__mapcheck_beattime;
         for (let i = 0; i < prec.length; i++) {
            if ((beat + 0.001) % (1 / prec[i]) < 0.01) {
               return false;
            }
         }
         return true;
      })
}

function run(args: ToolArgs): IToolOutput[] {
   const result = check(args.beatmap);

   if (result.length) {
      return [
         {
            type: 'time',
            label: 'Off-beat precision',
            value: result,
            symbol: 'warning',
         },
      ];
   }
   return [];
}

export default tool;
