export interface Editor {
    _lastEditedBy?: string;
    [key: string]: string | { version?: string; [key: string]: any };
}
