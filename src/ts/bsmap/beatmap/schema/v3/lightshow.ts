import type { ILightshow } from '../../../types/beatmap/v3/lightshow.ts';
import { basicEvent } from './basicEvent.ts';
import { colorBoostEvent } from './colorBoostEvent.ts';
import { lightColorEventBoxGroup } from './lightColorEventBoxGroup.ts';
import { lightRotationEventBoxGroup } from './lightRotationEventBoxGroup.ts';
import { lightTranslationEventBoxGroup } from './lightTranslationEventBoxGroup.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import { deepCopy } from '../../../utils/misc.ts';
import { fxEventBoxGroup } from './fxEventBoxGroup.ts';
import type { IWrapBeatmapAttribute } from '../../../types/beatmap/wrapper/beatmap.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';

const defaultValue = {
   version: '3.3.0',
   bpmEvents: [],
   rotationEvents: [],
   colorNotes: [],
   bombNotes: [],
   obstacles: [],
   sliders: [],
   burstSliders: [],
   waypoints: [],
   basicBeatmapEvents: [],
   colorBoostBeatmapEvents: [],
   lightColorEventBoxGroups: [],
   lightRotationEventBoxGroups: [],
   lightTranslationEventBoxGroups: [],
   vfxEventBoxGroups: [],
   _fxEventsCollection: { _fl: [], _il: [] },
   basicEventTypesWithKeywords: {
      d: [],
   },
   useNormalEventsAsCompatibleEvents: false,
   customData: {},
} as Required<ILightshow>;
export const lightshow: ISchemaContainer<IWrapBeatmapAttribute, ILightshow> = {
   defaultValue,
   serialize(data: IWrapBeatmapAttribute): ILightshow {
      const json: ILightshow = {
         basicBeatmapEvents: data.lightshow.basicEvents.map(basicEvent.serialize),
         colorBoostBeatmapEvents: data.lightshow.colorBoostEvents.map(colorBoostEvent.serialize),
         lightColorEventBoxGroups: data.lightshow.lightColorEventBoxGroups.map(
            lightColorEventBoxGroup.serialize,
         ),
         lightRotationEventBoxGroups: data.lightshow.lightRotationEventBoxGroups.map(
            lightRotationEventBoxGroup.serialize,
         ),
         lightTranslationEventBoxGroups: data.lightshow.lightTranslationEventBoxGroups.map(
            lightTranslationEventBoxGroup.serialize,
         ),
         vfxEventBoxGroups: [],
         _fxEventsCollection: {
            _fl: [],
            _il: [],
         },
         customData: deepCopy(data.customData),
      };
      for (const obj of data.lightshow.fxEventBoxGroups.map(fxEventBoxGroup.serialize)) {
         json.vfxEventBoxGroups!.push(obj.object);
         for (const box of obj.boxData) {
            obj.object.e!.push(box.data);
            for (const evt of box.eventData) {
               box.data.l!.push(json._fxEventsCollection!._fl!.length);
               json._fxEventsCollection!._fl!.push(evt);
            }
         }
      }

      return json;
   },
   deserialize(data: DeepPartial<ILightshow> = {}): DeepPartial<IWrapBeatmapAttribute> {
      const d: DeepPartial<IWrapBeatmapAttribute> = {
         version: 3,
         lightshow: {},
      };
      d.lightshow!.basicEvents = (data.basicBeatmapEvents ?? defaultValue.basicBeatmapEvents).map(
         basicEvent.deserialize,
      );
      d.lightshow!.colorBoostEvents = (
         data.colorBoostBeatmapEvents ?? defaultValue.colorBoostBeatmapEvents
      ).map(colorBoostEvent.deserialize);
      d.lightshow!.lightColorEventBoxGroups = (
         data.lightColorEventBoxGroups ?? defaultValue.lightColorEventBoxGroups
      ).map(lightColorEventBoxGroup.deserialize);
      d.lightshow!.lightRotationEventBoxGroups = (
         data.lightRotationEventBoxGroups ?? defaultValue.lightRotationEventBoxGroups
      ).map(lightRotationEventBoxGroup.deserialize);
      d.lightshow!.lightTranslationEventBoxGroups = (
         data.lightTranslationEventBoxGroups ?? defaultValue.lightTranslationEventBoxGroups
      ).map(lightTranslationEventBoxGroup.deserialize);
      const fx = data._fxEventsCollection?._fl ?? defaultValue._fxEventsCollection._fl!;
      d.lightshow!.fxEventBoxGroups = (
         data.vfxEventBoxGroups ?? defaultValue.vfxEventBoxGroups
      ).map((obj) =>
         fxEventBoxGroup.deserialize({
            object: obj,
            boxData: obj.e?.map((box) => ({
               data: box,
               eventData: box.l?.map((idx) => fx[idx]),
            })),
         }),
      );
      d.customData = deepCopy(data.customData ?? defaultValue.customData);
      return d;
   },
};
