import { NoteDirectionAngle } from '../shared/constants';
import { IWrapColorNote } from '../../types/beatmap/wrapper/colorNote';
import { WrapBaseNote } from './baseNote';

/** Color note beatmap class object. */
export abstract class WrapColorNote<T extends Record<keyof T, unknown>>
    extends WrapBaseNote<T>
    implements IWrapColorNote<T>
{
    abstract get type(): IWrapColorNote['type'];
    abstract set type(value: IWrapColorNote['type']);
    abstract get angleOffset(): IWrapColorNote['angleOffset'];
    abstract set angleOffset(value: IWrapColorNote['angleOffset']);

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

    getAngle(type?: 'vanilla' | 'me' | 'ne') {
        switch (type) {
            case 'vanilla':
                return (NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0) + this.angleOffset;
            case 'me':
                if (this.direction >= 1000) {
                    return Math.abs(((this.direction % 1000) % 360) - 360);
                }
            /* falls through */
            case 'ne':
                return (NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0) + this.angleOffset;
            default:
                if (this.direction >= 1000) {
                    return Math.abs(((this.direction % 1000) % 360) - 360);
                }
                return (NoteDirectionAngle[this.direction as keyof typeof NoteDirectionAngle] || 0) + this.angleOffset;
        }
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
