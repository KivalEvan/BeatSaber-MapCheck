import {
   IBeatmapItem,
   IBeatmapSettings,
   Tool,
   ToolArgs,
   ToolInputOrder,
   ToolOutputOrder,
} from '../../types/mapcheck';
import UIInput from '../../ui/helpers/input';
import { printResultTime } from '../helpers';

const name = 'Acceptable Beat Precision';
const description = 'Validate note timing placement is within timing precision.\ni.e: 1/8 1/6 1/x';
const enabled = true;

const defaultPrec = [8, 6];

const tool: Tool<{ prec: number[] }> = {
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
   output: {
      html: null,
   },
   run,
};

function check(settings: IBeatmapSettings, difficulty: IBeatmapItem) {
   const { bpm } = settings;
   const swingContainer = difficulty.swingAnalysis.container;
   const { prec } = tool.input.params;

   return swingContainer
      .map((n) => n.time)
      .filter((x, i, ary) => {
         return !i || x !== ary[i - 1];
      })
      .filter((n) => {
         if (!prec.length) {
            return false;
         }
         for (let i = 0; i < prec.length; i++) {
            if ((bpm.adjustTime(n) + 0.001) % (1 / prec[i]) < 0.01) {
               return false;
            }
         }
         return true;
      });
}

function run(map: ToolArgs) {
   if (!map.difficulty) {
      console.error('Something went wrong!');
      return;
   }
   const result = check(map.settings, map.difficulty);

   if (result.length) {
      tool.output.html = printResultTime('Off-beat precision', result, map.settings.bpm, 'warning');
   } else {
      tool.output.html = null;
   }
}

export default tool;
