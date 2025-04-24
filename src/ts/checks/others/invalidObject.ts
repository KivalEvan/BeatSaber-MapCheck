import {
   hasMappingExtensionsArc,
   hasMappingExtensionsBombNote,
   hasMappingExtensionsChain,
   hasMappingExtensionsNote,
   hasMappingExtensionsObstacleV3,
   hasMappingExtensionsObstacleV2,
   ColorNote,
   Obstacle,
   BombNote,
   Arc,
   Chain,
   Waypoint,
   BasicEvent,
   ColorBoostEvent,
   LightColorEventBoxGroup,
   LightRotationEventBoxGroup,
   LightTranslationEventBoxGroup,
   FxEventBoxGroup,
   isInverseSlider,
   isValidEventType,
   isOldChromaEventValue,
   isLaserRotationEventType,
   isZeroValueObstacle,
   isNegativeValueObstacle,
   LimitAlsoAffectsType,
   RandomType,
} from 'bsmap';
import * as types from 'bsmap/types';
import { ITool, IToolOutput, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types';
import UIInput from '../../ui/helpers/input';

const name = 'Invalid Object';
const description = 'Validate beatmap object to be compatible with vanilla (ignores for modded).';
const enabled = true;

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

const tool: ITool = {
   name,
   description,
   type: 'other',
   order: {
      input: ToolInputOrder.OTHERS_INVALID_OBJECT,
      output: ToolOutputOrder.OTHERS_INVALID_OBJECT,
   },
   input: {
      params: { enabled },
      html: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function isValidBaseNote(obj: types.wrapper.IWrapBaseNote): boolean {
   return obj.direction >= 0 && obj.direction <= 8;
}
function isValidIndexFilter(obj: types.wrapper.IWrapIndexFilter): boolean {
   return (
      (obj.type === 1 || obj.type === 2) &&
      obj.p0 >= 0 &&
      obj.p1 >= 0 &&
      (obj.reverse === 0 || obj.reverse === 1) &&
      obj.chunks >= 0 &&
      obj.random >= 0 &&
      obj.random <= RandomType.ALL &&
      obj.limit >= 0 &&
      obj.limit <= 1 &&
      obj.limitAffectsType >= 0 &&
      obj.limitAffectsType <= LimitAlsoAffectsType.ALL
   );
}
function isValidEventBox(obj: types.wrapper.IWrapEventBox): boolean {
   return (
      (obj.beatDistributionType === 1 || obj.beatDistributionType === 2) &&
      obj.easing >= -1 &&
      obj.easing <= 103 &&
      isValidIndexFilter(obj.filter)
   );
}
function isValidEventBoxGroup(obj: types.wrapper.IWrapEventBoxGroup): boolean {
   return obj.boxes.every(isValidEventBox);
}
function isValidColorNote(obj: types.wrapper.IWrapColorNote): boolean {
   return isValidBaseNote(obj) && obj.posX >= 0 && obj.posX <= 3 && obj.posY >= 0 && obj.posY <= 2;
}
function isValidObstacle(obj: types.wrapper.IWrapObstacle): boolean {
   return !isZeroValueObstacle(obj) && !isNegativeValueObstacle(obj);
}
function isValidBombNote(obj: types.wrapper.IWrapBombNote): boolean {
   return isValidBaseNote(obj) && obj.posX >= 0 && obj.posX <= 3 && obj.posY >= 0 && obj.posY <= 2;
}
function isValidArc(obj: types.wrapper.IWrapArc): boolean {
   return (
      isValidBaseNote(obj) &&
      !(
         isInverseSlider(obj) ||
         obj.posX < 0 ||
         obj.posX > 3 ||
         obj.tailPosX < 0 ||
         obj.tailPosX > 3 ||
         (obj.posX === obj.tailPosX && obj.posY === obj.tailPosY && obj.time === obj.tailTime)
      )
   );
}
function isValidChain(obj: types.wrapper.IWrapChain): boolean {
   return (
      isValidBaseNote(obj) &&
      (!isInverseSlider(obj) ||
         obj.posY >= 0 ||
         obj.posY <= 2 ||
         obj.tailPosY >= 0 ||
         obj.tailPosY <= 2)
   );
}
function isValidRotationEvent(obj: types.wrapper.IWrapRotationEvent): boolean {
   return obj.executionTime === 0 || obj.executionTime === 1;
}
function isValidWaypoint(obj: types.wrapper.IWrapWaypoint): boolean {
   return obj.direction >= 0 && obj.direction <= 9 && obj.direction !== (8 as 0);
}
function isValidBasicEvent(obj: types.wrapper.IWrapBasicEvent): boolean {
   return (
      isValidEventType(obj.type) &&
      obj.value >= 0 &&
      !(!isLaserRotationEventType(obj.type) && obj.value > 12 && !isOldChromaEventValue(obj.value))
   );
}
function isValidLightColorEvent(obj: types.wrapper.IWrapLightColorEvent): boolean {
   return (
      (obj.previous === 0 || obj.previous === 1) &&
      obj.easing >= -1 &&
      obj.easing <= 103 &&
      obj.color >= -1 &&
      obj.color <= 2 &&
      obj.brightness >= 0 &&
      obj.frequency >= 0
   );
}
function isValidLightColorEventBox(obj: types.wrapper.IWrapLightColorEventBox): boolean {
   return (
      obj.events.every(isValidLightColorEvent) &&
      (obj.brightnessDistributionType === 1 || obj.brightnessDistributionType === 2) &&
      (obj.affectFirst === 0 || obj.affectFirst === 1)
   );
}
function isValidLightColorEventBoxGroup(obj: types.wrapper.IWrapLightColorEventBoxGroup): boolean {
   return obj.boxes.every(isValidLightColorEventBox);
}
function isValidLightRotationEvent(obj: types.wrapper.IWrapLightRotationEvent): boolean {
   return (
      (obj.previous === 0 || obj.previous === 1) &&
      obj.easing >= -1 &&
      obj.easing <= 103 &&
      obj.loop >= 0 &&
      obj.direction >= 0 &&
      obj.direction <= 2
   );
}
function isValidLightRotationEventBox(obj: types.wrapper.IWrapLightRotationEventBox): boolean {
   return (
      obj.events.every(isValidLightRotationEvent) &&
      (obj.rotationDistributionType === 1 || obj.rotationDistributionType === 2) &&
      (obj.axis === 0 || obj.axis === 1 || obj.axis === 2) &&
      (obj.flip === 0 || obj.flip === 1) &&
      (obj.affectFirst === 0 || obj.affectFirst === 1)
   );
}
function isValidLightRotationEventBoxGroup(
   obj: types.wrapper.IWrapLightRotationEventBoxGroup,
): boolean {
   return obj.boxes.every(isValidLightRotationEventBox);
}
function isValidLightTranslationEvent(obj: types.wrapper.IWrapLightTranslationEvent): boolean {
   return (obj.previous === 0 || obj.previous === 1) && obj.easing >= -1 && obj.easing <= 103;
}
function isValidLightTranslationEventBox(
   obj: types.wrapper.IWrapLightTranslationEventBox,
): boolean {
   return (
      obj.events.every(isValidLightTranslationEvent) &&
      (obj.gapDistributionType === 1 || obj.gapDistributionType === 2) &&
      (obj.axis === 0 || obj.axis === 1 || obj.axis === 2) &&
      (obj.flip === 0 || obj.flip === 1) &&
      (obj.affectFirst === 0 || obj.affectFirst === 1)
   );
}
function isValidLightTranslationEventBoxGroup(
   obj: types.wrapper.IWrapLightTranslationEventBoxGroup,
): boolean {
   return obj.boxes.every(isValidLightTranslationEventBox);
}
function isValidFxFloatEvent(obj: types.wrapper.IWrapFxEventFloat): boolean {
   return (obj.previous === 0 || obj.previous === 1) && obj.easing >= -1 && obj.easing <= 103;
}
function isValidFxIntEvent(obj: types.wrapper.IWrapFxEventInt): boolean {
   return obj.previous === 0 || obj.previous === 1;
}
function isValidFxEventBox(obj: types.wrapper.IWrapFxEventBox): boolean {
   return (
      obj.events.every(isValidFxFloatEvent) &&
      (obj.fxDistributionType === 1 || obj.fxDistributionType === 2) &&
      (obj.affectFirst === 0 || obj.affectFirst === 1)
   );
}
function isValidFxEventBoxGroup(obj: types.wrapper.IWrapFxEventBoxGroup): boolean {
   return obj.boxes.every(isValidFxEventBox);
}

function run(args: ToolArgs): IToolOutput[] {
   const { colorNotes, bombNotes, obstacles, arcs, chains, rotationEvents } =
      args.beatmap.data.difficulty;
   const {
      basicEvents,
      waypoints,
      lightColorEventBoxGroups,
      lightRotationEventBoxGroups,
      lightTranslationEventBoxGroups,
      fxEventBoxGroups,
   } = args.beatmap.data.lightshow;

   let noteResult: types.wrapper.IWrapBaseObject[] = [];
   let obstacleResult: types.wrapper.IWrapBaseObject[] = [];
   let bombResult: types.wrapper.IWrapBaseObject[] = [];
   let arcResult: types.wrapper.IWrapBaseObject[] = [];
   let chainResult: types.wrapper.IWrapBaseObject[] = [];
   let rotationEventResult: types.wrapper.IWrapBaseObject[] = [];
   if (!args.beatmap.settings.customData._requirements?.includes('Mapping Extensions')) {
      if (args.beatmap.settings.customData._requirements?.includes('Noodle Extensions')) {
         const hasMEObstacle =
            args.beatmap.rawVersion === 2
               ? hasMappingExtensionsObstacleV2
               : hasMappingExtensionsObstacleV3;
         noteResult = colorNotes.filter(hasMappingExtensionsNote);
         obstacleResult = obstacles.filter(hasMEObstacle);
         bombResult = bombNotes.filter(hasMappingExtensionsBombNote);
         arcResult = arcs.filter(hasMappingExtensionsArc);
         chainResult = chains.filter(hasMappingExtensionsChain);
      } else {
         noteResult = colorNotes.filter((n) => !isValidColorNote(n));
         obstacleResult = obstacles.filter((o) => !isValidObstacle(o));
         bombResult = bombNotes.filter((b) => !isValidBombNote(b));
         arcResult = arcs.filter((s) => !isValidArc(s));
         chainResult = chains.filter((bs) => !isValidChain(bs));
         rotationEventResult = rotationEvents.filter((re) => !isValidRotationEvent(re));
      }
   }
   const waypointResult = waypoints.filter((e) => !isValidWaypoint(e));
   const eventResult = basicEvents.filter((e) => !isValidBasicEvent(e));
   const lightColorBoxResult = lightColorEventBoxGroups.filter(
      (e) => !isValidLightColorEventBoxGroup(e),
   );
   const lightRotationBoxResult = lightRotationEventBoxGroups.filter(
      (e) => !isValidLightRotationEventBoxGroup(e),
   );
   const lightTranslationBoxResult = lightTranslationEventBoxGroups.filter(
      (e) => !isValidLightTranslationEventBoxGroup(e),
   );
   const fxEventBoxResult = fxEventBoxGroups.filter((e) => !isValidFxEventBoxGroup(e));

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
   if (arcResult.length) {
      results.push({
         type: 'time',
         label: 'Invalid arc',
         value: arcResult,
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
   if (rotationEventResult.length) {
      results.push({
         type: 'time',
         label: 'Invalid rotation event',
         value: rotationEventResult,
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
