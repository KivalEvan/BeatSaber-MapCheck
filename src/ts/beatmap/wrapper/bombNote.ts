import { WrapGridObject } from './gridObject.ts';
import type { IWrapBombNote } from '../../types/beatmap/wrapper/bombNote.ts';

/** Bomb note beatmap class object. */
export abstract class WrapBombNote<T extends { [P in keyof T]: T[P] }>
   extends WrapGridObject<T>
   implements IWrapBombNote<T>
{
   isMappingExtensions(): boolean {
      return this.posX > 3 || this.posX < 0 || this.posY > 2 || this.posY < 0;
   }

   isValid(): boolean {
      return !this.isMappingExtensions();
   }
}
