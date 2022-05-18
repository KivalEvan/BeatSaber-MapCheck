interface NoteCountStats {
    total: number;
    chroma: number;
    noodleExtensions: number;
    mappingExtensions: number;
}

export interface NoteCount {
    red: NoteCountStats;
    blue: NoteCountStats;
    bomb: NoteCountStats;
}

export interface ObstacleCount {
    total: number;
    interactive: number;
    crouch: number;
    chroma: number;
    noodleExtensions: number;
    mappingExtensions: number;
}
