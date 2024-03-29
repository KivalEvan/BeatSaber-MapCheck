import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { toMmss } from '../../utils';
import settings from '../../settings';
import flag from '../../flag';
import { printResult } from '../helpers';
import UIInput from '../../ui/helpers/input';

const name = 'Audio Duration';
const description = 'For ranking purpose, check for audio duration.';
const enabled = true;

const tool: Tool = {
   name,
   description,
   type: 'general',
   order: {
      input: ToolInputOrder.GENERAL_AUDIO,
      output: ToolOutputOrder.GENERAL_AUDIO,
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

function run(map: ToolArgs) {
   const { audioDuration } = map.settings;

   if (audioDuration && audioDuration < 20) {
      tool.output.html = printResult(
         'Unrankable audio length',
         `too short (${toMmss(audioDuration)}s)`,
         'rank',
      );
   } else if (!flag.loading.audio) {
      tool.output.html = printResult(
         'No audio',
         settings.load.audio ? 'could not be loaded or not found' : 'no audio mode is enabled',
      );
   } else {
      tool.output.html = null;
   }
}

export default tool;
