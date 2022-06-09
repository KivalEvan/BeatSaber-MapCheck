import { ColorPointDefinition, PercentPointDefinition, Vector3 } from '../shared/heck';
import { Easings } from '../shared/easings';
import { ColorArray } from '../shared/colors';
import { ICustomDataBase } from '../shared/customData';
import { LookupMethod } from '../shared/chroma';
import { IHeckCustomEventDataBase } from './heck';

export enum ChromaDataEnvAbbr {
    duplicate = 'D',
    active = 'A',
    scale = 'S',
    position = 'P',
    localPosition = 'Lp',
    rotation = 'R',
    localRotation = 'Lr',
    lightID = 'Li',
    track = 'T',
}

/** Chroma interface for Environment Enhancement. */
export interface IChromaEnvironment {
    /** Look up environment object name.
     * This grabs every environment objects that match the string.
     * ```ts
     * _id: 'Environment.[0]GlowLine' || 'Environment\.\\[\\d+\\]GlowLine$' // Regex example
     * ```
     */
    id: string;
    /** Look-up method to grab the object name.
     * Regex is considered an advanced method and more powerful than other methods.
     */
    lookupMethod: LookupMethod;
    /** Assign track to the object for animation use. */
    track?: string;
    /** Duplicate the object by set amount.
     * **WARNING:** You should always duplicate only one at a time unless you know what you are doing.
     */
    duplicate?: number;
    active?: boolean;
    scale?: Vector3;
    position?: Vector3;
    rotation?: Vector3;
    localPosition?: Vector3;
    localRotation?: Vector3;
    /** Assign light ID for duplicated object. */
    lightID?: number;
}

/** Chroma interface for Beatmap Note Custom Data. */
export interface IChromaAnimation {
    color?: string | ColorPointDefinition[];
}

/** Chroma interface for Beatmap Note Custom Data. */
export interface IChromaNote {
    color?: ColorArray;
    spawnEffect?: boolean;
}

/** Chroma interface for Beatmap Obstacle Custom Data. */
export interface IChromaObstacle {
    color?: ColorArray;
}

/** Chroma interface for Beatmap Event Light Custom Data. */
export interface IChromaEventLight extends ICustomDataBase {
    color?: ColorArray;
    lightID?: number | number[];
    lerpType?: 'HSV' | 'RGB';
    easing?: Easings;
}

/** Chroma interface for Beatmap Event Laser Rotation Custom Data. */
export interface IChromaEventLaser extends ICustomDataBase {
    lockRotation?: boolean;
    speed?: number;
    direction?: number;
}

/** Chroma interface for Beatmap Event Ring Spin Custom Data. */
export interface IChromaEventRing extends ICustomDataBase {
    nameFilter?: string;
    rotation?: number;
    step?: number;
    prop?: number;
    speed?: number;
    direction?: number;
}

/** Chroma interface for Beatmap Event Ring Zoom Custom Data. */
export interface IChromaEventZoom extends ICustomDataBase {
    step?: number;
    speed?: number;
}

/** AssignFogTrack interface for Noodle Extensions Custom Event. */
export interface IChromaCustomEventDataAssignFogTrack extends IHeckCustomEventDataBase {
    track: string;
    attenuation?: number | PercentPointDefinition[];
    offset?: number | PercentPointDefinition[];
    startY?: number | PercentPointDefinition[];
    height?: number | PercentPointDefinition[];
}

export interface IChromaAnimation {
    color?: string | ColorPointDefinition[];
}

/** Chroma Custom Event interface for AssignFogTrack. */
export interface IChromaCustomEventAssignFogTrack {
    beat: number;
    time: 'AssignFogTrack';
    data: IChromaCustomEventDataAssignFogTrack;
}

export type IChromaCustomEvent = IChromaCustomEventAssignFogTrack;

/** Chroma Custom Data interface for difficulty custom data. */
export interface IChromaCustomData {
    environment?: IChromaEnvironment[];
}
