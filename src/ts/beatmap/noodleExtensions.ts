// TODO: include type of easing available
type Array2DPoint = [number, number];
type Array3DPoint = [number, number, number];
type ArrayColorPointDefinition = [number, number, number, number, number, string?];
type ArrayPercentPointDefinition = [number, number, string?];
type Array2DPointDefinition = [number, number, number, string?, string?];
type Array3DPointDefinition = [number, number, number, number, string?, string?];
type ArrayPointDefinition =
    | Array2DPointDefinition[]
    | Array3DPointDefinition[]
    | ArrayColorPointDefinition[];
type EventType =
    | 'AnimateTrack'
    | 'AssignPathAnimation'
    | 'AssignTrackParent'
    | 'AssignPlayerToTrack';

interface NEObject {
    _position?: Array2DPoint;
    _rotation?: Array3DPoint;
    _localRotation?: Array3DPoint;
    _noteJumpMovementSpeed?: number;
    _noteJumpStartBeatOffset?: number;
    _fake?: boolean;
    _interactable?: boolean;
    _track?: string;
    _animation?: NEAnimation;
}

export interface NENote extends NEObject {
    _cutDirection?: number;
    _flip?: Array2DPoint;
    _disableNoteGravity?: boolean;
    _disableNoteLook?: boolean;
}

export interface NEObstacle extends NEObject {
    _scale?: Array3DPoint;
}

export interface NEEvent {
    _rotation?: number;
}

export interface NECustomEvent {
    _time: number;
    _type: EventType;
    _data: NECustomEventData;
}

export interface NEPointDefinition {
    _name: number;
    _points: ArrayPointDefinition[];
}

export interface NECustomEventDataBase {
    _track: string;
}

export interface NECustomData {
    _customEvents?: NECustomEvent[];
    _pointDefinitions?: NEPointDefinition[];
}

// lmao wtf
export interface NECustomEventDataAnimateTrack extends NECustomEventDataBase {
    _duration: number;
    _easing?: string;
    _position?: string | Array3DPointDefinition[];
    _rotation?: string | Array3DPointDefinition[];
    _localRotation?: string | Array3DPointDefinition[];
    _scale?: string | Array3DPointDefinition[];
    _dissolve?: string | ArrayPercentPointDefinition[];
    _dissolveArrow?: string | ArrayPercentPointDefinition[];
    _color?: string | ArrayColorPointDefinition[];
    _interactable?: string | ArrayPercentPointDefinition[];
    _time?: string | ArrayPercentPointDefinition[];
}

export interface NECustomEventDataAssignPathAnimation extends NECustomEventDataBase {
    _duration: number;
    _easing?: string;
    _position?: string | Array3DPointDefinition[];
    _rotation?: string | Array3DPointDefinition[];
    _localRotation?: string | Array3DPointDefinition[];
    _scale?: string | Array3DPointDefinition[];
    _dissolve?: string | ArrayPercentPointDefinition[];
    _dissolveArrow?: string | ArrayPercentPointDefinition[];
    _color?: string | ArrayColorPointDefinition[];
    _interactable?: string | ArrayPercentPointDefinition[];
    _definitePosition?: string | Array3DPointDefinition[];
}

export interface NECustomEventDataAssignTrackParent {
    _childrenTracks: string[];
    _parentTrack: string;
}

export interface NECustomEventDataAssignPlayerToTrack extends NECustomEventDataBase {}

export interface NEAnimation {
    _position?: string | Array3DPointDefinition[];
    _rotation?: string | Array3DPointDefinition[];
    _localRotation?: string | Array3DPointDefinition[];
    _scale?: string | Array3DPointDefinition[];
    _dissolve?: string | ArrayPercentPointDefinition[];
    _dissolveArrow?: string | ArrayPercentPointDefinition[];
    _color?: string | ArrayColorPointDefinition[];
    _interactable?: string | ArrayPercentPointDefinition[];
    _definitePosition?: string | Array3DPointDefinition[];
    _time?: string | ArrayPercentPointDefinition[];
}

export type NECustomEventData =
    | NECustomEventDataAnimateTrack
    | NECustomEventDataAssignPathAnimation
    | NECustomEventDataAssignPathAnimation
    | NECustomEventDataAssignPlayerToTrack;
