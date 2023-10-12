/** Editor Info interface for Editor. */
export interface IEditorInfo {
   version?: string;
}

/** Editor interface for info custom data. */
export interface IEditor {
   _lastEditedBy?: string;
   [key: string]: IEditorInfo | string | undefined;
}
