// deno-lint-ignore-file no-explicit-any
import type { DeepPartial } from '../../utils.ts';

export type BeatmapFileType = 'info' | 'audioData' | 'difficulty' | 'lightshow';

export interface ISchemaContainer<
   TWrap = { [key: string]: any },
   TSerial = { [key: string]: any },
> {
   readonly defaultValue: Required<TSerial>;
   serialize: (data: TWrap) => TSerial;
   deserialize: (data?: DeepPartial<TSerial>) => DeepPartial<TWrap>;
}
