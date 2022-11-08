import { ICustomDataBase } from '../shared/customData';

export interface IWrapBaseItem {
    /** Custom data `<object>` of beatmap object.
     *
     * This has no type-safety for unsupported data.
     */
    customData?: ICustomDataBase;

    setCustomData(value: Record<string, unknown>): this;
    resetCustomData(): this;
    removeCustomData(key: string): this;
    addCustomData(object: Record<string, unknown>): this;

    /** Allow for advanced custom function. */
    func(fn: (object: this) => void): this;

    /** Check if object is valid in vanilla game.
     * ```ts
     * if (obj.isValid()) {}
     * ```
     */
    isValid(): boolean;

    /** Check if object has Chroma properties.
     * ```ts
     * if (obj.isChroma()) {}
     * ```
     */
    isChroma(): boolean;

    /** Check if object has Noodle Extensions properties.
     * ```ts
     * if (obj.isNoodleExtensions()) {}
     * ```
     */
    isNoodleExtensions(): boolean;

    /** Check if object has Mapping Extensions properties.
     * ```ts
     * if (obj.isMappingExtensions()) {}
     * ```
     */
    isMappingExtensions(): boolean;
}
