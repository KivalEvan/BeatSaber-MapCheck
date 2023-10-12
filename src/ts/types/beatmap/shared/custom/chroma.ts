export type LookupMethod = 'Regex' | 'Exact' | 'Contains' | 'StartsWith' | 'EndsWith';

export type GeometryType =
   | 'Sphere'
   | 'Capsule'
   | 'Cylinder'
   | 'Cube'
   | 'Plane'
   | 'Quad'
   | 'Triangle';

export type ShaderType =
   | 'Standard'
   | 'OpaqueLight'
   | 'TransparentLight'
   | 'BaseWater'
   | 'BillieWater'
   | 'BTSPillar'
   | 'InterscopeConcrete'
   | 'InterscopeCar'
   | 'Obstacle'
   | 'WaterfallMirror';

/** Default shader keywords used in standard. */
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
   | '_ACES_APPROACH_AFTER_EMISSIVE'
   | '_DECALBLEND_ALPHABLEND'
   | '_DISSOLVEAXIS_LOCALX'
   | '_EMISSIONCOLORTYPE_FLAT'
   | 'EMISSIONTEXTURE_NONE'
   | '_ROTATE_UV_NONE'
   | '_VERTEXMODE_NONE'
   | 'WHITEBOOSTTYPE_NONE'
   | 'ZWRITE_ON';

/** Default shader keywords used in opaque light. */
export type ShaderKeywordsOpaque =
   | 'DIFFUSE'
   | 'ENABLE_BLUE_NOISE'
   | 'ENABLE_DIFFUSE'
   | 'ENABLE_HEIGHT_FOG'
   | 'ENABLE_LIGHTNING'
   | 'USE_COLOR_FOG';

/** Default shader keywords used in transparent light. */
export type ShaderKeywordsTransparent =
   | 'ENABLE_HEIGHT_FOG'
   | 'MULTIPLY_COLOR_WITH_ALPHA'
   | '_ENABLE_MAIN_EFFECT_WHITE_BOOST';

/** Shader keywords used in base water. */
export type ShaderKeywordsBaseWater =
   | 'FOG'
   | 'HEIGHT_FOG'
   | 'INVERT_RIMLIGHT'
   | 'MASK_RED_IS_ALPHA'
   | 'NOISE_DITHERING'
   | 'NORMAL_MAP'
   | 'REFLECTION_PROBE'
   | 'REFLECTION_PROBE_BOX_PROJECTION'
   | '_DECALBLEND_ALPHABLEND'
   | '_DISSOLVEAXIS_LOCALX'
   | '_EMISSIONCOLORTYPE_FLAT'
   | '_EMISSIONTEXTURE_NONE'
   | '_RIMLIGHT_NONE'
   | '_ROTATE_UV_NONE'
   | '_VERTEXMODE_NONE'
   | '_WHITEBOOSTTYPE_NONE'
   | '_ZWRITE_ON';

export type ShaderKeywords =
   | ShaderKeywordsStandard
   | ShaderKeywordsOpaque
   | ShaderKeywordsTransparent
   | ShaderKeywordsBaseWater;

export type EnvironmentMaterial =
   | 'BTSPillar'
   | 'BillieWater'
   | 'InterscopeConcrete'
   | 'InterscopeCar';
