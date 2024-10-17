import { ColorScheme, EnvironmentSchemeName } from 'bsmap';
import { colorFrom, deltaE00, round } from 'bsmap/utils';
import * as types from 'bsmap/types';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';

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

const tool: ITool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_COLOR_CHECK,
      output: ToolOutputOrder.NOTES_COLOR_CHECK,
   },
   input: {
      params: { enabled },
      html: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function customColorSimilarity(map: ToolArgs) {
   const colorScheme = map.info.colorSchemes[map.beatmap.settings.colorSchemeId];
   const checkColorLeft =
      map.beatmap?.settings.customData?._colorLeft ??
      colorScheme.saberLeftColor ??
      ColorScheme[EnvironmentSchemeName[map.beatmap!.environment] ?? 'The First']._colorLeft;
   const checkColorRight =
      map.beatmap?.settings.customData?._colorRight ??
      colorScheme.saberRightColor ??
      ColorScheme[EnvironmentSchemeName[map.beatmap!.environment] ?? 'The First']._colorRight;
   if (checkColorLeft && checkColorRight) {
      return deltaE00(colorFrom(checkColorLeft), colorFrom(checkColorRight));
   }
   return 100;
}

function customColorArrowSimilarity(map: ToolArgs) {
   const colorScheme = map.info.colorSchemes[map.beatmap.settings.colorSchemeId];
   let deltaELeft = 100,
      deltaERight = 100;
   const checkColorLeft =
      map.beatmap?.settings.customData?._colorLeft ??
      colorScheme.saberLeftColor ??
      ColorScheme[EnvironmentSchemeName[map.beatmap!.environment] ?? 'The First']._colorLeft;
   const checkColorRight =
      map.beatmap?.settings.customData?._colorRight ??
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

function run(args: ToolArgs): IToolOutput[] {
   const colorScheme = args.info.colorSchemes[args.beatmap.settings.colorSchemeId];
   if (
      !args.beatmap.settings.customData?._colorLeft &&
      !args.beatmap.settings.customData?._colorRight &&
      !colorScheme
   ) {
      return [];
   }

   const ccSimilar = customColorSimilarity(args);
   const ccaSimilar = customColorArrowSimilarity(args);

   const results: IToolOutput[] = [];
   if (ccSimilar <= 20) {
      results.push({
         type: 'string',
         label: `${levelMsg(deltaELevel, ccSimilar)} note color (dE${round(ccSimilar, 1)})`,
         value: 'suggest change to better differentiate between 2 note colour',
         symbol: 'warning',
      });
   }
   if (ccaSimilar <= 20) {
      results.push({
         type: 'string',
         label: `${levelMsg(deltaELevel, ccaSimilar)} arrow note color (dE${round(ccaSimilar, 1)})`,
         value: 'may be difficult to see the arrow',
         symbol: 'warning',
      });
   }

   return results;
}

export default tool;
