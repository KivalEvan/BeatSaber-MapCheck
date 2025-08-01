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
import { UIInput } from '../../ui/helpers/input';

const name = 'Preview Time';
const description = 'Warn default editor preview time.';
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
   type: CheckType.GENERAL,
   order: {
      input: CheckInputOrder.GENERAL_PREVIEW_TIME,
      output: CheckOutputOrder.GENERAL_PREVIEW_TIME,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function run(args: CheckArgs): ICheckOutput[] {
   const { previewStartTime, previewDuration } = args.info.audio;

   if (previewStartTime === 12 && previewDuration === 10) {
      return [
         {
            type: OutputType.STRING,
            label: 'Default preview time',
            value: "strongly recommended to set for audience's 1st impression",
            status: OutputStatus.INFO,
         },
      ];
   }
   return [];
}

export default tool;
