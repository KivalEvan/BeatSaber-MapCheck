import { WrapGridObject } from './gridObject';
import { IWrapBombNote } from '../../types/beatmap/wrapper/bombNote';

/** Bomb note beatmap class object. */
export abstract class WrapBombNote<T extends { [P in keyof T]: T[P] }>
   extends WrapGridObject<T>
   implements IWrapBombNote<T>
{
   isMappingExtensions() {
      return this.posX > 3 || this.posX < 0 || this.posY > 2 || this.posY < 0;
   }

   isValid() {
      return !this.isMappingExtensions();
   }
}
