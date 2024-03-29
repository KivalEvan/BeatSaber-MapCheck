import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
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

function run(map: ToolArgs) {
   if (!map.difficulty) {
      console.error('Something went wrong!');
      return;
   }
   const { colorNotes, bombNotes, obstacles, arcs, chains } = map.difficulty.data;
   const {
      waypoints,
      basicEvents,
      colorBoostEvents,
      lightColorEventBoxGroups,
      lightRotationEventBoxGroups,
      lightTranslationEventBoxGroups,
      fxEventBoxGroups,
   } = map.difficulty.lightshow;

   let noteResult: number[] = [];
   let obstacleResult: number[] = [];
   let bombResult: number[] = [];
   let sliderResult: number[] = [];
   let chainResult: number[] = [];
   if (!map.difficulty.info.customData._requirements?.includes('Mapping Extensions')) {
      if (map.difficulty.info.customData._requirements?.includes('Noodle Extensions')) {
         noteResult = colorNotes.filter((n) => n.isMappingExtensions()).map((n) => n.time);
         obstacleResult = obstacles.filter((o) => o.isMappingExtensions()).map((o) => o.time);
         bombResult = bombNotes.filter((n) => n.isMappingExtensions()).map((n) => n.time);
         sliderResult = arcs.filter((o) => o.isMappingExtensions()).map((o) => o.time);
         chainResult = chains.filter((o) => o.isMappingExtensions()).map((o) => o.time);
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
      htmlResult.push(printResultTime('Invalid note', noteResult, map.settings.bpm, 'error'));
   }
   if (bombResult.length) {
      htmlResult.push(printResultTime('Invalid bomb', bombResult, map.settings.bpm, 'error'));
   }
   if (sliderResult.length) {
      htmlResult.push(printResultTime('Invalid arc', sliderResult, map.settings.bpm, 'error'));
   }
   if (chainResult.length) {
      htmlResult.push(printResultTime('Invalid chain', chainResult, map.settings.bpm, 'error'));
   }
   if (obstacleResult.length) {
      htmlResult.push(
         printResultTime('Invalid obstacle', obstacleResult, map.settings.bpm, 'error'),
      );
   }
   if (waypointResult.length) {
      htmlResult.push(
         printResultTime('Invalid waypoint', waypointResult, map.settings.bpm, 'error'),
      );
   }
   if (eventResult.length) {
      htmlResult.push(printResultTime('Invalid event', eventResult, map.settings.bpm, 'error'));
   }
   if (colorBoostResult.length) {
      htmlResult.push(
         printResultTime('Invalid color boost', colorBoostResult, map.settings.bpm, 'error'),
      );
   }
   if (lightColorBoxResult.length) {
      htmlResult.push(
         printResultTime(
            'Invalid light color event',
            lightColorBoxResult,
            map.settings.bpm,
            'error',
         ),
      );
   }
   if (lightRotationBoxResult.length) {
      htmlResult.push(
         printResultTime(
            'Invalid light rotation event',
            lightRotationBoxResult,
            map.settings.bpm,
            'error',
         ),
      );
   }
   if (lightTranslationBoxResult.length) {
      htmlResult.push(
         printResultTime(
            'Invalid light translation event',
            lightTranslationBoxResult,
            map.settings.bpm,
            'error',
         ),
      );
   }
   if (fxEventBoxResult.length) {
      htmlResult.push(
         printResultTime('Invalid FX event', fxEventBoxResult, map.settings.bpm, 'error'),
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
