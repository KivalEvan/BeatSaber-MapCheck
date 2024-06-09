import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { ILightshow } from '../../../types/beatmap/v4/lightshow.ts';
import { waypoint } from './waypoint.ts';
import { basicEvent } from './basicEvent.ts';
import { colorBoostEvent } from './colorBoostEvent.ts';
import { lightColorEventBoxGroup } from './lightColorEventBoxGroup.ts';
import { lightRotationEventBoxGroup } from './lightRotationEventBoxGroup.ts';
import { lightTranslationEventBoxGroup } from './lightTranslationEventBoxGroup.ts';
import { fxEventBoxGroup } from './fxEventBoxGroup.ts';
import type { DeepPartial, DeepRequiredIgnore } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { EventBoxType } from '../../../types/beatmap/shared/constants.ts';
import type { IObject } from '../../../types/beatmap/v4/object.ts';
import type { IWrapBeatmapAttribute } from '../../../types/beatmap/wrapper/beatmap.ts';
import { eventTypesWithKeywords } from '../v3/eventTypesWithKeywords.ts';

const defaultValue = {
   version: '4.0.0',
   waypoints: [],
   waypointsData: [],
   basicEvents: [],
   basicEventsData: [],
   colorBoostEvents: [],
   colorBoostEventsData: [],
   eventBoxGroups: [],
   indexFilters: [],
   lightColorEvents: [],
   lightColorEventBoxes: [],
   lightRotationEvents: [],
   lightRotationEventBoxes: [],
   lightTranslationEvents: [],
   lightTranslationEventBoxes: [],
   floatFxEvents: [],
   fxEventBoxes: [],
   basicEventTypesWithKeywords: {
      ...eventTypesWithKeywords.defaultValue,
   },
   useNormalEventsAsCompatibleEvents: false,
   customData: {},
} as DeepRequiredIgnore<ILightshow, 'customData'>;
export const lightshow: ISchemaContainer<IWrapBeatmapAttribute, ILightshow> = {
   defaultValue,
   serialize(data: IWrapBeatmapAttribute): ILightshow {
      const json: Required<ILightshow> = {
         version: '4.0.0',
         waypoints: [],
         waypointsData: [],
         basicEvents: [],
         basicEventsData: [],
         colorBoostEvents: [],
         colorBoostEventsData: [],
         eventBoxGroups: [],
         indexFilters: [],
         lightColorEventBoxes: [],
         lightColorEvents: [],
         lightRotationEventBoxes: [],
         lightRotationEvents: [],
         lightTranslationEventBoxes: [],
         lightTranslationEvents: [],
         fxEventBoxes: [],
         floatFxEvents: [],
         basicEventTypesWithKeywords: eventTypesWithKeywords.serialize(
            data.lightshow.eventTypesWithKeywords,
         ),
         useNormalEventsAsCompatibleEvents: data.lightshow.useNormalEventsAsCompatibleEvents,
         customData: deepCopy(data.customData),
      };
      for (const jsonObj of data.lightshow.waypoints.map(waypoint.serialize)) {
         json.waypoints.push(jsonObj.object);
         jsonObj.object.i = json.waypointsData.length;
         json.waypointsData.push(jsonObj.data);
      }
      for (const jsonObj of data.lightshow.basicEvents.map(basicEvent.serialize)) {
         json.basicEvents.push(jsonObj.object);
         jsonObj.object.i = json.basicEventsData.length;
         json.basicEventsData.push(jsonObj.data);
      }
      for (const jsonObj of data.lightshow.colorBoostEvents.map(colorBoostEvent.serialize)) {
         json.colorBoostEvents.push(jsonObj.object);
         jsonObj.object.i = json.colorBoostEventsData.length;
         json.colorBoostEventsData.push(jsonObj.data);
      }
      for (const obj of data.lightshow.lightColorEventBoxGroups.map(
         lightColorEventBoxGroup.serialize,
      )) {
         json.eventBoxGroups.push(obj.object);
         for (const box of obj.boxData) {
            const list: IObject[] = [];
            for (const evt of box.eventData) {
               list.push({
                  b: evt.time,
                  i: json.lightColorEvents.length,
               });
               json.lightColorEvents.push(evt.data);
            }
            obj.object.e!.push({
               e: json.lightColorEventBoxes.length,
               f: json.indexFilters.length,
               l: list,
               customData: {},
            });
            json.lightColorEventBoxes.push(box.data);
            json.indexFilters.push(box.filterData);
         }
      }
      for (const obj of data.lightshow.lightRotationEventBoxGroups.map(
         lightRotationEventBoxGroup.serialize,
      )) {
         json.eventBoxGroups.push(obj.object);
         for (const box of obj.boxData) {
            const list: IObject[] = [];
            for (const evt of box.eventData) {
               list.push({
                  b: evt.time,
                  i: json.lightRotationEvents.length,
               });
               json.lightRotationEvents.push(evt.data);
            }
            obj.object.e!.push({
               e: json.lightRotationEventBoxes.length,
               f: json.indexFilters.length,
               l: list,
               customData: {},
            });
            json.lightRotationEventBoxes.push(box.data);
            json.indexFilters.push(box.filterData);
         }
      }
      for (const obj of data.lightshow.lightTranslationEventBoxGroups.map(
         lightTranslationEventBoxGroup.serialize,
      )) {
         json.eventBoxGroups.push(obj.object);
         for (const box of obj.boxData) {
            const list: IObject[] = [];
            for (const evt of box.eventData) {
               list.push({
                  b: evt.time,
                  i: json.lightTranslationEvents.length,
               });
               json.lightTranslationEvents.push(evt.data);
            }
            obj.object.e!.push({
               e: json.lightTranslationEventBoxes.length,
               f: json.indexFilters.length,
               l: list,
               customData: {},
            });
            json.lightTranslationEventBoxes.push(box.data);
            json.indexFilters.push(box.filterData);
         }
      }
      for (const obj of data.lightshow.fxEventBoxGroups.map(fxEventBoxGroup.serialize)) {
         json.eventBoxGroups.push(obj.object);
         for (const box of obj.boxData) {
            const list: IObject[] = [];
            for (const evt of box.eventData) {
               list.push({ b: evt.time, i: json.floatFxEvents.length });
               json.floatFxEvents.push(evt.data);
            }
            obj.object.e!.push({
               e: json.fxEventBoxes.length,
               f: json.indexFilters.length,
               l: list,
               customData: {},
            });
            json.fxEventBoxes.push(box.data);
            json.indexFilters.push(box.filterData);
         }
      }

      return json;
   },
   deserialize(data: DeepPartial<ILightshow> = {}): DeepPartial<IWrapBeatmapAttribute> {
      const d: DeepPartial<IWrapBeatmapAttribute> = {
         version: 4,
         lightshow: {
            lightColorEventBoxGroups: [],
            lightRotationEventBoxGroups: [],
            lightTranslationEventBoxGroups: [],
            fxEventBoxGroups: [],
         },
      };
      d.lightshow!.waypoints = (data?.waypoints ?? []).map((obj) =>
         waypoint.deserialize({
            object: obj,
            data: data?.waypointsData?.[obj?.i || 0],
         }),
      );
      d.lightshow!.basicEvents = (data?.basicEvents ?? []).map((obj) =>
         basicEvent.deserialize({
            object: obj,
            data: data?.basicEventsData?.[obj?.i || 0],
         }),
      );
      d.lightshow!.colorBoostEvents = (data?.colorBoostEvents ?? []).map((obj) =>
         colorBoostEvent.deserialize({
            object: obj,
            data: data?.colorBoostEventsData?.[obj?.i || 0],
         }),
      );
      const indFil = data?.indexFilters ?? [];
      const lceb = data?.lightColorEventBoxes ?? [];
      const lce = data?.lightColorEvents ?? [];
      const lreb = data?.lightRotationEventBoxes ?? [];
      const lre = data?.lightRotationEvents ?? [];
      const lteb = data?.lightTranslationEventBoxes ?? [];
      const lte = data?.lightTranslationEvents ?? [];
      const fxb = data?.fxEventBoxes ?? [];
      const fx = data?.floatFxEvents ?? [];
      for (const ebg of data?.eventBoxGroups || []) {
         const t = ebg?.t || 0;
         switch (t) {
            case EventBoxType.COLOR:
               d.lightshow!.lightColorEventBoxGroups!.push(
                  lightColorEventBoxGroup.deserialize({
                     object: ebg,
                     boxData: ebg?.e?.map((e) => ({
                        data: lceb[e.e || 0],
                        filterData: indFil[e.f || 0],
                        eventData: e.l?.map((l) => ({
                           time: l.b,
                           data: lce[l.i || 0],
                        })),
                     })),
                  }),
               );
               break;
            case EventBoxType.ROTATION:
               d.lightshow!.lightRotationEventBoxGroups!.push(
                  lightRotationEventBoxGroup.deserialize({
                     object: ebg,
                     boxData: ebg?.e?.map((e) => ({
                        data: lreb[e.e || 0],
                        filterData: indFil[e.f || 0],
                        eventData: e.l?.map((l) => ({
                           time: l.b,
                           data: lre[l.i || 0],
                        })),
                     })),
                  }),
               );
               break;
            case EventBoxType.TRANSLATION:
               d.lightshow!.lightTranslationEventBoxGroups!.push(
                  lightTranslationEventBoxGroup.deserialize({
                     object: ebg,
                     boxData: ebg?.e?.map((e) => ({
                        data: lteb[e.e || 0],
                        filterData: indFil[e.f || 0],
                        eventData: e.l?.map((l) => ({
                           time: l.b,
                           data: lte[l.i || 0],
                        })),
                     })),
                  }),
               );
               break;
            case EventBoxType.FX_FLOAT:
               d.lightshow!.fxEventBoxGroups!.push(
                  fxEventBoxGroup.deserialize({
                     object: ebg,
                     boxData: ebg?.e?.map((e) => ({
                        data: fxb[e.e || 0],
                        filterData: indFil[e.f || 0],
                        eventData: e.l?.map((l) => ({
                           time: l.b,
                           data: fx[l.i || 0],
                        })),
                     })),
                  }),
               );
               break;
         }
      }
      d.lightshow!.eventTypesWithKeywords = eventTypesWithKeywords.deserialize(
         data?.basicEventTypesWithKeywords || defaultValue.basicEventTypesWithKeywords,
      );
      d.lightshow!.useNormalEventsAsCompatibleEvents = !!(
         data?.useNormalEventsAsCompatibleEvents ?? defaultValue.useNormalEventsAsCompatibleEvents
      );
      d.lightshow!.customData = deepCopy(data?.customData ?? {});
      return d;
   },
};
