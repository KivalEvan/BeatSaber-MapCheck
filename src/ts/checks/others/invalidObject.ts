import {
   hasMappingExtensionsArc,
   hasMappingExtensionsBombNote,
   hasMappingExtensionsChain,
   hasMappingExtensionsNote,
   hasMappingExtensionsObstacle,
   hasMappingExtensionsObstacleV2,
} from '../../bsmap/beatmap/mod';
import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';
import { printResultTime } from '../helpers';

const name = 'Invalid Object';
const description = 'Validate beatmap object to be compatible with vanilla (ignores for modded).';
const enabled = true;

const tool: Tool = {
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
   output: {
      html: null,
   },
   run,
};

function run(args: ToolArgs) {
   if (!args.beatmap) {
      console.error('Something went wrong!');
      return;
   }
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

   let noteResult: number[] = [];
   let obstacleResult: number[] = [];
   let bombResult: number[] = [];
   let sliderResult: number[] = [];
   let chainResult: number[] = [];
   if (!args.beatmap.settings.customData._requirements?.includes('Mapping Extensions')) {
      if (args.beatmap.settings.customData._requirements?.includes('Noodle Extensions')) {
         const hasMEObstacle =
            args.beatmap.rawVersion === 2
               ? hasMappingExtensionsObstacleV2
               : hasMappingExtensionsObstacle;
         noteResult = colorNotes.filter(hasMappingExtensionsNote).map((n) => n.time);
         obstacleResult = obstacles.filter(hasMEObstacle).map((o) => o.time);
         bombResult = bombNotes.filter(hasMappingExtensionsBombNote).map((n) => n.time);
         sliderResult = arcs.filter(hasMappingExtensionsArc).map((o) => o.time);
         chainResult = chains.filter(hasMappingExtensionsChain).map((o) => o.time);
      } else {
         noteResult = colorNotes.filter((n) => !n.isValid()).map((n) => n.time);
         obstacleResult = obstacles.filter((o) => !o.isValid()).map((o) => o.time);
         bombResult = bombNotes.filter((b) => !b.isValid()).map((b) => b.time);
         sliderResult = arcs.filter((s) => !s.isValid()).map((s) => s.time);
         chainResult = chains.filter((bs) => !bs.isValid()).map((bs) => bs.time);
      }
   }
   const waypointResult = waypoints.filter((e) => !e.isValid()).map((e) => e.time);
   const eventResult = basicEvents.filter((e) => !e.isValid()).map((e) => e.time);
   const colorBoostResult = colorBoostEvents.filter((e) => !e.isValid()).map((e) => e.time);
   const lightColorBoxResult = lightColorEventBoxGroups
      .filter((e) => !e.isValid())
      .map((e) => e.time);
   const lightRotationBoxResult = lightRotationEventBoxGroups
      .filter((e) => !e.isValid())
      .map((e) => e.time);
   const lightTranslationBoxResult = lightTranslationEventBoxGroups
      .filter((e) => !e.isValid())
      .map((e) => e.time);
   const fxEventBoxResult = fxEventBoxGroups.filter((e) => !e.isValid()).map((e) => e.time);

   const htmlResult: HTMLElement[] = [];
   if (noteResult.length) {
      htmlResult.push(
         printResultTime('Invalid note', noteResult, args.settings.timeProcessor, 'error'),
      );
   }
   if (bombResult.length) {
      htmlResult.push(
         printResultTime('Invalid bomb', bombResult, args.settings.timeProcessor, 'error'),
      );
   }
   if (sliderResult.length) {
      htmlResult.push(
         printResultTime('Invalid arc', sliderResult, args.settings.timeProcessor, 'error'),
      );
   }
   if (chainResult.length) {
      htmlResult.push(
         printResultTime('Invalid chain', chainResult, args.settings.timeProcessor, 'error'),
      );
   }
   if (obstacleResult.length) {
      htmlResult.push(
         printResultTime('Invalid obstacle', obstacleResult, args.settings.timeProcessor, 'error'),
      );
   }
   if (waypointResult.length) {
      htmlResult.push(
         printResultTime('Invalid waypoint', waypointResult, args.settings.timeProcessor, 'error'),
      );
   }
   if (eventResult.length) {
      htmlResult.push(
         printResultTime('Invalid event', eventResult, args.settings.timeProcessor, 'error'),
      );
   }
   if (colorBoostResult.length) {
      htmlResult.push(
         printResultTime(
            'Invalid color boost',
            colorBoostResult,
            args.settings.timeProcessor,
            'error',
         ),
      );
   }
   if (lightColorBoxResult.length) {
      htmlResult.push(
         printResultTime(
            'Invalid light color event',
            lightColorBoxResult,
            args.settings.timeProcessor,
            'error',
         ),
      );
   }
   if (lightRotationBoxResult.length) {
      htmlResult.push(
         printResultTime(
            'Invalid light rotation event',
            lightRotationBoxResult,
            args.settings.timeProcessor,
            'error',
         ),
      );
   }
   if (lightTranslationBoxResult.length) {
      htmlResult.push(
         printResultTime(
            'Invalid light translation event',
            lightTranslationBoxResult,
            args.settings.timeProcessor,
            'error',
         ),
      );
   }
   if (fxEventBoxResult.length) {
      htmlResult.push(
         printResultTime(
            'Invalid FX event',
            fxEventBoxResult,
            args.settings.timeProcessor,
            'error',
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
