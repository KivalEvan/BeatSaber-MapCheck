import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import UICheckbox from '../../ui/helpers/checkbox';
import { printResultTime } from '../helpers';

const name = 'Improper Chain';
const description = 'Check for correct use of chain.';
const enabled = true;

const tool: Tool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_IMPROPER_CHAIN,
      output: ToolOutputOrder.NOTES_IMPROPER_CHAIN,
   },
   input: {
      enabled,
      params: {},
      html: UICheckbox.create(name, description, enabled, function (this: HTMLInputElement) {
         tool.input.enabled = this.checked;
      }),
   },
   output: {
      html: null,
   },
   run,
};

function run(map: ToolArgs) {
   let result: number[] | undefined;
   if (map.difficulty?.characteristic === 'OneSaber' || map.difficulty?.info.customData.oneSaber)
      result = map.difficulty.data.colorNotes.filter((n) => n.isRed()).map((n) => n.time);

   if (result?.length) {
      tool.output.html = printResultTime('Wrong One Saber Note', result, map.settings.bpm, 'error');
   } else {
      tool.output.html = null;
   }
}

export default tool;
