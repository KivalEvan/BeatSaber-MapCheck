import {
   ICheck,
   ICheckOutput,
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   OutputType,
   OutputStatus,
} from '../../types';
import { Settings } from '../../settings';
import { State } from '../../state';
import { UIInput } from '../../ui/helpers/input';
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

const tool: ICheck = {
   name,
   description,
   type: CheckType.GENERAL,
   order: {
      input: CheckInputOrder.GENERAL_AUDIO,
      output: CheckOutputOrder.GENERAL_AUDIO,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function run(args: CheckArgs): ICheckOutput[] {
   const audioDuration = args.audioDuration;

   if (audioDuration && audioDuration < 20) {
      return [
         {
            type: OutputType.STRING,
            label: 'Unrankable audio length',
            value: `too short (${secToMmss(audioDuration)}s)`,
            status: OutputStatus.RANK,
         },
      ];
   } else if (!State.flag.audio) {
      return [
         {
            type: OutputType.STRING,
            label: 'No audio',
            value: Settings.props.load.audio
               ? 'could not be loaded or not found'
               : 'no audio mode is enabled',
         },
      ];
   }

   return [];
}

export default tool;
