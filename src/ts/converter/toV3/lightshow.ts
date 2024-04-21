import logger from '../../logger.ts';
import { Difficulty as V1Difficulty } from '../../beatmap/v1/difficulty.ts';
import { Difficulty as V2Difficulty } from '../../beatmap/v2/difficulty.ts';
import { Difficulty as V3Difficulty } from '../../beatmap/v3/difficulty.ts';
import { Difficulty as V4Difficulty } from '../../beatmap/v4/difficulty.ts';
import { Lightshow as V3Lightshow } from '../../beatmap/v3/lightshow.ts';
import { Lightshow as V4Lightshow } from '../../beatmap/v4/lightshow.ts';
import type { IWrapDifficulty } from '../../types/beatmap/wrapper/difficulty.ts';
import type { IWrapLightshow } from '../../types/beatmap/wrapper/lightshow.ts';
import { deepCopy } from '../../utils/misc.ts';
import eventToV3 from '../customData/eventToV3.ts';
import { BasicEventTypesWithKeywords } from '../../beatmap/v3/basicEventTypesWithKeywords.ts';

function tag(name: string): string[] {
   return ['convert', 'toV3Lightshow', name];
}

export function toV3Lightshow(data: IWrapLightshow | IWrapDifficulty): V3Lightshow {
   logger.tWarn(tag('main'), 'Converting to beatmap v3 may lose certain data!');

   let template = new V3Lightshow();
   template.filename = data.filename;

   switch (true) {
      case data instanceof V1Difficulty:
         fromV1Difficulty(template, data as V1Difficulty);
         break;
      case data instanceof V2Difficulty:
         fromV2Difficulty(template, data as V2Difficulty);
         break;
      case data instanceof V3Difficulty:
         fromV3Difficulty(template, data as V3Difficulty);
         break;
      case data instanceof V4Difficulty:
         // it really doesnt have anything to do with lightshow
         template.customData = deepCopy(data.customData);
         break;
      case data instanceof V3Lightshow:
         template = new V3Lightshow(data);
         break;
      case data instanceof V4Lightshow:
         fromV4Lightshow(template, data as V4Lightshow);
         break;
      default:
         logger.tWarn(tag('main'), 'Unknown beatmap data, returning empty template');
   }

   return template;
}

function fromV1Difficulty(template: V3Lightshow, data: V1Difficulty) {
   data.basicEvents.forEach((e) => {
      if (e.isColorBoost()) {
         template.addColorBoostEvents({
            time: e.time,
            toggle: e.value ? true : false,
         });
      } else {
         template.addBasicEvents(e);
      }
   });
}

function fromV2Difficulty(template: V3Lightshow, data: V2Difficulty) {
   data.basicEvents.forEach((e, i) => {
      if (e.isColorBoost()) {
         template.addColorBoostEvents({
            time: e.time,
            toggle: e.value ? true : false,
         });
      } else {
         const customData = eventToV3(e.customData);
         if (e.isLightEvent()) {
            if (e.customData._propID) {
               logger.tWarn(
                  tag('fromV2Difficulty'),
                  `events[${i}] at time ${e.time} Chroma _propID will be removed.`,
               );
            }
            if (e.customData._lightGradient) {
               logger.tWarn(
                  tag('fromV2Difficulty'),
                  `events[${i}] at time ${e.time} Chroma _lightGradient will be removed.`,
               );
            }
         }
         if (e.isRingEvent()) {
            if (e.customData._reset) {
               logger.tWarn(
                  tag('fromV2Difficulty'),
                  `events[${i}] at time ${e.time} Chroma _reset will be removed.`,
               );
            }
            if (e.customData._counterSpin) {
               logger.tWarn(
                  tag('fromV2Difficulty'),
                  `events[${i}] at time ${e.time} Chroma _counterSpin will be removed.`,
               );
            }
            if (e.customData._stepMult || e.customData._propMult || e.customData._speedMult) {
               logger.tWarn(
                  tag('fromV2Difficulty'),
                  `events[${i}] at time ${e.time} Chroma _mult will be removed.`,
               );
            }
         }
         template.addBasicEvents({
            time: e.time,
            type: e.type,
            value: e.value,
            floatValue: e.floatValue,
            customData,
         });
      }
   });
   template.eventTypesWithKeywords = new BasicEventTypesWithKeywords(data.eventTypesWithKeywords);
   template.customData = deepCopy(data.customData);
}

function fromV3Difficulty(template: V3Lightshow, data: V3Difficulty) {
   template.addBasicEvents(...data.basicEvents);
   template.addColorBoostEvents(...data.colorBoostEvents);
   template.addLightColorEventBoxGroups(...data.lightColorEventBoxGroups);
   template.addLightRotationEventBoxGroups(...data.lightRotationEventBoxGroups);
   template.addLightTranslationEventBoxGroups(...data.lightTranslationEventBoxGroups);
   template.addFxEventBoxGroups(...data.fxEventBoxGroups);
   template.eventTypesWithKeywords = data.eventTypesWithKeywords.clone();
   template.customData = deepCopy(data.customData);
}

function fromV4Lightshow(template: V3Lightshow, data: V4Lightshow) {
   template.addBasicEvents(...data.basicEvents);
   template.addColorBoostEvents(...data.colorBoostEvents);
   template.addLightColorEventBoxGroups(...data.lightColorEventBoxGroups);
   template.addLightRotationEventBoxGroups(...data.lightRotationEventBoxGroups);
   template.addLightTranslationEventBoxGroups(...data.lightTranslationEventBoxGroups);
   template.addFxEventBoxGroups(...data.fxEventBoxGroups);
   template.eventTypesWithKeywords = new BasicEventTypesWithKeywords(data.eventTypesWithKeywords);
   template.customData = deepCopy(data.customData);
}
