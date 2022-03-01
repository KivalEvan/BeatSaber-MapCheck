/** Editor Info interface for Editor.
 * ```ts
 * version?: string
 * ```
 */
export interface EditorInfo {
    version?: string;
}

/** Editor interface for info custom data.
 * ```ts
 * _lastEditedBy?: string,
 * _editorName?: EditorInfo
 * ```
 */
export interface Editor {
    _lastEditedBy?: string;
    [key: string]: EditorInfo | string | undefined;
}
