import { ISlider } from '../../types/beatmap/v2/slider';
import { ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapSlider } from '../wrapper/slider';

/** Slider beatmap v2 class object. */
export class Slider extends WrapSlider<Required<ISlider>> {
    static default: ObjectReturnFn<Required<ISlider>> = {
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

    protected constructor(slider: Required<ISlider>) {
        super(slider);
    }

    static create(): Slider[];
    static create(...sliders: Partial<ISlider>[]): Slider[];
    static create(...sliders: Partial<ISlider>[]): Slider[] {
        const result: Slider[] = [];
        sliders?.forEach((s) =>
            result.push(
                new this({
                    _colorType: s._colorType ?? Slider.default._colorType,
                    _headTime: s._headTime ?? s._tailTime ?? Slider.default._headTime,
                    _headLineIndex: s._headLineIndex ?? Slider.default._headLineIndex,
                    _headLineLayer: s._headLineLayer ?? Slider.default._headLineLayer,
                    _headCutDirection: s._headCutDirection ?? Slider.default._headCutDirection,
                    _headControlPointLengthMultiplier:
                        s._headControlPointLengthMultiplier ?? Slider.default._headControlPointLengthMultiplier,
                    _tailTime: s._tailTime ?? s._headTime ?? Slider.default._tailTime,
                    _tailLineIndex: s._tailLineIndex ?? Slider.default._tailLineIndex,
                    _tailLineLayer: s._tailLineLayer ?? Slider.default._tailLineLayer,
                    _tailCutDirection: s._tailCutDirection ?? Slider.default._tailCutDirection,
                    _tailControlPointLengthMultiplier:
                        s._tailControlPointLengthMultiplier ?? Slider.default._tailControlPointLengthMultiplier,
                    _sliderMidAnchorMode: s._sliderMidAnchorMode ?? Slider.default._sliderMidAnchorMode,
                    _customData: s._customData ?? Slider.default._customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                _colorType: Slider.default._colorType,
                _headTime: Slider.default._headTime,
                _headLineIndex: Slider.default._headLineIndex,
                _headLineLayer: Slider.default._headLineLayer,
                _headCutDirection: Slider.default._headCutDirection,
                _headControlPointLengthMultiplier: Slider.default._headControlPointLengthMultiplier,
                _tailTime: Slider.default._tailTime,
                _tailLineIndex: Slider.default._tailLineIndex,
                _tailLineLayer: Slider.default._tailLineLayer,
                _tailCutDirection: Slider.default._tailCutDirection,
                _tailControlPointLengthMultiplier: Slider.default._tailControlPointLengthMultiplier,
                _sliderMidAnchorMode: Slider.default._sliderMidAnchorMode,
                _customData: Slider.default._customData(),
            }),
        ];
    }

    toJSON(): Required<ISlider> {
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

    get color() {
        return this.data._colorType;
    }
    set color(value: ISlider['_colorType']) {
        this.data._colorType = value;
    }

    get time() {
        return this.data._headTime;
    }
    set time(value: number) {
        this.data._headTime = value;
    }

    get posX() {
        return this.data._headLineIndex;
    }
    set posX(value: ISlider['_headLineIndex']) {
        this.data._headLineIndex = value;
    }

    get posY() {
        return this.data._headLineLayer;
    }
    set posY(value: ISlider['_headLineLayer']) {
        this.data._headLineLayer = value;
    }

    get direction() {
        return this.data._headCutDirection;
    }
    set direction(value: ISlider['_headCutDirection']) {
        this.data._headCutDirection = value;
    }

    get lengthMultiplier() {
        return this.data._headControlPointLengthMultiplier;
    }
    set lengthMultiplier(value: ISlider['_headControlPointLengthMultiplier']) {
        this.data._headControlPointLengthMultiplier = value;
    }

    get tailTime() {
        return this.data._tailTime;
    }
    set tailTime(value: number) {
        this.data._tailTime = value;
    }

    get tailPosX() {
        return this.data._tailLineIndex;
    }
    set tailPosX(value: ISlider['_tailLineIndex']) {
        this.data._tailLineIndex = value;
    }

    get tailPosY() {
        return this.data._tailLineLayer;
    }
    set tailPosY(value: ISlider['_tailLineLayer']) {
        this.data._tailLineLayer = value;
    }

    get tailDirection() {
        return this.data._tailCutDirection;
    }
    set tailDirection(value: ISlider['_tailCutDirection']) {
        this.data._tailCutDirection = value;
    }

    get tailLengthMultiplier() {
        return this.data._tailControlPointLengthMultiplier;
    }
    set tailLengthMultiplier(value: ISlider['_tailControlPointLengthMultiplier']) {
        this.data._tailControlPointLengthMultiplier = value;
    }

    get midAnchor() {
        return this.data._sliderMidAnchorMode;
    }
    set midAnchor(value: ISlider['_sliderMidAnchorMode']) {
        this.data._sliderMidAnchorMode = value;
    }

    get customData(): NonNullable<ISlider['_customData']> {
        return this.data._customData;
    }
    set customData(value: NonNullable<ISlider['_customData']>) {
        this.data._customData = value;
    }

    setCustomData(value: NonNullable<ISlider['_customData']>): this {
        this.customData = value;
        return this;
    }
    addCustomData(object: ISlider['_customData']): this {
        this.customData = { ...this.customData, object };
        return this;
    }
}
