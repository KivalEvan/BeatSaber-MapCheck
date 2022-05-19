interface INoteCountStats {
    total: number;
    chroma: number;
    noodleExtensions: number;
    mappingExtensions: number;
}

export interface INoteCount {
    red: INoteCountStats;
    blue: INoteCountStats;
    bomb: INoteCountStats;
}

export interface IObstacleCount {
    total: number;
    interactive: number;
    chroma: number;
    noodleExtensions: number;
    mappingExtensions: number;
}

interface IEventCountStats {
    total: number;
    chroma: number;
    chromaOld: number;
}

export interface IEventCount {
    [key: number]: IEventCountStats;
}
