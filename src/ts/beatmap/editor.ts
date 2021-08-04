export interface EditorInfo {
    version?: string;
}

export interface Editor {
    _lastEditedBy?: string;
    [key: string]: EditorInfo | string | undefined;
}
