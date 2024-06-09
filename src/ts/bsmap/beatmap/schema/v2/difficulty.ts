import type { IDifficulty } from '../../../types/beatmap/v2/difficulty.ts';
import { colorNote } from './colorNote.ts';
import { arc } from './arc.ts';
import { obstacle } from './obstacle.ts';
import { basicEvent } from './basicEvent.ts';
import { waypoint } from './waypoint.ts';
import { deepCopy } from '../../../utils/misc.ts';
import type { IWrapColorBoostEventAttribute } from '../../../types/beatmap/wrapper/colorBoostEvent.ts';
import type { IWrapBombNoteAttribute } from '../../../types/beatmap/wrapper/bombNote.ts';
import type { IWrapBPMEventAttribute } from '../../../types/beatmap/wrapper/bpmEvent.ts';
import type { IWrapColorNoteAttribute } from '../../../types/beatmap/wrapper/colorNote.ts';
import type { IWrapEventAttribute } from '../../../types/beatmap/wrapper/event.ts';
import type { IWrapRotationEventAttribute } from '../../../types/beatmap/wrapper/rotationEvent.ts';
import type { IWrapBeatmapAttribute } from '../../../types/beatmap/wrapper/beatmap.ts';
import type { DeepPartial } from '../../../types/utils.ts';
import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import { eventTypesWithKeywords } from './eventTypesWithKeywords.ts';
import { bombNote } from './bombNote.ts';
import { colorBoostEvent } from './colorBoostEvent.ts';
import { rotationEvent } from './rotationEvent.ts';
import { bpmEvent } from './bpmEvent.ts';
import { sortV2NoteFn, sortV2ObjectFn } from '../../helpers/sort.ts';

const defaultValue = {
   _version: '2.6.0',
   _notes: [],
   _sliders: [],
   _obstacles: [],
   _events: [],
   _waypoints: [],
   _specialEventsKeywordFilters: {},
   _customData: {},
} as Required<IDifficulty>;
export const difficulty: ISchemaContainer<IWrapBeatmapAttribute, IDifficulty> = {
   defaultValue,
   serialize(data: IWrapBeatmapAttribute): IDifficulty {
      return {
         _version: '2.6.0',
         _notes: [
            ...data.difficulty.colorNotes.map(colorNote.serialize),
            ...data.difficulty.bombNotes.map(bombNote.serialize),
         ].sort(sortV2NoteFn),
         _sliders: data.difficulty.arcs.map(arc.serialize),
         _obstacles: data.difficulty.obstacles.map(obstacle.serialize),
         _events: [
            ...data.lightshow.basicEvents.map(basicEvent.serialize),
            ...data.lightshow.colorBoostEvents.map(colorBoostEvent.serialize),
            ...data.difficulty.rotationEvents.map(rotationEvent.serialize),
            ...data.difficulty.bpmEvents.map(bpmEvent.serialize),
         ].sort(sortV2ObjectFn),
         _waypoints: data.lightshow.waypoints.map(waypoint.serialize),
         _specialEventsKeywordFilters: eventTypesWithKeywords.serialize(
            data.lightshow.eventTypesWithKeywords,
         ),
         _customData: deepCopy(data.difficulty.customData),
      };
   },
   deserialize(data: DeepPartial<IDifficulty> = {}): DeepPartial<IWrapBeatmapAttribute> {
      const colorNotes: Partial<IWrapColorNoteAttribute>[] = [];
      const bombNotes: Partial<IWrapBombNoteAttribute>[] = [];
      (data._notes ?? defaultValue._notes).forEach((obj) => {
         if (obj?._type === 3) {
            bombNotes.push(bombNote.deserialize(obj));
         } else {
            colorNotes.push(colorNote.deserialize(obj));
         }
      });

      const basicEvents: Partial<IWrapEventAttribute>[] = [];
      const colorBoostEvents: Partial<IWrapColorBoostEventAttribute>[] = [];
      const rotationEvents: Partial<IWrapRotationEventAttribute>[] = [];
      const bpmEvents: Partial<IWrapBPMEventAttribute>[] = [];
      (data._events ?? defaultValue._events).forEach((obj) => {
         switch (obj?._type) {
            case 5:
               colorBoostEvents.push(colorBoostEvent.deserialize(obj));
               break;
            case 14:
            case 15:
               rotationEvents.push(rotationEvent.deserialize(obj));
               break;
            case 100:
            case 10:
               bpmEvents.push(bpmEvent.deserialize(obj));
               break;
            default:
               basicEvents.push(basicEvent.deserialize(obj));
         }
      });

      return {
         version: 2,
         difficulty: {
            colorNotes,
            bombNotes,
            obstacles: (data._obstacles ?? []).map(obstacle.deserialize),
            bpmEvents,
            rotationEvents,
            customData: deepCopy(data._customData ?? defaultValue._customData),
         },
         lightshow: {
            basicEvents,
            colorBoostEvents,
            waypoints: (data._waypoints ?? defaultValue._waypoints).map(waypoint.deserialize),
            eventTypesWithKeywords: eventTypesWithKeywords.deserialize(
               data._specialEventsKeywordFilters ?? defaultValue._specialEventsKeywordFilters,
            ),
         },
      };
   },
};
