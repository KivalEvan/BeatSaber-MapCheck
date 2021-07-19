export interface EditorInfo {
    version?: string;
    [key: string]: any;
}

export interface Editor {
    _lastEditedBy?: string;
    [key: string]: EditorInfo | string | undefined;
}
