import { ColorScheme, EnvironmentSchemeName } from 'bsmap';
import { colorFrom, deltaE00, round } from 'bsmap/utils';
import * as types from 'bsmap/types';
import {
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   ICheck,
   ICheckOutput,
   ObjectContainerType,
   OutputStatus,
   OutputType,
} from '../../types';
import { UIInput } from '../../ui/helpers/input';
import { PrecalculateKey } from '../../types/precalculate';

const name = 'Color Check';
const description = 'Compare note color with other colored note and the arrow on itself.';
const enabled = true;

const arrowColor: types.ColorArray = [1, 1, 1];

const deltaELevel: { [key: number]: string } = {
   2.5: 'Indistinguishable',
   10: 'Perceptible',
   20: 'Similar',
   40: 'Different',
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
      ui: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function customColorSimilarity(map: CheckArgs) {
   const colorScheme = map.info.colorSchemes[map.beatmap.info.colorSchemeId];
   const checkColorLeft =
      map.beatmap?.info.customData?._colorLeft ??
      colorScheme?.saberLeftColor ??
      ColorScheme[EnvironmentSchemeName[map.beatmap!.environment] ?? 'The First']._colorLeft;
   const checkColorRight =
      map.beatmap?.info.customData?._colorRight ??
      colorScheme?.saberRightColor ??
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
      colorScheme?.saberLeftColor ??
      ColorScheme[EnvironmentSchemeName[map.beatmap!.environment] ?? 'The First']._colorLeft;
   const checkColorRight =
      map.beatmap?.info.customData?._colorRight ??
      colorScheme?.saberRightColor ??
      ColorScheme[EnvironmentSchemeName[map.beatmap!.environment] ?? 'The First']._colorRight;
   if (checkColorLeft) {
      deltaELeft = deltaE00(arrowColor, colorFrom(checkColorLeft));
   }
   if (checkColorRight) {
      deltaERight = deltaE00(arrowColor, colorFrom(checkColorRight));
   }
   return Math.min(deltaELeft, deltaERight);
}

const deltaECache = new Map<string, number>();
function chromaColorCheck(map: CheckArgs): types.wrapper.IWrapBaseObject[] {
   if (
      (!map.beatmap.info.customData._suggestions?.includes('Chroma') &&
         !map.beatmap.info.customData._requirements?.includes('Chroma')) ||
      map.beatmap.info.customData._oneSaber ||
      map.beatmap.info.characteristic === 'OneSaber'
   ) {
      return [];
   }

   let result: types.wrapper.IWrapBaseObject[] = [];
   let prevIndex = 0;
   const container = map.beatmap.noteContainer;
   for (let i = 0; i < container.length; i++) {
      const note = container[i];
      if (
         note.type !== ObjectContainerType.COLOR &&
         note.type !== ObjectContainerType.ARC &&
         note.type !== ObjectContainerType.CHAIN
      ) {
         continue;
      }

      for (let j = i + 1; j < container.length; j++) {
         const compareTo = container[j];
         if (
            compareTo.type !== ObjectContainerType.COLOR &&
            compareTo.type !== ObjectContainerType.ARC &&
            compareTo.type !== ObjectContainerType.CHAIN
         ) {
            continue;
         }

         let deltaE;
         const key =
            note.data.customData[PrecalculateKey.COLOR].toString() +
            compareTo.data.customData[PrecalculateKey.COLOR].toString();
         if (deltaECache.has(key)) {
            deltaE = deltaECache.get(key)!;
         } else {
            deltaE = deltaE00(
               note.data.customData[PrecalculateKey.COLOR],
               compareTo.data.customData[PrecalculateKey.COLOR],
            );
            deltaECache.set(key, deltaE);
         }

         if (
            (note.data.color === compareTo.data.color && deltaE > 20) ||
            (note.data.color !== compareTo.data.color && deltaE < 20)
         ) {
            result.push(compareTo.data);
         }

         if (note.data.color === compareTo.data.color) {
            break;
         }
      }
   }
   return result.sort((a, b) => a.time - b.time);
}

function run(args: CheckArgs): ICheckOutput[] {
   const colorScheme = args.info.colorSchemes[args.beatmap.info.colorSchemeId];
   if (
      !args.beatmap.info.customData?._colorLeft &&
      !args.beatmap.info.customData?._colorRight &&
      !colorScheme?.saberLeftColor &&
      !colorScheme?.saberRightColor
   ) {
      return [];
   }

   const ccSimilar = customColorSimilarity(args);
   const ccaSimilar = customColorArrowSimilarity(args);
   const chromaSimilar = chromaColorCheck(args);

   const results: ICheckOutput[] = [];
   if (ccSimilar <= 20) {
      results.push({
         type: OutputType.STRING,
         label: `${levelMsg(deltaELevel, ccSimilar)} note color (dE${round(ccSimilar, 1)})`,
         value: 'suggest change to better differentiate between 2 note color',
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
   if (chromaSimilar.length) {
      results.push({
         type: OutputType.TIME,
         label: 'Problematic Chroma Color',
         value: chromaSimilar,
         status: OutputStatus.WARNING,
      });
   }

   return results;
}

export default tool;
