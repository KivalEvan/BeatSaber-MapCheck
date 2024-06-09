import { round } from '../../../../utils/math.ts';
import type { IOptimizeOptions } from '../../../../types/beatmap/options/optimize.ts';
import type { ILightshow } from '../../../../types/beatmap/v4/lightshow.ts';
import { deepClean, purgeZeros, remapDedupe } from '../../../helpers/optimize.ts';
import { EventBoxType } from '../../../shared/constants.ts';

export function optimizeLightshow(data: ILightshow, options: IOptimizeOptions) {
   if (options.deduplicate) {
      const [newBasicEventsData, remapBasicEventsIdx] = remapDedupe(data.basicEventsData);
      const [newColorBoostEventsData, remapColorBoostEventsIdx] = remapDedupe(
         data.colorBoostEventsData,
      );
      const [newWaypointsData, remapWaypointsIdx] = remapDedupe(data.waypointsData);
      const [newIndexFilters, remapIndexFiltersIdx] = remapDedupe(data.indexFilters);
      const [newLightColorEventBoxes, remapLightColorEventBoxesIdx] = remapDedupe(
         data.lightColorEventBoxes,
      );
      const [newLightColorEvents, remapLightColorEventsIdx] = remapDedupe(data.lightColorEvents);
      const [newLightRotationEventBoxes, remapLightRotationEventBoxesIdx] = remapDedupe(
         data.lightRotationEventBoxes,
      );
      const [newLightRotationEvents, remapLightRotationEventsIdx] = remapDedupe(
         data.lightRotationEvents,
      );
      const [newLightTranslationEventBoxes, remapLightTranslationEventBoxesIdx] = remapDedupe(
         data.lightTranslationEventBoxes,
      );
      const [newLightTranslationEvents, remapLightTranslationEventsIdx] = remapDedupe(
         data.lightTranslationEvents,
      );
      const [newFxEventBoxes, remapFxEventBoxesIdx] = remapDedupe(data.fxEventBoxes);
      const [newFloatFxEvents, remapFloatFxEventsIdx] = remapDedupe(data.floatFxEvents);

      data.basicEvents.forEach((d) => (d.i = remapBasicEventsIdx.get(d.i!)));
      data.colorBoostEvents.forEach((d) => (d.i = remapColorBoostEventsIdx.get(d.i!)));
      data.waypoints.forEach((d) => (d.i = remapWaypointsIdx.get(d.i!)));
      for (const ebg of data.eventBoxGroups) {
         for (const evt of ebg.e!) {
            evt.f = remapIndexFiltersIdx.get(evt.f!);
            switch (ebg.t) {
               case EventBoxType.COLOR:
                  evt.e = remapLightColorEventBoxesIdx.get(evt.e!);
                  evt.l?.forEach((l) => (l.i = remapLightColorEventsIdx.get(l.i!)));
                  break;
               case EventBoxType.ROTATION:
                  evt.e = remapLightRotationEventBoxesIdx.get(evt.e!);
                  evt.l?.forEach((l) => (l.i = remapLightRotationEventsIdx.get(l.i!)));
                  break;
               case EventBoxType.TRANSLATION:
                  evt.e = remapLightTranslationEventBoxesIdx.get(evt.e!);
                  evt.l?.forEach((l) => (l.i = remapLightTranslationEventsIdx.get(l.i!)));
                  break;
               case EventBoxType.FX_FLOAT:
                  evt.e = remapFxEventBoxesIdx.get(evt.e!);
                  evt.l?.forEach((l) => (l.i = remapFloatFxEventsIdx.get(l.i!)));
            }
         }
      }

      data.basicEventsData = newBasicEventsData;
      data.colorBoostEventsData = newColorBoostEventsData;
      data.waypointsData = newWaypointsData;
      data.indexFilters = newIndexFilters;
      data.lightColorEventBoxes = newLightColorEventBoxes;
      data.lightColorEvents = newLightColorEvents;
      data.lightRotationEventBoxes = newLightRotationEventBoxes;
      data.lightRotationEvents = newLightRotationEvents;
      data.lightTranslationEventBoxes = newLightTranslationEventBoxes;
      data.lightTranslationEvents = newLightTranslationEvents;
      data.fxEventBoxes = newFxEventBoxes;
      data.floatFxEvents = newFloatFxEvents;
   }

   for (let i = 0; i < data.waypoints.length; i++) {
      const o = data.waypoints[i];
      if (options.floatTrim) {
         o.b = round(o.b!, options.floatTrim);
         o.r = round(o.r!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.waypoints[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.waypointsData.length; i++) {
      const o = data.waypointsData[i];
      deepClean(o.customData!, `difficulty.waypointsData[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.basicEvents.length; i++) {
      const o = data.basicEvents[i];
      if (options.floatTrim) {
         o.b = round(o.b!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.basicEvents[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.basicEventsData.length; i++) {
      const o = data.basicEventsData[i];
      if (options.floatTrim) {
         o.f = round(o.f!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.basicEventsData[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.colorBoostEvents.length; i++) {
      const o = data.colorBoostEvents[i];
      if (options.floatTrim) {
         o.b = round(o.b!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.colorBoostEvents[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.colorBoostEventsData.length; i++) {
      const o = data.colorBoostEventsData[i];
      deepClean(o.customData!, `difficulty.colorBoostEventsData[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.eventBoxGroups.length; i++) {
      const o = data.eventBoxGroups[i];
      if (options.floatTrim) {
         o.b = round(o.b!, options.floatTrim);
      }
      for (let j = 0; j < o.e!.length; j++) {
         const o2 = o.e![j];
         deepClean(o2.customData!, `lightshow.eventBoxGroups[${i}].e[${j}].customData`, options);
         if (!Object.keys(o2.customData!).length) {
            delete o2.customData;
         }
         if (options.purgeZeros) purgeZeros(o2);
         for (let k = 0; k < o2.l!.length; k++) {
            const o3 = o2.l![k];
            if (options.floatTrim) {
               o3.b = round(o3.b!, options.floatTrim);
            }
            if (options.purgeZeros) purgeZeros(o3);
         }
      }
      deepClean(o.customData!, `difficulty.eventBoxGroups[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.indexFilters.length; i++) {
      const o = data.indexFilters[i];
      if (options.floatTrim) {
         o.l = round(o.l!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.indexFilters[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.lightColorEventBoxes.length; i++) {
      const o = data.lightColorEventBoxes[i];
      if (options.floatTrim) {
         o.s = round(o.s!, options.floatTrim);
         o.w = round(o.w!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.lightColorEventBoxes[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.lightColorEvents.length; i++) {
      const o = data.lightColorEvents[i];
      if (options.floatTrim) {
         o.b = round(o.b!, options.floatTrim);
         o.sb = round(o.sb!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.lightColorEvents[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.lightRotationEventBoxes.length; i++) {
      const o = data.lightRotationEventBoxes[i];
      if (options.floatTrim) {
         o.s = round(o.s!, options.floatTrim);
         o.w = round(o.w!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.lightRotationEventBoxes[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.lightRotationEvents.length; i++) {
      const o = data.lightRotationEvents[i];
      if (options.floatTrim) {
         o.r = round(o.r!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.lightRotationEvents[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.lightTranslationEventBoxes.length; i++) {
      const o = data.lightTranslationEventBoxes[i];
      if (options.floatTrim) {
         o.s = round(o.s!, options.floatTrim);
         o.w = round(o.w!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.lightTranslationEventBoxes[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.lightTranslationEvents.length; i++) {
      const o = data.lightTranslationEvents[i];
      if (options.floatTrim) {
         o.t = round(o.t!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.lightTranslationEvents[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.fxEventBoxes.length; i++) {
      const o = data.fxEventBoxes[i];
      if (options.floatTrim) {
         o.s = round(o.s!, options.floatTrim);
         o.w = round(o.w!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.fxEventBoxes[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (let i = 0; i < data.floatFxEvents.length; i++) {
      const o = data.floatFxEvents[i];
      if (options.floatTrim) {
         o.v = round(o.v!, options.floatTrim);
      }
      deepClean(o.customData!, `difficulty.floatFxEvents[${i}].customData`, options);
      if (!Object.keys(o.customData!).length) {
         delete o.customData;
      }
      if (options.purgeZeros) purgeZeros(o);
   }
   for (const o1 of data.basicEventTypesWithKeywords.d!) {
      if (options.stringTrim) {
         o1.k = o1.k!.trim();
      }
   }
   deepClean(data.customData!, `lightshow.customData`, options);
   if (!Object.keys(data.customData!).length) {
      delete data.customData;
   }
}
