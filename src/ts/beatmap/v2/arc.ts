import { IArc } from '../../types/beatmap/v2/arc';
import { IWrapArcAttribute } from '../../types/beatmap/wrapper/arc';
import { ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapArc } from '../wrapper/arc';

/** Arc beatmap v2 class object. */
export class Arc extends WrapArc<IArc> {
    static default: ObjectReturnFn<IArc> = {
        _colorType: 0,
        _headTime: 0,
        _headLineIndex: 0,
        _headLineLayer: 0,
        _headCutDirection: 0,
        _headControlPointLengthMultiplier: 1,
        _tailTime: 0,
        _tailLineIndex: 0,
        _tailLineLayer: 0,
        _tailCutDirection: 0,
        _tailControlPointLengthMultiplier: 1,
        _sliderMidAnchorMode: 0,
        _customData: () => {
            return {};
        },
    };

    constructor();
    constructor(data: Partial<IWrapArcAttribute<IArc>>);
    constructor(data: Partial<IArc>);
    constructor(data: Partial<IArc> & Partial<IWrapArcAttribute<IArc>>);
    constructor(data: Partial<IArc> & Partial<IWrapArcAttribute<IArc>> = {}) {
        super();

        this._color = data.color ?? data._colorType ?? Arc.default._colorType;
        this._time = data.time ?? data._headTime ?? data._tailTime ?? Arc.default._headTime;
        this._posX = data.posX ?? data._headLineIndex ?? Arc.default._headLineIndex;
        this._posY = data.posY ?? data._headLineLayer ?? Arc.default._headLineLayer;
        this._direction =
            (data.direction as 0) ?? data._headCutDirection ?? Arc.default._headCutDirection;
        this._lengthMultiplier =
            data.lengthMultiplier ??
            data._headControlPointLengthMultiplier ??
            Arc.default._headControlPointLengthMultiplier;
        this._tailTime = data.tailTime ?? data._tailTime ?? data._headTime ?? Arc.default._tailTime;
        this._tailPosX = data.tailPosX ?? data._tailLineIndex ?? Arc.default._tailLineIndex;
        this._tailPosY = data.tailPosY ?? data._tailLineLayer ?? Arc.default._tailLineLayer;
        this._tailDirection =
            (data.tailDirection as 0) ?? data._tailCutDirection ?? Arc.default._tailCutDirection;
        this._tailLengthMultiplier =
            data.tailLengthMultiplier ??
            data._tailControlPointLengthMultiplier ??
            Arc.default._tailControlPointLengthMultiplier;
        this._midAnchor =
            data.midAnchor ?? data._sliderMidAnchorMode ?? Arc.default._sliderMidAnchorMode;
        this._customData = data.customData ?? data._customData ?? Arc.default._customData();
    }

    static create(): Arc[];
    static create(...data: Partial<IWrapArcAttribute<IArc>>[]): Arc[];
    static create(...data: Partial<IArc>[]): Arc[];
    static create(...data: (Partial<IArc> & Partial<IWrapArcAttribute<IArc>>)[]): Arc[];
    static create(...data: (Partial<IArc> & Partial<IWrapArcAttribute<IArc>>)[]): Arc[] {
        const result: Arc[] = [];
        data.forEach((obj) => result.push(new this(obj)));
        if (result.length) {
            return result;
        }
        return [new this()];
    }

    toJSON(): IArc {
        return {
            _colorType: this.color,
            _headTime: this.time,
            _headLineIndex: this.posX,
            _headLineLayer: this.posY,
            _headCutDirection: this.direction,
            _headControlPointLengthMultiplier: this.lengthMultiplier,
            _tailTime: this.tailTime,
            _tailLineIndex: this.tailPosX,
            _tailLineLayer: this.tailPosY,
            _tailCutDirection: this.tailDirection,
            _tailControlPointLengthMultiplier: this.tailLengthMultiplier,
            _sliderMidAnchorMode: this.midAnchor,
            _customData: deepCopy(this.customData),
        };
    }

    get customData(): NonNullable<IArc['_customData']> {
        return this._customData;
    }
    set customData(value: NonNullable<IArc['_customData']>) {
        this._customData = value;
    }
}
