/** Editor Info interface for Editor.
 * ```ts
 * version?: string
 * ```
 */
export interface IEditorInfo {
    version?: string;
}

/** Editor interface for info custom data.
 * ```ts
 * _lastEditedBy?: string,
 * _editorName?: EditorInfo
 * ```
 */
export interface IEditor {
    _lastEditedBy?: string;
    [key: string]: IEditorInfo | string | undefined;
}
