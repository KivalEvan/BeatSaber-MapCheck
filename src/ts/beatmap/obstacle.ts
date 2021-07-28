import { CustomDataObstacle } from './customData';

export interface Obstacle {
    _time: number;
    _lineIndex: number;
    _type: number;
    _duration: number;
    _width: number;
    _customData?: CustomDataObstacle;
    [key: string]: any;
}

export const isInteractive = (obstacle: Obstacle): boolean => {
    return obstacle._width >= 2 || obstacle._lineIndex === 1 || obstacle._lineIndex === 2;
};
