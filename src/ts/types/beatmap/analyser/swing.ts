import { NoteContainer } from '../v3/container';

export interface ISwingContainer {
    time: number;
    data: NoteContainer[];
}

export interface ISwingCount {
    left: number[];
    right: number[];
}

export interface ISwingPerSecond {
    overall: number;
    total: number;
    peak: number;
    median: number;
}

export interface ISwingAnalysis {
    red: ISwingPerSecond;
    blue: ISwingPerSecond;
    total: ISwingPerSecond;
    container: ISwingContainer[];
}
