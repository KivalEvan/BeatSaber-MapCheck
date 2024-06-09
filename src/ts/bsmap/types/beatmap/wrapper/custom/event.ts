import type {
   IChromaEventLaser as IChromaEventLaserV2,
   IChromaEventLight as IChromaEventLightV2,
   IChromaEventZoom as IChromaEventZoomV2,
} from '../../v2/custom/chroma.ts';
import type {
   IChromaEventLaser as IChromaEventLaserV3,
   IChromaEventLight as IChromaEventLightV3,
   IChromaEventZoom as IChromaEventZoomV3,
} from '../../v3/custom/chroma.ts';

export type ICustomDataEvent = IChromaEventLightV2 &
   IChromaEventLightV3 &
   IChromaEventZoomV2 &
   IChromaEventZoomV3 &
   IChromaEventLaserV2 &
   IChromaEventLaserV3;
