import type { IWrapBombNote } from '../../../types/beatmap/wrapper/bombNote.ts';
import type { IWrapColorNote } from '../../../types/beatmap/wrapper/colorNote.ts';
import type { IWrapChain } from '../../../types/beatmap/wrapper/chain.ts';
import type { IWrapArc } from '../../../types/beatmap/wrapper/arc.ts';

export type IChromaNote = IWrapColorNote | IWrapBombNote | IWrapChain | IWrapArc;
