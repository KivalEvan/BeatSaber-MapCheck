import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import settings from '../../settings';
import flag from '../../flag';
import UIInput from '../../ui/helpers/input';
import { secToMmss } from 'bsmap/utils';

const name = 'Audio Duration';
const description = 'For ranking purpose, check for audio duration.';
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
   type: 'general',
   order: {
      input: ToolInputOrder.GENERAL_AUDIO,
      output: ToolOutputOrder.GENERAL_AUDIO,
   },
   input: {
      params: { enabled },
      html: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function run(args: ToolArgs): IToolOutput[] {
   const audioDuration = args.audioDuration;

   if (audioDuration && audioDuration < 20) {
      return [
         {
            type: 'string',
            label: 'Unrankable audio length',
            value: `too short (${secToMmss(audioDuration)}s)`,
            symbol: 'rank',
         },
      ];
   } else if (!flag.loading.audio) {
      return [
         {
            type: 'string',
            label: 'No audio',
            value: settings.load.audio
               ? 'could not be loaded or not found'
               : 'no audio mode is enabled',
         },
      ];
   }

   return [];
}

export default tool;
