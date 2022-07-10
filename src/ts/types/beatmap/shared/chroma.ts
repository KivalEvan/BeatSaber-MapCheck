import { Easings } from '../../easings';
import { IInfoSettingsCustomData } from './heck';

export type ColorPointDefinition = [number, number, number, number, number, Easings?];

export type LookupMethod = 'Regex' | 'Exact' | 'Contains' | 'StartsWith' | 'EndsWith';

export type GeometryType = 'SPHERE' | 'CAPSULE' | 'CYLINDER' | 'CUBE' | 'PLANE' | 'QUAD' | 'TRIANGLE';

export type ShaderType = 'LIGHT_BOX' | 'STANDARD' | 'NO_SHADE';

export type ShaderKeywordsStandard =
    | 'DIFFUSE'
    | 'ENABLE_DIFFUSE'
    | 'ENABLE_FOG'
    | 'ENABLE_HEIGHT_FOG'
    | 'ENABLE_SPECULAR'
    | 'FOG'
    | 'HEIGHT_FOG'
    | 'REFLECTION_PROBE_BOX_PROJECTION'
    | 'SPECULAR'
    | '_EMISSION'
    | '_ENABLE_FOG_TINT'
    | '_RIMLIGHT_NONE'
    | '_ZWRITE_ON'
    | 'REFLECTION_PROBE'
    | 'LIGHT_FALLOFF';

export type ShaderKeywordsOpaque =
    | 'DIFFUSE'
    | 'ENABLE_BLUE_NOISE'
    | 'ENABLE_DIFFUSE'
    | 'ENABLE_HEIGHT_FOG'
    | 'ENABLE_LIGHTNING'
    | 'USE_COLOR_FOG';

export type ShaderKeywordsTransparent =
    | 'ENABLE_HEIGHT_FOG'
    | 'MULTIPLY_COLOR_WITH_ALPHA'
    | '_ENABLE_MAIN_EFFECT_WHITE_BOOST';

export const chromaName = 'Chroma';

/** Chroma interface for Difficulty Info Custom Data. */
export interface IChromaInfoCustomData extends IInfoSettingsCustomData {
    _settings?: {
        _chroma?: {
            _disableChromaEvents?: boolean;
            _disableEnvironmentEnhancements?: boolean;
            _forceZenModeWall?: boolean;
        };
    };
    _environmentalRemoval?: string[];
}
