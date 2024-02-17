import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { round } from '../../utils';
import { printResultTime } from '../helpers';
import UIInput from '../../ui/helpers/input';
import { BeatPerMinute } from '../../beatmap/shared/bpm';

const name = 'Effective BPM';
const description =
   'Effective BPM is calculated by one hand making 1/2 precision movement relative to the BPM.\nEBPM starts from previous end note to next start note (typically for sliders).\nEBPM Swing starts from previous start note to next start note.';
const enabled = true;
const defaultEBPM = 450;
const defaultEBPMS = 350;

const htmlEBPM = UIInput.createNumber(
   function (this: HTMLInputElement) {
      tool.input.params.ebpmThres = round(Math.abs(parseFloat(this.value)), 1);
      this.value = tool.input.params.ebpmThres.toString();
   },
   ': ',
   defaultEBPM,
   0,
);
const htmlEBPMS = UIInput.createNumber(
   function (this: HTMLInputElement) {
      tool.input.params.ebpmsThres = round(Math.abs(parseFloat(this.value)), 1);
      this.value = tool.input.params.ebpmsThres.toString();
   },
   ' (swing): ',
   defaultEBPMS,
   0,
);

const tool: Tool<{ ebpmThres: number; ebpmsThres: number }> = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_EFFECTIVE_BPM,
      output: ToolOutputOrder.NOTES_EFFECTIVE_BPM,
   },
   input: {
      enabled,
      params: {
         ebpmThres: defaultEBPM,
         ebpmsThres: defaultEBPMS,
      },
      html: UIInput.createBlock(
         UIInput.createCheckbox(
            function (this: HTMLInputElement) {
               tool.input.enabled = this.checked;
            },
            name + ' threshold',
            description,
            enabled,
         ),
         htmlEBPM,
         htmlEBPMS,
      ),
      adjustTime: adjustTimeHandler,
   },
   output: {
      html: null,
   },
   run: run,
};

function adjustTimeHandler(bpm: BeatPerMinute) {
   tool.input.params.ebpmThres = round(Math.min(defaultEBPM, bpm.value * 2 * 1.285714), 1);
   tool.input.params.ebpmsThres = round(Math.min(defaultEBPMS, bpm.value * 2), 1);
   htmlEBPM[1].value = tool.input.params.ebpmThres.toString();
   htmlEBPMS[1].value = tool.input.params.ebpmsThres.toString();
}

function check(map: ToolArgs) {
   const { swingAnalysis } = map.difficulty!;
   let { ebpmThres, ebpmsThres } = tool.input.params;
   ebpmThres += 0.001;
   ebpmsThres += 0.001;

   const noteEBPM = swingAnalysis.container.filter((s) => s.ebpm > ebpmThres).map((s) => s.time);
   const noteEBPMS = swingAnalysis.container
      .filter((s) => s.ebpmSwing > ebpmsThres)
      .map((s) => s.time);

   return { base: noteEBPM, swing: noteEBPMS };
}

function run(map: ToolArgs) {
   if (!map.difficulty) {
      console.error('Something went wrong!');
      return;
   }
   const result = check(map);
   const { ebpmThres, ebpmsThres } = tool.input.params;

   const htmlResult: HTMLElement[] = [];
   if (result.base.length) {
      htmlResult.push(
         printResultTime(`>${ebpmThres}EBPM warning`, result.base, map.settings.bpm, 'warning'),
      );
   }
   if (result.swing.length) {
      htmlResult.push(
         printResultTime(
            `>${ebpmsThres}EBPM (swing) warning`,
            result.swing,
            map.settings.bpm,
            'warning',
         ),
      );
   }

   if (htmlResult.length) {
      const htmlContainer = document.createElement('div');
      htmlResult.forEach((h) => htmlContainer.append(h));
      tool.output.html = htmlContainer;
   } else {
      tool.output.html = null;
   }
}

export default tool;
