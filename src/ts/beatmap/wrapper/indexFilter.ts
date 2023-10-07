import { IWrapIndexFilter } from '../../types/beatmap/wrapper/indexFilter';
import { LimitAlsoAffectsType, RandomType } from '../shared/constants';
import { WrapBaseItem } from './baseItem';

/** Index filter beatmap class object. */
export abstract class WrapIndexFilter<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseItem<T>
   implements IWrapIndexFilter<T>
{
   protected _type!: IWrapIndexFilter['type'];
   protected _p0!: IWrapIndexFilter['p0'];
   protected _p1!: IWrapIndexFilter['p1'];
   protected _reverse!: IWrapIndexFilter['reverse'];
   protected _chunks!: IWrapIndexFilter['chunks'];
   protected _limit!: IWrapIndexFilter['limit'];
   protected _limitAffectsType!: IWrapIndexFilter['limitAffectsType'];
   protected _random!: IWrapIndexFilter['random'];
   protected _seed!: IWrapIndexFilter['seed'];

   get type(): IWrapIndexFilter['type'] {
      return this._type;
   }
   set type(value: IWrapIndexFilter['type']) {
      this._type = value;
   }
   get p0(): IWrapIndexFilter['p0'] {
      return this._p0;
   }
   set p0(value: IWrapIndexFilter['p0']) {
      this._p0 = value;
   }
   get p1(): IWrapIndexFilter['p1'] {
      return this._p1;
   }
   set p1(value: IWrapIndexFilter['p1']) {
      this._p1 = value;
   }
   get reverse(): IWrapIndexFilter['reverse'] {
      return this._reverse;
   }
   set reverse(value: IWrapIndexFilter['reverse']) {
      this._reverse = value;
   }
   get chunks(): IWrapIndexFilter['chunks'] {
      return this._chunks;
   }
   set chunks(value: IWrapIndexFilter['chunks']) {
      this._chunks = value;
   }
   get limit(): IWrapIndexFilter['limit'] {
      return this._limit;
   }
   set limit(value: IWrapIndexFilter['limit']) {
      this._limit = value;
   }
   get limitAffectsType(): IWrapIndexFilter['limitAffectsType'] {
      return this._limitAffectsType;
   }
   set limitAffectsType(value: IWrapIndexFilter['limitAffectsType']) {
      this._limitAffectsType = value;
   }
   get random(): IWrapIndexFilter['random'] {
      return this._random;
   }
   set random(value: IWrapIndexFilter['random']) {
      this._random = value;
   }
   get seed(): IWrapIndexFilter['seed'] {
      return this._seed;
   }
   set seed(value: IWrapIndexFilter['seed']) {
      this._seed = value;
   }

   setType(value: IWrapIndexFilter['type']) {
      this.type = value;
      return this;
   }
   setP0(value: IWrapIndexFilter['p0']) {
      this.p0 = value;
      return this;
   }
   setP1(value: IWrapIndexFilter['p1']) {
      this.p1 = value;
      return this;
   }
   setReverse(value: IWrapIndexFilter['reverse']) {
      this.reverse = value;
      return this;
   }
   setChunks(value: IWrapIndexFilter['chunks']) {
      this.chunks = value;
      return this;
   }
   setRandom(value: IWrapIndexFilter['random']) {
      this.random = value;
      return this;
   }
   setSeed(value: IWrapIndexFilter['seed']) {
      this.seed = value;
      return this;
   }
   setLimit(value: IWrapIndexFilter['limit']) {
      this.limit = value;
      return this;
   }
   setLimitAffectsType(value: IWrapIndexFilter['limitAffectsType']) {
      this.limitAffectsType = value;
      return this;
   }

   isValid(): boolean {
      return (
         (this.type === 1 || this.type === 2) &&
         this.p0 >= 0 &&
         this.p1 >= 0 &&
         (this.reverse === 0 || this.reverse === 1) &&
         this.chunks >= 0 &&
         this.random >= 0 &&
         this.random <= RandomType.ALL &&
         this.limit >= 0 &&
         this.limit <= 0 &&
         this.limitAffectsType >= 0 &&
         this.limitAffectsType <= LimitAlsoAffectsType.ALL
      );
   }
}
