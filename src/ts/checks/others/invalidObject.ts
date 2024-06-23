import {
   hasMappingExtensionsArc,
   hasMappingExtensionsBombNote,
   hasMappingExtensionsChain,
   hasMappingExtensionsNote,
   hasMappingExtensionsObstacle,
   hasMappingExtensionsObstacleV2,
} from '../../bsmap/beatmap/mod';
import { IWrapBaseObject } from '../../bsmap/types/beatmap/wrapper/baseObject';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';

const name = 'Invalid Object';
const description = 'Validate beatmap object to be compatible with vanilla (ignores for modded).';
const enabled = true;

const tool: ITool = {
   name,
   description,
   type: 'other',
   order: {
      input: ToolInputOrder.OTHERS_INVALID_OBJECT,
      output: ToolOutputOrder.OTHERS_INVALID_OBJECT,
   },
   input: {
      enabled,
      params: {},
      html: UIInput.createBlock(
         UIInput.createCheckbox(
            function (this: HTMLInputElement) {
               tool.input.enabled = this.checked;
            },
            name,
            description,
            enabled,
         ),
      ),
   },
   run,
};

function run(args: ToolArgs): IToolOutput[] {
   const {
      colorNotes,
      bombNotes,
      obstacles,
      arcs,
      chains,
      waypoints,
      basicEvents,
      colorBoostEvents,
      lightColorEventBoxGroups,
      lightRotationEventBoxGroups,
      lightTranslationEventBoxGroups,
      fxEventBoxGroups,
   } = args.beatmap.data;

   let noteResult: IWrapBaseObject[] = [];
   let obstacleResult: IWrapBaseObject[] = [];
   let bombResult: IWrapBaseObject[] = [];
   let sliderResult: IWrapBaseObject[] = [];
   let chainResult: IWrapBaseObject[] = [];
   if (!args.beatmap.settings.customData._requirements?.includes('Mapping Extensions')) {
      if (args.beatmap.settings.customData._requirements?.includes('Noodle Extensions')) {
         const hasMEObstacle =
            args.beatmap.rawVersion === 2
               ? hasMappingExtensionsObstacleV2
               : hasMappingExtensionsObstacle;
         noteResult = colorNotes.filter(hasMappingExtensionsNote);
         obstacleResult = obstacles.filter(hasMEObstacle);
         bombResult = bombNotes.filter(hasMappingExtensionsBombNote);
         sliderResult = arcs.filter(hasMappingExtensionsArc);
         chainResult = chains.filter(hasMappingExtensionsChain);
      } else {
         noteResult = colorNotes.filter((n) => !n.isValid());
         obstacleResult = obstacles.filter((o) => !o.isValid());
         bombResult = bombNotes.filter((b) => !b.isValid());
         sliderResult = arcs.filter((s) => !s.isValid());
         chainResult = chains.filter((bs) => !bs.isValid());
      }
   }
   const waypointResult = waypoints.filter((e) => !e.isValid());
   const eventResult = basicEvents.filter((e) => !e.isValid());
   const colorBoostResult = colorBoostEvents.filter((e) => !e.isValid());
   const lightColorBoxResult = lightColorEventBoxGroups.filter((e) => !e.isValid());
   const lightRotationBoxResult = lightRotationEventBoxGroups.filter((e) => !e.isValid());
   const lightTranslationBoxResult = lightTranslationEventBoxGroups.filter((e) => !e.isValid());
   const fxEventBoxResult = fxEventBoxGroups.filter((e) => !e.isValid());

   const results: IToolOutput[] = [];
   if (noteResult.length) {
      results.push({
         type: 'time',
         label: 'Invalid note',
         value: noteResult,
         symbol: 'error',
      });
   }
   if (bombResult.length) {
      results.push({
         type: 'time',
         label: 'Invalid bomb',
         value: bombResult,
         symbol: 'error',
      });
   }
   if (sliderResult.length) {
      results.push({
         type: 'time',
         label: 'Invalid arc',
         value: sliderResult,
         symbol: 'error',
      });
   }
   if (chainResult.length) {
      results.push({
         type: 'time',
         label: 'Invalid chain',
         value: chainResult,
         symbol: 'error',
      });
   }
   if (obstacleResult.length) {
      results.push({
         type: 'time',
         label: 'Invalid obstacle',
         value: obstacleResult,
         symbol: 'error',
      });
   }
   if (waypointResult.length) {
      results.push({
         type: 'time',
         label: 'Invalid waypoint',
         value: waypointResult,
         symbol: 'error',
      });
   }
   if (eventResult.length) {
      results.push({
         type: 'time',
         label: 'Invalid event',
         value: eventResult,
         symbol: 'error',
      });
   }
   if (colorBoostResult.length) {
      results.push({
         type: 'time',
         label: 'Invalid color boost',
         value: colorBoostResult,

         symbol: 'error',
      });
   }
   if (lightColorBoxResult.length) {
      results.push({
         type: 'time',
         label: 'Invalid light color event',
         value: lightColorBoxResult,

         symbol: 'error',
      });
   }
   if (lightRotationBoxResult.length) {
      results.push({
         type: 'time',
         label: 'Invalid light rotation event',
         value: lightRotationBoxResult,

         symbol: 'error',
      });
   }
   if (lightTranslationBoxResult.length) {
      results.push({
         type: 'time',
         label: 'Invalid light translation event',
         value: lightTranslationBoxResult,

         symbol: 'error',
      });
   }
   if (fxEventBoxResult.length) {
      results.push({
         type: 'time',
         label: 'Invalid FX event',
         value: fxEventBoxResult,

         symbol: 'error',
      });
   }

   return results;
}

export default tool;
