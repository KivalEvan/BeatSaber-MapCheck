import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import { ColorArray } from '../../bsmap/types/colors';
import { colorFrom, deltaE00, round } from '../../bsmap/utils/mod';
import UIInput from '../../ui/helpers/input';
import { printResult } from '../helpers';
import { ColorScheme, EnvironmentSchemeName } from '../../bsmap/beatmap/shared/colorScheme';

const name = 'Color Check';
const description = 'Compare note color with other colored note and the arrow on itself.';
const enabled = true;

const arrowColor: ColorArray = [1, 1, 1];

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

const tool: Tool = {
   name,
   description,
   type: 'note',
   order: {
      input: ToolInputOrder.NOTES_COLOR_CHECK,
      output: ToolOutputOrder.NOTES_COLOR_CHECK,
   },
   input: {
      enabled,
      params: {},
      html: UIInput.createBlock(
         UIInput.createCheckbox(
            function (this: HTMLInputElement) {
               tool.input.enabled = this.checked;
            },
            name + ' (EXPERIMENTAL)',
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

function customColorSimilarity(map: ToolArgs) {
   const checkColorLeft =
      map.beatmap?.settings.customData?._colorLeft ??
      ColorScheme[EnvironmentSchemeName[map.beatmap!.environment] ?? 'The First']._colorLeft;
   const checkColorRight =
      map.beatmap?.settings.customData?._colorRight ??
      ColorScheme[EnvironmentSchemeName[map.beatmap!.environment] ?? 'The First']._colorRight;
   if (checkColorLeft && checkColorRight) {
      return deltaE00(colorFrom(checkColorLeft), colorFrom(checkColorRight));
   }
   return 100;
}

function customColorArrowSimilarity(map: ToolArgs) {
   let deltaELeft = 100,
      deltaERight = 100;
   const checkColorLeft =
      map.beatmap?.settings.customData?._colorLeft ??
      ColorScheme[EnvironmentSchemeName[map.beatmap!.environment] ?? 'The First']._colorLeft;
   const checkColorRight =
      map.beatmap?.settings.customData?._colorRight ??
      ColorScheme[EnvironmentSchemeName[map.beatmap!.environment] ?? 'The First']._colorRight;
   if (checkColorLeft) {
      deltaELeft = deltaE00(arrowColor, colorFrom(checkColorLeft));
   }
   if (checkColorRight) {
      deltaERight = deltaE00(arrowColor, colorFrom(checkColorRight));
   }
   return Math.min(deltaELeft, deltaERight);
}

function run(args: ToolArgs) {
   if (
      !args.beatmap?.settings.customData?._colorLeft &&
      !args.beatmap?.settings.customData?._colorRight
   ) {
      return;
   }

   const ccSimilar = customColorSimilarity(args);
   const ccaSimilar = customColorArrowSimilarity(args);

   const htmlResult: HTMLElement[] = [];
   if (ccSimilar <= 20) {
      htmlResult.push(
         printResult(
            `${levelMsg(deltaELevel, ccSimilar)} note color (dE${round(ccSimilar, 1)})`,
            'suggest change to better differentiate between 2 note colour',
            'warning',
         ),
      );
   }
   if (ccaSimilar <= 20) {
      htmlResult.push(
         printResult(
            `${levelMsg(deltaELevel, ccaSimilar)} arrow note color (dE${round(ccaSimilar, 1)})`,
            'may be difficult to see the arrow',
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
