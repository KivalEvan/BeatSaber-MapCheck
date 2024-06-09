interface ICountStatsBase {
   total: number;
}

export interface ICountStatsNote extends ICountStatsBase {
   chroma: number;
   noodleExtensions: number;
   mappingExtensions: number;
}

export interface ICountNote {
   red: ICountStatsNote;
   blue: ICountStatsNote;
}

export interface IObstacleCount extends ICountStatsBase {
   interactive: number;
   chroma: number;
   noodleExtensions: number;
   mappingExtensions: number;
}

export interface ICountStatsEvent extends ICountStatsBase {
   chroma: number;
   chromaOld: number;
}

export interface ICountEvent {
   [key: number]: ICountStatsEvent;
}

export interface ICountStatsEventBoxGroup {
   groups: number;
   boxes: number;
   bases: number;
}

export interface ICountEventBoxGroup {
   [key: number]: ICountStatsEventBoxGroup;
}
