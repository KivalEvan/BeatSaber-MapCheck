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
import { PrecalculateKey } from '../../types/precalculate';
import { UIInput } from '../../ui/helpers/input';
import * as types from 'bsmap/types';

const name = 'Angle Offset';
const description = 'Check for unusual angle offset including for rankable criteria.';
const enabled = false;

const cachedHtmlDiff: {
   [key in 'Rankable' | 'Negative' | 'Excess' | 'Ignore Snap']: HTMLInputElement | null;
} = {
   Rankable: null,
   Negative: null,
   Excess: null,
   'Ignore Snap': null,
};

const htmlList = document.createElement('ul');
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

const tool: ICheck<{
   Rankable: boolean;
   Negative: boolean;
   Excess: boolean;
   'Ignore Snap': boolean;
}> = {
   name,
   description,
   type: CheckType.NOTE,
   order: {
      input: CheckInputOrder.NOTES_ANGLE_OFFSET,
      output: CheckOutputOrder.NOTES_ANGLE_OFFSET,
   },
   input: {
      params: { enabled, Rankable: false, Negative: false, Excess: false, 'Ignore Snap': false },
      ui: () => UIInput.createBlock(UIInput.createBlock(htmlInput, htmlLabel), htmlList),
      update,
   },
   run,
};

const list: ('Rankable' | 'Negative' | 'Excess' | 'Ignore Snap')[] = [
   'Rankable',
   'Negative',
   'Excess',
   'Ignore Snap',
];
for (const key of list) {
   const [htmlInput, htmlLabel] = UIInput.createCheckbox(
      function (this: HTMLInputElement) {
         tool.input.params[key] = this.checked;
      },
      key,
      `Check for ${key} angle offset.`,
      tool.input.params[key],
   );
   cachedHtmlDiff[key] = htmlInput;
   htmlList.appendChild(UIInput.createBlock(htmlInput, htmlLabel));
}

function run(args: CheckArgs): ICheckOutput[] {
   const results: ICheckOutput[] = [];

   const directionalAngles = args.beatmap.data.difficulty.colorNotes.filter(
      (n) =>
         ((tool.input.params['Ignore Snap'] || !n.customData[PrecalculateKey.SNAPPED]) &&
            n.direction !== types.NoteDirection.ANY &&
            n.angleOffset !== 0) ||
         (n.direction === types.NoteDirection.ANY &&
            (n.angleOffset % 45 !== 0 || Math.abs(n.angleOffset) > 45)),
   );
   if (directionalAngles.length) {
      results.push({
         status: OutputStatus.RANK,
         label: 'Rankable angle offset',
         type: OutputType.TIME,
         value: directionalAngles,
      });
   }

   const negativeAngles = args.beatmap.data.difficulty.colorNotes.filter(
      (n) =>
         (tool.input.params['Ignore Snap'] || !n.customData[PrecalculateKey.SNAPPED]) &&
         n.angleOffset < 0,
   );
   if (negativeAngles.length) {
      results.push({
         status: OutputStatus.INFO,
         label: 'Negative angle offset',
         type: OutputType.TIME,
         value: negativeAngles,
      });
   }

   const excessAngles = args.beatmap.data.difficulty.colorNotes.filter(
      (n) =>
         ((tool.input.params['Ignore Snap'] || !n.customData[PrecalculateKey.SNAPPED]) &&
            n.direction !== types.NoteDirection.ANY &&
            Math.abs(n.angleOffset) >= 45) ||
         ((tool.input.params['Ignore Snap'] || !n.customData[PrecalculateKey.SNAPPED]) &&
            n.direction === types.NoteDirection.ANY &&
            Math.abs(n.angleOffset) >= 90),
   );
   if (excessAngles.length) {
      results.push({
         status: OutputStatus.INFO,
         label: 'Excess angle offset',
         type: OutputType.TIME,
         value: excessAngles,
      });
   }

   return results;
}

export default tool;
