type LookupMethod = 'Regex' | 'Exact' | 'Contains';
type Array3DPoint = [number, number, number];
type ArrayColor = [number, number, number, number?];

export interface ChromaEnvironment {
    _id: string;
    _lookupMethod: LookupMethod;
    _duplicate: number;
    _active: boolean;
    _scale: Array3DPoint;
    _position: Array3DPoint;
    _localPosition: Array3DPoint;
    _rotation: Array3DPoint;
    _localRotation: Array3DPoint;
    _track: string;
}

export interface ChromaEnvironmentOld {
    _environmentalRemoval?: string[];
}

interface ChromaBase {
    _color?: ArrayColor;
}

export interface ChromaNote extends ChromaBase {
    _disableSpawnEffect?: boolean;
}

export interface ChromaObstacle extends ChromaBase {}

export interface ChromaEventLight extends ChromaBase {
    _lightID?: number | number[];
    _propID?: number;
    _lightGradient?: {
        _duration: number;
        _startColor: number[];
        _endColor: number[];
        _easing?: string;
    };
}

export interface ChromaEventLaser {
    _lockPosition?: boolean;
    _speed?: number;
    _preciseSpeed?: number;
    _direction?: number;
}

export interface ChromaEventRotation {
    _nameFilter?: string;
    _reset?: boolean;
    _rotation?: number;
    _step?: number;
    _prop?: number;
    _speed?: number;
    _direction?: number;
    _counterSpin?: boolean;
    _stepMult?: number;
    _propMult?: number;
    _speedMult?: number;
}

export interface ChromaEventZoom {
    _step?: number;
}

export interface ChromaEvent
    extends ChromaEventLaser,
        ChromaEventLight,
        ChromaEventRotation,
        ChromaEventZoom {}
