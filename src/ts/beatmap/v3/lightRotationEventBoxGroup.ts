import { ILightRotationEventBoxGroup } from '../../types/beatmap/v3/lightRotationEventBoxGroup';
import { ILightRotationEventBox } from '../../types/beatmap/v3/lightRotationEventBox';
import { DeepPartial, ObjectToReturn } from '../../types/utils';
import { EventBoxGroupTemplate } from './eventBoxGroupTemplate';
import { LightRotationEventBox } from './lightRotationEventBox';

/** Light rotation event box group beatmap v3 class object. */
export class LightRotationEventBoxGroup extends EventBoxGroupTemplate<ILightRotationEventBox, LightRotationEventBox> {
    static default: ObjectToReturn<Required<ILightRotationEventBoxGroup>> = {
        b: 0,
        g: 0,
        e: () => [],
        customData: () => {
            return {};
        },
    };

    private constructor(eventBoxGroup: Required<ILightRotationEventBoxGroup>) {
        super(
            eventBoxGroup,
            eventBoxGroup.e.map((e) => LightRotationEventBox.create(e)),
        );
    }

    static create(): LightRotationEventBoxGroup;
    static create(eventBoxGroups: DeepPartial<ILightRotationEventBoxGroup>): LightRotationEventBoxGroup;
    static create(...eventBoxGroups: DeepPartial<ILightRotationEventBoxGroup>[]): LightRotationEventBoxGroup[];
    static create(
        ...eventBoxGroups: DeepPartial<ILightRotationEventBoxGroup>[]
    ): LightRotationEventBoxGroup | LightRotationEventBoxGroup[] {
        const result: LightRotationEventBoxGroup[] = [];
        eventBoxGroups?.forEach((ebg) =>
            result.push(
                new this({
                    b: ebg.b ?? LightRotationEventBoxGroup.default.b,
                    g: ebg.g ?? LightRotationEventBoxGroup.default.g,
                    e: (ebg as Required<ILightRotationEventBoxGroup>).e ?? LightRotationEventBoxGroup.default.e(),
                    customData: ebg.customData ?? LightRotationEventBoxGroup.default.customData(),
                }),
            ),
        );
        if (result.length === 1) {
            return result[0];
        }
        if (result.length) {
            return result;
        }
        return new this({
            b: LightRotationEventBoxGroup.default.b,
            g: LightRotationEventBoxGroup.default.g,
            e: LightRotationEventBoxGroup.default.e(),
            customData: LightRotationEventBoxGroup.default.customData(),
        });
    }
}
