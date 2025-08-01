import {
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   IBeatmapContainer,
   ICheck,
   ICheckOutput,
   OutputStatus,
   OutputType,
} from '../../types';
import { UIInput } from '../../ui/helpers/input';

const name = 'Varying Swing Speed';
const description = 'Check for varying swing speed due to changes in slider distance.';
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
      input: CheckInputOrder.NOTES_VARY_SWING,
      output: CheckOutputOrder.NOTES_VARY_SWING,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function check(difficulty: IBeatmapContainer) {
   const { swingAnalysis } = difficulty;
   return swingAnalysis.container.filter((n) => Math.abs(n.minSpeed - n.maxSpeed) > 0.001);
}

function run(args: CheckArgs): ICheckOutput[] {
   const result = check(args.beatmap);

   if (result.length) {
      return [
         {
            status: OutputStatus.ERROR,
            label: 'Varying swing speed',
            type: OutputType.TIME,
            value: result.map((n) => n.data[0]),
         },
      ];
   }
   return [];
}

export default tool;
