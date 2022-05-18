import { NoteContainer } from '../../beatmap/v3/container';

export interface ISwingContainer {
    time: number;
    duration: number;
    minSwing: number;
    maxSwing: number;
    ebpm: number;
    ebpmSwing: number;
    data: NoteContainer[];
}

export interface ISwingCount {
    left: number[];
    right: number[];
}

export interface ISwingPerSecond {
    count: number;
    total: number;
    peak: number;
    median: number;
}

export interface ISwingAnalysis {
    container: ISwingContainer[];
    red: ISwingPerSecond;
    blue: ISwingPerSecond;
    total: ISwingPerSecond;
}
