import { IBombNote } from '../../types/beatmap/v3/bombNote';
import { BaseObject } from './baseObject';
import { LINE_COUNT } from '../shared/constants';
import { ICoordinateNote } from '../../types/beatmap/shared/coordinate';
import { ObjectToReturn } from '../../types/utils';

/** Bomb note beatmap object. */
export class BombNote
    extends BaseObject<IBombNote>
    implements ICoordinateNote<BombNote>
{
    static default: ObjectToReturn<Required<IBombNote>> = {
        b: 0,
        x: 0,
        y: 0,
        customData: () => {
            return {};
        },
    };

    private constructor(bombNote: Required<IBombNote>) {
        super(bombNote);
    }

    static create(): BombNote;
    static create(bombNotes: Partial<IBombNote>): BombNote;
    static create(...bombNotes: Partial<IBombNote>[]): BombNote[];
    static create(...bombNotes: Partial<IBombNote>[]): BombNote | BombNote[] {
        const result: BombNote[] = [];
        bombNotes?.forEach((bn) =>
            result.push(
                new BombNote({
                    b: bn.b ?? BombNote.default.b,
                    x: bn.x ?? BombNote.default.x,
                    y: bn.y ?? BombNote.default.y,
                    customData: bn.customData ?? BombNote.default.customData(),
                })
            )
        );
        if (result.length === 1) {
            return result[0];
        }
        if (result.length) {
            return result;
        }
        return new BombNote({
            b: BombNote.default.b,
            x: BombNote.default.x,
            y: BombNote.default.y,
            customData: BombNote.default.customData(),
        });
    }

    toObject(): IBombNote {
        return {
            b: this.time,
            x: this.posX,
            y: this.posY,
        };
    }

    /** Position x `<int>` of bomb.
     * ```ts
     * 0 -> Outer Left
     * 1 -> Middle Left
     * 2 -> Middle Right
     * 3 -> Outer Right
     * ```
     * ---
     * Range: `0-3`
     */
    get posX() {
        return this.data.x;
    }
    set posX(value: IBombNote['x']) {
        this.data.x = value;
    }

    /** Position y `<int>` of bomb.
     * ```ts
     * 0 -> Bottom row
     * 1 -> Middle row
     * 2 -> Top row
     * ```
     * ---
     * Range: `0-2`
     */
    get posY() {
        return this.data.y;
    }
    set posY(value: IBombNote['y']) {
        this.data.y = value;
    }

    get customData() {
        return this.data.customData;
    }
    set customData(value: typeof this.data.customData) {
        this.data.customData = value;
    }

    setPosX(value: IBombNote['x']) {
        this.posX = value;
        return this;
    }
    setPosY(value: IBombNote['y']) {
        this.posY = value;
        return this;
    }

    /** Get bomb note and return the Beatwalls' position x and y value in tuple.
     * ```ts
     * const bombPos = bomb.getPosition();
     * ```
     */
    getPosition(): [number, number] {
        // if (bomb._customData?._position) {
        //     return [bomb._customData._position[0], bomb._customData._position[1]];
        // }
        return [
            (this.posX <= -1000
                ? this.posX / 1000
                : this.posX >= 1000
                ? this.posX / 1000
                : this.posX) - 2,
            this.posY <= -1000
                ? this.posY / 1000
                : this.posY >= 1000
                ? this.posY / 1000
                : this.posY,
        ];
    }

    /** Get two bomb notes and return the distance between two bomb notes.
     * ```ts
     * const bombDistance = bomb.distance(bombCompare);
     * ```
     */
    getDistance(compareTo: BombNote) {
        const [nX1, nY1] = this.getPosition();
        const [nX2, nY2] = compareTo.getPosition();
        return Math.sqrt(Math.pow(nX2 - nX1, 2) + Math.pow(nY2 - nY1, 2));
    }

    /** Compare two bomb notes and return if the bomb notes is in vertical alignment.
     * ```ts
     * if (bomb.isVertical(bombCompare)) {}
     * ```
     */
    isVertical(compareTo: BombNote) {
        const [nX1] = this.getPosition();
        const [nX2] = compareTo.getPosition();
        const d = nX1 - nX2;
        return d > -0.001 && d < 0.001;
    }

    /** Compare two bomb notes and return if the bomb notes is in horizontal alignment.
     * ```ts
     * if (bomb.isHorizontal(bombCompare)) {}
     * ```
     */
    isHorizontal(compareTo: BombNote) {
        const [_, nY1] = this.getPosition();
        const [_2, nY2] = compareTo.getPosition();
        const d = nY1 - nY2;
        return d > -0.001 && d < 0.001;
    }

    /** Compare two bomb notes and return if the bomb notes is in diagonal alignment.
     * ```ts
     * if (bomb.isDiagonal(bombCompare)) {}
     * ```
     */
    isDiagonal(compareTo: BombNote) {
        const [nX1, nY1] = this.getPosition();
        const [nX2, nY2] = compareTo.getPosition();
        const dX = Math.abs(nX1 - nX2);
        const dY = Math.abs(nY1 - nY2);
        return dX === dY;
    }

    /** Compare two bomb notes and return if the bomb notes is an inline.
     * ```ts
     * if (bomb.isInline(bombCompare)) {}
     * ```
     */
    isInline(compareTo: BombNote, lapping = 0.5) {
        return this.getDistance(compareTo) <= lapping;
    }

    /** Compare two bomb notes and return if the bomb notes is adjacent.
     * ```ts
     * if (bomb.isAdjacent(bombCompare)) {}
     * ```
     */
    isAdjacent(compareTo: BombNote) {
        const d = this.getDistance(compareTo);
        return d > 0.499 && d < 1.001;
    }

    /** Compare two bomb notes and return if the bomb notes is a window.
     * ```ts
     * if (bomb.isWindow(bombCompare)) {}
     * ```
     */
    isWindow(compareTo: BombNote, distance = 1.8) {
        return this.getDistance(compareTo) > distance;
    }

    /** Compare two bomb notes and return if the bomb notes is a slanted window.
     * ```ts
     * if (bomb.isSlantedWindow(bombCompare)) {}
     * ```
     */
    isSlantedWindow(compareTo: BombNote) {
        return (
            this.isWindow(compareTo) &&
            !this.isDiagonal(compareTo) &&
            !this.isHorizontal(compareTo) &&
            !this.isVertical(compareTo)
        );
    }

    /** Check if bomb has Mapping Extensions properties.
     * ```ts
     * if (bomb.hasMappingExtensions()) {}
     * ```
     */
    hasMappingExtensions() {
        return this.posX > 3 || this.posX < 0 || this.posY > 2 || this.posY < 0;
    }

    mirror() {
        this.posX = LINE_COUNT - 1 - this.posX;
        return this;
    }
}
