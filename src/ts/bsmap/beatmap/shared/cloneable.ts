// deno-lint-ignore-file no-explicit-any
import type { ICloneable } from '../../types/beatmap/shared/cloneable.ts';

export abstract class Cloneable implements ICloneable {
   clone<U extends this>(): U {
      return new (this.constructor as { new (data: any): U })(this);
   }
}
