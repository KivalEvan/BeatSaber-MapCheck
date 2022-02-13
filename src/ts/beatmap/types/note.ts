import { CustomDataNote } from './customData';

/** Beatmap object interface for Note.
 * ```ts
 * _time: float,
 * _lineIndex: int,
 * _lineLayer: int,
 * _type: int,
 * _cutDirection: int,
 * _customData?: JSON
 * ```
 */
export interface NoteBase {
    _time: number;
    _lineIndex: number;
    _lineLayer: number;
    _type: number;
    _cutDirection: number;
    _customData?: Record<never, never>;
}

export interface NoteGeneric extends NoteBase {
    _type: 0 | 1 | 3;
    _customData?: CustomDataNote;
}

export type Note = NoteGeneric;

interface NoteCountStats {
    total: number;
    chroma: number;
    noodleExtensions: number;
    mappingExtensions: number;
}

export interface NoteCount {
    red: NoteCountStats;
    blue: NoteCountStats;
    bomb: NoteCountStats;
}
