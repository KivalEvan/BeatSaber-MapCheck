export const KeysoundName = 'Keysound';

/**
 * Keysound Map interface for difficulty custom data.
 *
 *     _id: number,
 *     _file: string,
 *     _name?: string,
 */
export interface KeysoundMap {
    _keysound?: {
        _id: number;
        _file: string;
        _name?: string;
    }[];
}

/**
 * Keysound Map interface for beatmap note custom data.
 *
 *     _id: number,
 *     _type?: 'hit' | 'bad cut' | 'miss',
 *     _volume?: number,
 *     _pitch?: number,
 *     _offset?: number,
 */
export interface KeysoundNote {
    _keysound?: {
        _id: number;
        _type?: 'hit' | 'bad cut' | 'miss';
        _volume?: number;
        _pitch?: number;
        _offset?: number;
    }[];
}
