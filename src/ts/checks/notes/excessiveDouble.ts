import { NoteColor } from 'bsmap/types';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';
import { round } from 'bsmap/utils';

const name = 'Excessive Double';
const description = 'Check for impractical amount of double notes.';
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

const tool: ITool<{ threshold: number }> = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_EXCESSIVE_DOUBLE,
      output: ToolOutputOrder.NOTES_EXCESSIVE_DOUBLE,
   },
   input: {
      params: { enabled, threshold: 0.6 },
      html: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function run(args: ToolArgs): IToolOutput[] {
   const blueSet = new Set<number>();
   const redSet = new Set<number>();

   for (let i = 0; i < args.beatmap.swingAnalysis.container.length; i++) {
      const note = args.beatmap.swingAnalysis.container[i].data[0];
      if (note.color === NoteColor.RED) {
         redSet.add(note.time);
      } else {
         blueSet.add(note.time);
      }
   }

   const max = Math.max(blueSet.size, redSet.size);
   const perc =
      Math.max(blueSet.intersection(redSet).size, redSet.intersection(blueSet).size) / max;
   console.log('double count', perc);

   if (perc > tool.input.params.threshold) {
      return [
         {
            type: 'string',
            label: `Excessive Double Hit (${round(perc * 100, 1)}%)`,
            value: 'Too many is not ideal mapping practices',
            symbol: 'warning',
         },
      ];
   }
   return [];
}

export default tool;
