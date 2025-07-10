import { sortObjectFn } from 'bsmap';
import {
   IBeatmapContainer,
   ITool,
   IToolOutput,
   ToolArgs,
   ToolInputOrder,
   ToolOutputOrder,
} from '../../types';
import { UIInput } from '../../ui/helpers/input';

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

const tool: ITool<{ prec: number[] }> = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_ACCEPTABLE_PRECISION,
      output: ToolOutputOrder.NOTES_ACCEPTABLE_PRECISION,
   },
   input: {
      params: {
         enabled,
         prec: [...defaultPrec],
      },
      html: UIInput.createBlock(htmlInput, htmlLabel, htmlPrec, htmlPrecLabel),
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
         const beat = n.customData.__mapcheck_beattime;
         for (let i = 0; i < prec.length; i++) {
            if ((beat + 0.001) % (1 / prec[i]) < 0.01) {
               return false;
            }
         }
         return true;
      });
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
