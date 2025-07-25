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
import { TimeProcessor } from 'bsmap';
import { round } from 'bsmap/utils';
import { UIInput } from '../../ui/helpers/input';

const name = 'Effective BPM';
const description =
   'Effective BPM is calculated by one hand making 1/2 precision movement relative to the BPM.\nEBPM starts from previous end note to next start note (typically for sliders).\nEBPM Swing starts from previous start note to next start note.';
const enabled = true;
const defaultEBPM = 450;
const defaultEBPMS = 350;

const htmlEnabled = UIInput.createCheckbox(
   function (this: HTMLInputElement) {
      tool.input.params.enabled = this.checked;
   },
   name + ' threshold',
   description,
   enabled,
);
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

function update(timeProcessor?: TimeProcessor) {
   htmlEnabled[0].checked = tool.input.params.enabled;
   if (timeProcessor) adjustTimeHandler(timeProcessor);
}

const tool: ICheck<{ ebpmThres: number; ebpmsThres: number }> = {
   name,
   description,
   type: CheckType.NOTE,
   order: {
      input: CheckInputOrder.NOTES_EFFECTIVE_BPM,
      output: CheckOutputOrder.NOTES_EFFECTIVE_BPM,
   },
   input: {
      params: {
         enabled,
         ebpmThres: defaultEBPM,
         ebpmsThres: defaultEBPMS,
      },
      ui: () => UIInput.createBlock(htmlEnabled, htmlEBPM, htmlEBPMS),
      update,
      adjustTime: adjustTimeHandler,
   },
   run,
};

function adjustTimeHandler(timeProcessor: TimeProcessor) {
   tool.input.params.ebpmThres = round(Math.min(defaultEBPM, timeProcessor.bpm * 2 * 1.285714), 1);
   tool.input.params.ebpmsThres = round(Math.min(defaultEBPMS, timeProcessor.bpm * 2), 1);
   htmlEBPM[1].value = tool.input.params.ebpmThres.toString();
   htmlEBPMS[1].value = tool.input.params.ebpmsThres.toString();
}

function check(args: CheckArgs) {
   const { swingAnalysis } = args.beatmap;
   let { ebpmThres, ebpmsThres } = tool.input.params;
   ebpmThres += 0.001;
   ebpmsThres += 0.001;

   const noteEBPM = swingAnalysis.container.filter((s) => s.ebpm > ebpmThres).map((s) => s.data[0]);
   const noteEBPMS = swingAnalysis.container
      .filter((s) => s.ebpmSwing > ebpmsThres)
      .map((s) => s.data[0]);

   return { base: noteEBPM, swing: noteEBPMS };
}

function run(args: CheckArgs): ICheckOutput[] {
   const result = check(args);
   const { ebpmThres, ebpmsThres } = tool.input.params;

   const results: ICheckOutput[] = [];
   if (result.base.length) {
      results.push({
         status: OutputStatus.WARNING,
         label: `>${ebpmThres}EBPM warning`,
         type: OutputType.TIME,
         value: result.base,
      });
   }
   if (result.swing.length) {
      results.push({
         status: OutputStatus.WARNING,
         label: `>${ebpmsThres}EBPM (swing) warning`,
         type: OutputType.TIME,
         value: result.swing,
      });
   }

   return results;
}

export default tool;
