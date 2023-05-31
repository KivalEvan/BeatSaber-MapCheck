import { NoteDirectionAngle } from '../shared/constants';
import { IWrapColorNote } from '../../types/beatmap/wrapper/colorNote';
import { WrapBaseNote } from './baseNote';
import { ModType } from '../../types/beatmap/shared/modCheck';

/** Color note beatmap class object. */
export abstract class WrapColorNote<T extends { [P in keyof T]: T[P] }>
    extends WrapBaseNote<T>
    implements IWrapColorNote<T>
{
    protected _type!: IWrapColorNote['type'];
    protected _angleOffset!: IWrapColorNote['angleOffset'];

    get type(): IWrapColorNote['type'] {
        return this._type;
    }
    set type(value: IWrapColorNote['type']) {
        this._type = value;
    }
    get angleOffset(): IWrapColorNote['angleOffset'] {
        return this._angleOffset;
    }
    set angleOffset(value: IWrapColorNote['angleOffset']) {
        this._angleOffset = value;
    }

    setType(value: IWrapColorNote['type']) {
        this.type = value;
        return this;
    }
    setAngleOffset(value: IWrapColorNote['angleOffset']) {
        this.angleOffset = value;
        return this;
    }

    isNote(): boolean {
        return this.type === 0 || this.type === 1;
    }

    isBomb(): boolean {
        return this.type === 3;
    }

    mirror(flipColor = true) {
        return super.mirror(flipColor);
    }

    swapRotation(toSwap: IWrapColorNote, mirrorAngle = true) {
        const tempA = toSwap.angleOffset;
        toSwap.angleOffset = this.angleOffset;
        this.angleOffset = tempA;
        if (mirrorAngle) {
            toSwap.angleOffset = 0 - toSwap.angleOffset;
            this.angleOffset = 0 - this.angleOffset;
        }
        return this;
    }

    getAngle(_type?: ModType) {
        return (
            (NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0) +
            this.angleOffset
        );
    }

    isMappingExtensions() {
        return (
            this.posX > 3 ||
            this.posX < 0 ||
            this.posY > 2 ||
            this.posY < 0 ||
            (this.direction >= 1000 && this.direction <= 1360) ||
            (this.direction >= 2000 && this.direction <= 2360)
        );
    }
}
