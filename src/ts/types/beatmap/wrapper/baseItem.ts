import { ObtainCustomData } from '../../utils';
import { ISerializable } from '../shared/serializable';

export interface IWrapBaseItemAttribute<
    T extends Record<keyof T, unknown> = Record<string, unknown>,
> {
    /** Custom data `<object>` of beatmap object.
     *
     * This has no type-safety for unsupported data.
     */
    customData: ObtainCustomData<T>;
}

export interface IWrapBaseItem<T extends Record<keyof T, unknown> = Record<string, unknown>>
    extends ISerializable<T>,
        IWrapBaseItemAttribute<T> {
    setCustomData(value: ObtainCustomData<T>): this;
    resetCustomData(): this;
    removeCustomData(key: string): this;
    addCustomData(object: ObtainCustomData<T>): this;

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
