export type LookupMethod = 'Regex' | 'Exact' | 'Contains' | 'StartsWith' | 'EndsWith';

export const chromaName = 'Chroma';

/** Chroma interface for Difficulty Info Custom Data. */
export interface IChromaInfoCustomData {
    _chroma?: {
        _disableChromaEvents?: boolean;
        _disableEnvironmentEnhancements?: boolean;
        _forceZenModeWall?: boolean;
    };
    _environmentalRemoval?: string[];
}
