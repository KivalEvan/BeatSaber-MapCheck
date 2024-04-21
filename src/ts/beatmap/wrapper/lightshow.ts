import type { IWrapEvent, IWrapEventAttribute } from '../../types/beatmap/wrapper/event.ts';
import type {
   IWrapColorBoostEvent,
   IWrapColorBoostEventAttribute,
} from '../../types/beatmap/wrapper/colorBoostEvent.ts';
import type {
   IWrapLightColorEventBoxGroup,
   IWrapLightColorEventBoxGroupAttribute,
} from '../../types/beatmap/wrapper/lightColorEventBoxGroup.ts';
import type {
   IWrapLightRotationEventBoxGroup,
   IWrapLightRotationEventBoxGroupAttribute,
} from '../../types/beatmap/wrapper/lightRotationEventBoxGroup.ts';
import type {
   IWrapLightTranslationEventBoxGroup,
   IWrapLightTranslationEventBoxGroupAttribute,
} from '../../types/beatmap/wrapper/lightTranslationEventBoxGroup.ts';
import type {
   _ObtainCustomData,
   DeepPartialWrapper,
   LooseAutocomplete,
   PartialWrapper,
} from '../../types/utils.ts';
import type { GenericFilename } from '../../types/beatmap/shared/filename.ts';
import type { EventContainer } from '../../types/beatmap/wrapper/container.ts';
import { WrapBaseItem } from './baseItem.ts';
import type { IWrapLightshow } from '../../types/beatmap/wrapper/lightshow.ts';
import type {
   IWrapFxEventBoxGroup,
   IWrapFxEventBoxGroupAttribute,
} from '../../types/beatmap/wrapper/fxEventBoxGroup.ts';
import { sortObjectFn } from '../shared/helpers.ts';
import type {
   IWrapWaypoint,
   IWrapWaypointAttribute,
} from '../../types/beatmap/wrapper/waypoint.ts';
import type { IWrapEventTypesWithKeywords } from '../../types/beatmap/wrapper/eventTypesWithKeywords.ts';
import type { Version } from '../../types/beatmap/shared/version.ts';

/** Lightshow beatmap class object. */
export abstract class WrapLightshow<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseItem<T>
   implements IWrapLightshow<T>
{
   abstract readonly version: Version;
   private _filename = 'UnnamedLightshow.dat';

   abstract waypoints: IWrapWaypoint[];
   abstract basicEvents: IWrapEvent[];
   abstract colorBoostEvents: IWrapColorBoostEvent[];
   abstract lightColorEventBoxGroups: IWrapLightColorEventBoxGroup[];
   abstract lightRotationEventBoxGroups: IWrapLightRotationEventBoxGroup[];
   abstract lightTranslationEventBoxGroups: IWrapLightTranslationEventBoxGroup[];
   abstract fxEventBoxGroups: IWrapFxEventBoxGroup[];
   abstract eventTypesWithKeywords: IWrapEventTypesWithKeywords;
   abstract useNormalEventsAsCompatibleEvents: boolean;

   clone<U extends this>(): U {
      return super.clone().setFilename(this.filename) as U;
   }

   set filename(name: LooseAutocomplete<GenericFilename>) {
      this._filename = name.trim();
   }
   get filename(): string {
      return this._filename;
   }

   setFilename(filename: LooseAutocomplete<GenericFilename>): this {
      this.filename = filename;
      return this;
   }

   sort(): this {
      this.basicEvents.sort(sortObjectFn);
      this.colorBoostEvents.sort(sortObjectFn);
      this.lightColorEventBoxGroups.sort(sortObjectFn);
      this.lightRotationEventBoxGroups.sort(sortObjectFn);
      this.lightTranslationEventBoxGroups.sort(sortObjectFn);
      this.fxEventBoxGroups.sort(sortObjectFn);

      this.lightColorEventBoxGroups.forEach((gr) =>
         gr.boxes.forEach((bx) => bx.events.sort(sortObjectFn)),
      );
      this.lightRotationEventBoxGroups.forEach((gr) =>
         gr.boxes.forEach((bx) => bx.events.sort(sortObjectFn)),
      );
      this.lightTranslationEventBoxGroups.forEach((gr) =>
         gr.boxes.forEach((bx) => bx.events.sort(sortObjectFn)),
      );

      return this;
   }

   abstract reparse(keepRef?: boolean): this;

   protected createOrKeep<T, U>(concrete: { new (data: T | U): U }, obj: U, keep?: boolean): U {
      return keep && obj instanceof concrete ? obj : new concrete(obj);
   }

   protected checkClass<T, U>(concrete: { new (data: T): U }, obj: U): boolean {
      return obj instanceof concrete;
   }

   getEventContainer(): EventContainer[] {
      const ec: EventContainer[] = [];
      this.basicEvents.forEach((be) => ec.push({ type: 'basicEvent', data: be }));
      this.colorBoostEvents.forEach((b) => ec.push({ type: 'boost', data: b }));
      return ec.sort((a, b) => a.data.time - b.data.time);
   }

   abstract addWaypoints(...data: PartialWrapper<IWrapWaypointAttribute>[]): this;
   abstract addBasicEvents(...data: PartialWrapper<IWrapEventAttribute>[]): this;
   abstract addColorBoostEvents(...data: PartialWrapper<IWrapColorBoostEventAttribute>[]): this;
   abstract addLightColorEventBoxGroups(
      ...data: DeepPartialWrapper<IWrapLightColorEventBoxGroupAttribute>[]
   ): this;
   abstract addLightRotationEventBoxGroups(
      ...data: DeepPartialWrapper<IWrapLightRotationEventBoxGroupAttribute>[]
   ): this;
   abstract addLightTranslationEventBoxGroups(
      ...data: DeepPartialWrapper<IWrapLightTranslationEventBoxGroupAttribute>[]
   ): this;
   abstract addFxEventBoxGroups(...data: DeepPartialWrapper<IWrapFxEventBoxGroupAttribute>[]): this;
}
