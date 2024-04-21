import type { IWrapBaseObject } from '../../types/beatmap/wrapper/baseObject.ts';
import type { IWrapEventBox } from '../../types/beatmap/wrapper/eventBox.ts';
import type { IWrapIndexFilter } from '../../types/beatmap/wrapper/indexFilter.ts';
import { WrapBaseItem } from './baseItem.ts';

/** Base event box beatmap class object. */
export abstract class WrapEventBox<
      TBox extends { [P in keyof TBox]: TBox[P] },
      TBase extends { [P in keyof TBase]: TBase[P] },
      TFilter extends { [P in keyof TFilter]: TFilter[P] },
   >
   extends WrapBaseItem<TBox>
   implements IWrapEventBox<TBox, TBase, TFilter>
{
   protected _filter!: IWrapIndexFilter<TFilter>;
   protected _beatDistribution!: IWrapEventBox<TBase>['beatDistribution'];
   protected _beatDistributionType!: IWrapEventBox<TBase>['beatDistributionType'];
   protected _easing!: IWrapEventBox<TBase>['easing'];
   protected _affectFirst!: IWrapEventBox<TBase>['affectFirst'];
   protected _events!: number[] | IWrapBaseObject<TBase>[];

   get filter(): IWrapIndexFilter<TFilter> {
      return this._filter;
   }
   set filter(value: IWrapIndexFilter<TFilter>) {
      this._filter = value;
   }
   get beatDistribution(): IWrapEventBox<TBase>['beatDistribution'] {
      return this._beatDistribution;
   }
   set beatDistribution(value: IWrapEventBox<TBase>['beatDistribution']) {
      this._beatDistribution = value;
   }
   get beatDistributionType(): IWrapEventBox<TBase>['beatDistributionType'] {
      return this._beatDistributionType;
   }
   set beatDistributionType(value: IWrapEventBox<TBase>['beatDistributionType']) {
      this._beatDistributionType = value;
   }
   get easing(): IWrapEventBox<TBase>['easing'] {
      return this._easing;
   }
   set easing(value: IWrapEventBox<TBase>['easing']) {
      this._easing = value;
   }
   get affectFirst(): IWrapEventBox<TBase>['affectFirst'] {
      return this._affectFirst;
   }
   set affectFirst(value: IWrapEventBox<TBase>['affectFirst']) {
      this._affectFirst = value;
   }
   get events(): number[] | IWrapBaseObject<TBase>[] {
      return this._events;
   }
   set events(value: number[] | IWrapBaseObject<TBase>[]) {
      this._events = value;
   }

   setFilter(value: IWrapIndexFilter<TFilter>): this {
      this.filter = value;
      return this;
   }
   setBeatDistribution(value: IWrapEventBox<TBase>['beatDistribution']): this {
      this.beatDistribution = value;
      return this;
   }
   setBeatDistributionType(value: IWrapEventBox<TBase>['beatDistributionType']): this {
      this.beatDistributionType = value;
      return this;
   }
   setEasing(value: IWrapEventBox<TBase>['easing']): this {
      this.easing = value;
      return this;
   }
   setAffectFirst(value: IWrapEventBox<TBase>['affectFirst']): this {
      this.affectFirst = value;
      return this;
   }
   abstract setEvents(value: number[] | IWrapBaseObject<TBase>[]): this;

   isValid(): boolean {
      return (
         (this.beatDistributionType === 1 || this.beatDistributionType === 2) &&
         this.easing >= 0 &&
         this.easing <= 3 &&
         this.events.every((e) => typeof e === 'number' || e.isValid()) &&
         this.filter.isValid()
      );
   }
}
