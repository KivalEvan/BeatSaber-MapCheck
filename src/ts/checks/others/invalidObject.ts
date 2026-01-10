import {
   Arc,
   BasicEvent,
   BombNote,
   Chain,
   ColorBoostEvent,
   ColorNote,
   FxEventBoxGroup,
   hasMappingExtensionsArc,
   hasMappingExtensionsBombNote,
   hasMappingExtensionsChain,
   hasMappingExtensionsNote,
   hasMappingExtensionsObstacleV2,
   hasMappingExtensionsObstacleV3,
   isInverseSlider,
   isNegativeValueObstacle,
   isOldChromaEventValue,
   isValidEventType,
   isZeroValueObstacle,
   LightColorEventBoxGroup,
   LightRotationEventBoxGroup,
   LightTranslationEventBoxGroup,
   LimitAlsoAffectsType,
   Obstacle,
   RandomType,
   Waypoint,
   wrapper,
} from 'bsmap';
import {
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   ICheck,
   ICheckOutput,
   OutputStatus,
   OutputType,
} from '../../types';
import { UIInput } from '../../ui/helpers/input';

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

const tool: ICheck = {
   name,
   description,
   type: CheckType.OTHER,
   order: {
      input: CheckInputOrder.OTHERS_INVALID_OBJECT,
      output: CheckOutputOrder.OTHERS_INVALID_OBJECT,
   },
   input: {
      params: { enabled },
      ui: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

function isValidBaseNote(obj: wrapper.IWrapBaseNote): boolean {
   return obj.direction >= 0 && obj.direction <= 8;
}
function isValidIndexFilter(obj: wrapper.IWrapIndexFilter): boolean {
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
function isValidEventBox(obj: wrapper.IWrapEventBox): boolean {
   return (
      (obj.beatDistributionType === 1 || obj.beatDistributionType === 2) &&
      obj.easing >= -1 &&
      obj.easing <= 103 &&
      isValidIndexFilter(obj.filter)
   );
}
function isValidEventBoxGroup(obj: wrapper.IWrapEventBoxGroup): boolean {
   return obj.boxes.every(isValidEventBox);
}
function isValidColorNote(obj: wrapper.IWrapColorNote): boolean {
   return isValidBaseNote(obj) && obj.posX >= 0 && obj.posX <= 3 && obj.posY >= 0 && obj.posY <= 2;
}
function isValidObstacle(obj: wrapper.IWrapObstacle): boolean {
   return !isZeroValueObstacle(obj) && !isNegativeValueObstacle(obj);
}
function isValidBombNote(obj: wrapper.IWrapBombNote): boolean {
   return isValidBaseNote(obj) && obj.posX >= 0 && obj.posX <= 3 && obj.posY >= 0 && obj.posY <= 2;
}
function isValidArc(obj: wrapper.IWrapArc): boolean {
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
function isValidChain(obj: wrapper.IWrapChain): boolean {
   return (
      isValidBaseNote(obj) &&
      (!isInverseSlider(obj) ||
         obj.posY >= 0 ||
         obj.posY <= 2 ||
         obj.tailPosY >= 0 ||
         obj.tailPosY <= 2)
   );
}
function isValidRotationEvent(obj: wrapper.IWrapRotationEvent): boolean {
   return obj.executionTime === 0 || obj.executionTime === 1;
}
function isValidWaypoint(obj: wrapper.IWrapWaypoint): boolean {
   return obj.direction >= 0 && obj.direction <= 9 && obj.direction !== (8 as 0);
}
function isValidBasicEvent(obj: wrapper.IWrapBasicEvent): boolean {
   return isValidEventType(obj.type);
}
function isValidLightColorEvent(obj: wrapper.IWrapLightColorEvent): boolean {
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
function isValidLightColorEventBox(obj: wrapper.IWrapLightColorEventBox): boolean {
   return (
      obj.events.every(isValidLightColorEvent) &&
      (obj.brightnessDistributionType === 1 || obj.brightnessDistributionType === 2) &&
      (obj.affectFirst === 0 || obj.affectFirst === 1)
   );
}
function isValidLightColorEventBoxGroup(obj: wrapper.IWrapLightColorEventBoxGroup): boolean {
   return obj.boxes.every(isValidLightColorEventBox);
}
function isValidLightRotationEvent(obj: wrapper.IWrapLightRotationEvent): boolean {
   return (
      (obj.previous === 0 || obj.previous === 1) &&
      obj.easing >= -1 &&
      obj.easing <= 103 &&
      obj.loop >= 0 &&
      obj.direction >= 0 &&
      obj.direction <= 2
   );
}
function isValidLightRotationEventBox(obj: wrapper.IWrapLightRotationEventBox): boolean {
   return (
      obj.events.every(isValidLightRotationEvent) &&
      (obj.rotationDistributionType === 1 || obj.rotationDistributionType === 2) &&
      (obj.axis === 0 || obj.axis === 1 || obj.axis === 2) &&
      (obj.flip === 0 || obj.flip === 1) &&
      (obj.affectFirst === 0 || obj.affectFirst === 1)
   );
}
function isValidLightRotationEventBoxGroup(obj: wrapper.IWrapLightRotationEventBoxGroup): boolean {
   return obj.boxes.every(isValidLightRotationEventBox);
}
function isValidLightTranslationEvent(obj: wrapper.IWrapLightTranslationEvent): boolean {
   return (obj.previous === 0 || obj.previous === 1) && obj.easing >= -1 && obj.easing <= 103;
}
function isValidLightTranslationEventBox(obj: wrapper.IWrapLightTranslationEventBox): boolean {
   return (
      obj.events.every(isValidLightTranslationEvent) &&
      (obj.gapDistributionType === 1 || obj.gapDistributionType === 2) &&
      (obj.axis === 0 || obj.axis === 1 || obj.axis === 2) &&
      (obj.flip === 0 || obj.flip === 1) &&
      (obj.affectFirst === 0 || obj.affectFirst === 1)
   );
}
function isValidLightTranslationEventBoxGroup(
   obj: wrapper.IWrapLightTranslationEventBoxGroup,
): boolean {
   return obj.boxes.every(isValidLightTranslationEventBox);
}
function isValidFxFloatEvent(obj: wrapper.IWrapFxEventFloat): boolean {
   return (obj.previous === 0 || obj.previous === 1) && obj.easing >= -1 && obj.easing <= 103;
}
function isValidFxIntEvent(obj: wrapper.IWrapFxEventInt): boolean {
   return obj.previous === 0 || obj.previous === 1;
}
function isValidFxEventBox(obj: wrapper.IWrapFxEventBox): boolean {
   return (
      obj.events.every(isValidFxFloatEvent) &&
      (obj.fxDistributionType === 1 || obj.fxDistributionType === 2) &&
      (obj.affectFirst === 0 || obj.affectFirst === 1)
   );
}
function isValidFxEventBoxGroup(obj: wrapper.IWrapFxEventBoxGroup): boolean {
   return obj.boxes.every(isValidFxEventBox);
}

function run(args: CheckArgs): ICheckOutput[] {
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

   let noteResult: wrapper.IWrapBaseObject[] = [];
   let obstacleResult: wrapper.IWrapBaseObject[] = [];
   let bombResult: wrapper.IWrapBaseObject[] = [];
   let arcResult: wrapper.IWrapBaseObject[] = [];
   let chainResult: wrapper.IWrapBaseObject[] = [];
   let rotationEventResult: wrapper.IWrapBaseObject[] = [];
   if (!args.beatmap.info.customData._requirements?.includes('Mapping Extensions')) {
      if (args.beatmap.info.customData._requirements?.includes('Noodle Extensions')) {
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

   const results: ICheckOutput[] = [];
   if (noteResult.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Invalid note',
         type: OutputType.TIME,
         value: noteResult,
      });
   }
   if (bombResult.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Invalid bomb',
         type: OutputType.TIME,
         value: bombResult,
      });
   }
   if (arcResult.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Invalid arc',
         type: OutputType.TIME,
         value: arcResult,
      });
   }
   if (chainResult.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Invalid chain',
         type: OutputType.TIME,
         value: chainResult,
      });
   }
   if (obstacleResult.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Invalid obstacle',
         type: OutputType.TIME,
         value: obstacleResult,
      });
   }
   if (rotationEventResult.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Invalid rotation event',
         type: OutputType.TIME,
         value: rotationEventResult,
      });
   }
   if (waypointResult.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Invalid waypoint',
         type: OutputType.TIME,
         value: waypointResult,
      });
   }
   if (eventResult.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Invalid event',
         type: OutputType.TIME,
         value: eventResult,
      });
   }
   if (lightColorBoxResult.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Invalid light color event',
         type: OutputType.TIME,
         value: lightColorBoxResult,
      });
   }
   if (lightRotationBoxResult.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Invalid light rotation event',
         type: OutputType.TIME,
         value: lightRotationBoxResult,
      });
   }
   if (lightTranslationBoxResult.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Invalid light translation event',
         type: OutputType.TIME,
         value: lightTranslationBoxResult,
      });
   }
   if (fxEventBoxResult.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Invalid FX event',
         type: OutputType.TIME,
         value: fxEventBoxResult,
      });
   }

   return results;
}

export default tool;
