type Array2DPoint = [number, number];
type Array3DPoint = [number, number, number];
type Array2DPointDefinition = [number, number, number, string?, string?];
type Array3DPointDefinition = [number, number, number, number, string?, string?];
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

// TODO: do stuff for data
export interface NECustomEvent {
    _time: number;
    _type: EventType;
    _data: { [key: string]: any };
}

export interface NEPointDefinition {
    _name: number;
    _points: Array2DPointDefinition[] | Array3DPointDefinition[];
}
