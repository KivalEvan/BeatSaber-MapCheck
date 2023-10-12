import { IColor } from '../../../colors';

/** Color Scheme interface for difficulty info custom data. */
export interface IColorScheme {
   _colorLeft?: IColor;
   _colorRight?: IColor;
   _envColorLeft?: IColor;
   _envColorRight?: IColor;
   _envColorWhite?: IColor;
   _envColorLeftBoost?: IColor;
   _envColorRightBoost?: IColor;
   _envColorWhiteBoost?: IColor;
   _obstacleColor?: IColor;
}
