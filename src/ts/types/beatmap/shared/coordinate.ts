interface ICoordinateBase<T> {
    posX: number;
    posY: number;
    setPosX(value: number): T;
    setPosY(value: number): T;
    getPosition(): [number, number];
    getDistance(compareTo: T): number;
}

export interface ICoordinateNote<T> extends ICoordinateBase<T> {
    isVertical(compareTo?: T): boolean;
    isHorizontal(compareTo?: T): boolean;
    isDiagonal(compareTo?: T): boolean;
    isInline(compareTo: T): boolean;
    isAdjacent(compareTo: T): boolean;
    isWindow(compareTo: T): boolean;
    isSlantedWindow(compareTo: T): boolean;
}
