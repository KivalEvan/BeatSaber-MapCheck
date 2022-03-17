import { ILightColorEventBox } from '../../types/beatmap/v3/lightColorEventBox';
import { ILightColorEventBoxGroup } from '../../types/beatmap/v3/lightColorEventBoxGroup';
import { DeepPartial, ObjectToReturn } from '../../types/utils';
import { EventBoxGroupTemplate } from './eventBoxGroupTemplate';
import { LightColorEventBox } from './lightColorEventBox';

export class LightColorEventBoxGroup extends EventBoxGroupTemplate<
    ILightColorEventBox,
    LightColorEventBox
> {
    static default: ObjectToReturn<ILightColorEventBoxGroup> = {
        b: 0,
        g: 0,
        e: () => [],
    };

    private constructor(eventBoxGroup: Required<ILightColorEventBoxGroup>) {
        super(
            eventBoxGroup,
            eventBoxGroup.e.map((e) => LightColorEventBox.create(e))
        );
    }

    static create(): LightColorEventBoxGroup;
    static create(
        eventBoxGroups: DeepPartial<ILightColorEventBoxGroup>
    ): LightColorEventBoxGroup;
    static create(
        ...eventBoxGroups: DeepPartial<ILightColorEventBoxGroup>[]
    ): LightColorEventBoxGroup[];
    static create(
        ...eventBoxGroups: DeepPartial<ILightColorEventBoxGroup>[]
    ): LightColorEventBoxGroup | LightColorEventBoxGroup[] {
        const result: LightColorEventBoxGroup[] = [];
        eventBoxGroups?.forEach((ebg) =>
            result.push(
                new LightColorEventBoxGroup({
                    b: ebg.b ?? LightColorEventBoxGroup.default.b,
                    g: ebg.g ?? LightColorEventBoxGroup.default.g,
                    e:
                        (ebg as Required<ILightColorEventBoxGroup>).e ??
                        LightColorEventBoxGroup.default.e(),
                })
            )
        );
        if (result.length === 1) {
            return result[0];
        }
        if (result.length) {
            return result;
        }
        return new LightColorEventBoxGroup({
            b: LightColorEventBoxGroup.default.b,
            g: LightColorEventBoxGroup.default.g,
            e: LightColorEventBoxGroup.default.e(),
        });
    }
}
