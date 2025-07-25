import { ColorScheme, EnvironmentSchemeName } from 'bsmap';
import { colorFrom, deltaE00, round } from 'bsmap/utils';
import * as types from 'bsmap/types';
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
import { UIInput } from '../../ui/helpers/input';

const name = 'Color Check';
const description = 'Compare note color with other colored note and the arrow on itself.';
const enabled = true;

const arrowColor: types.ColorArray = [1, 1, 1];

const deltaELevel: { [key: number]: string } = {
   1: 'Indistinguishable',
   5: 'Hardly perceivable',
   10: 'Close apparent',
   20: 'Mildly similar',
   40: 'Different',
   90: 'Discernible',
   100: 'Opposite',
} as const;

function levelMsg(level: { [key: number]: string }, perc: number): string {
   let findKey = Object.keys(level).find((s) => parseFloat(s) >= perc) ?? '100';
   let key = parseFloat(findKey);
   return level[key];
}

const [htmlInput, htmlLabel] = UIInput.createCheckbox(
   function (this: HTMLInputElement) {
      tool.input.params.enabled = this.checked;
   },
   name + ' (EXPERIMENTAL)',
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
      input: CheckInputOrder.NOTES_COLOR_CHECK,
      output: CheckOutputOrder.NOTES_COLOR_CHECK,
   },
   input: {
      params: { enabled },
      ui: () => UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function customColorSimilarity(map: CheckArgs) {
   const colorScheme = map.info.colorSchemes[map.beatmap.info.colorSchemeId];
   const checkColorLeft =
      map.beatmap?.info.customData?._colorLeft ??
      colorScheme.saberLeftColor ??
      ColorScheme[EnvironmentSchemeName[map.beatmap!.environment] ?? 'The First']._colorLeft;
   const checkColorRight =
      map.beatmap?.info.customData?._colorRight ??
      colorScheme.saberRightColor ??
      ColorScheme[EnvironmentSchemeName[map.beatmap!.environment] ?? 'The First']._colorRight;
   if (checkColorLeft && checkColorRight) {
      return deltaE00(colorFrom(checkColorLeft), colorFrom(checkColorRight));
   }
   return 100;
}

function customColorArrowSimilarity(map: CheckArgs) {
   const colorScheme = map.info.colorSchemes[map.beatmap.info.colorSchemeId];
   let deltaELeft = 100,
      deltaERight = 100;
   const checkColorLeft =
      map.beatmap?.info.customData?._colorLeft ??
      colorScheme.saberLeftColor ??
      ColorScheme[EnvironmentSchemeName[map.beatmap!.environment] ?? 'The First']._colorLeft;
   const checkColorRight =
      map.beatmap?.info.customData?._colorRight ??
      colorScheme.saberRightColor ??
      ColorScheme[EnvironmentSchemeName[map.beatmap!.environment] ?? 'The First']._colorRight;
   if (checkColorLeft) {
      deltaELeft = deltaE00(arrowColor, colorFrom(checkColorLeft));
   }
   if (checkColorRight) {
      deltaERight = deltaE00(arrowColor, colorFrom(checkColorRight));
   }
   return Math.min(deltaELeft, deltaERight);
}

function run(args: CheckArgs): ICheckOutput[] {
   const colorScheme = args.info.colorSchemes[args.beatmap.info.colorSchemeId];
   if (
      !args.beatmap.info.customData?._colorLeft &&
      !args.beatmap.info.customData?._colorRight &&
      !colorScheme
   ) {
      return [];
   }

   const ccSimilar = customColorSimilarity(args);
   const ccaSimilar = customColorArrowSimilarity(args);

   const results: ICheckOutput[] = [];
   if (ccSimilar <= 20) {
      results.push({
         type: OutputType.STRING,
         label: `${levelMsg(deltaELevel, ccSimilar)} note color (dE${round(ccSimilar, 1)})`,
         value: 'suggest change to better differentiate between 2 note colour',
         status: OutputStatus.WARNING,
      });
   }
   if (ccaSimilar <= 20) {
      results.push({
         type: OutputType.STRING,
         label: `${levelMsg(deltaELevel, ccaSimilar)} arrow note color (dE${round(ccaSimilar, 1)})`,
         value: 'may be difficult to see the arrow',
         status: OutputStatus.WARNING,
      });
   }

   return results;
}

export default tool;
