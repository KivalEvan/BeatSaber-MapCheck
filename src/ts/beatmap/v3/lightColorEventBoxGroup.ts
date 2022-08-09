import { ILightColorEventBox } from '../../types/beatmap/v3/lightColorEventBox';
import { ILightColorEventBoxGroup } from '../../types/beatmap/v3/lightColorEventBoxGroup';
import { DeepPartial, ObjectReturnFn } from '../../types/utils';
import { EventBoxGroupTemplate } from './eventBoxGroupTemplate';
import { LightColorEventBox } from './lightColorEventBox';

/** Light color event box group beatmap v3 class object. */
export class LightColorEventBoxGroup extends EventBoxGroupTemplate<ILightColorEventBox, LightColorEventBox> {
    static default: ObjectReturnFn<Required<ILightColorEventBoxGroup>> = {
        b: 0,
        g: 0,
        e: () => [],
        customData: () => {
            return {};
        },
    };

    protected constructor(eventBoxGroup: Required<ILightColorEventBoxGroup>) {
        super(
            eventBoxGroup,
            eventBoxGroup.e.map((e) => LightColorEventBox.create(e)[0]),
        );
    }

    static create(): LightColorEventBoxGroup[];
    static create(...eventBoxGroups: DeepPartial<ILightColorEventBoxGroup>[]): LightColorEventBoxGroup[];
    static create(...eventBoxGroups: DeepPartial<ILightColorEventBoxGroup>[]): LightColorEventBoxGroup[] {
        const result: LightColorEventBoxGroup[] = [];
        eventBoxGroups?.forEach((ebg) =>
            result.push(
                new this({
                    b: ebg.b ?? LightColorEventBoxGroup.default.b,
                    g: ebg.g ?? LightColorEventBoxGroup.default.g,
                    e: (ebg as Required<ILightColorEventBoxGroup>).e ?? LightColorEventBoxGroup.default.e(),
                    customData: ebg.customData ?? LightColorEventBoxGroup.default.customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: LightColorEventBoxGroup.default.b,
                g: LightColorEventBoxGroup.default.g,
                e: LightColorEventBoxGroup.default.e(),
                customData: LightColorEventBoxGroup.default.customData(),
            }),
        ];
    }
}
