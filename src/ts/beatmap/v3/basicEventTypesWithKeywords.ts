import { IBasicEventTypesForKeywords } from '../../types/beatmap/v3/basicEventTypesForKeywords';
import { IBasicEventTypesWithKeywords } from '../../types/beatmap/v3/basicEventTypesWithKeywords';
import { IWrapEventTypesWithKeywordsAttribute } from '../../types/beatmap/wrapper/eventTypesWithKeywords';
import { DeepPartial, ObjectReturnFn } from '../../types/utils';
import { WrapEventTypesWithKeywords } from '../wrapper/eventTypesWithKeywords';
import { BasicEventTypesForKeywords } from './basicEventTypesForKeywords';

/** Basic event types with keywords beatmap v3 class object. */
export class BasicEventTypesWithKeywords extends WrapEventTypesWithKeywords<
    Required<IBasicEventTypesWithKeywords>,
    Required<IBasicEventTypesForKeywords>
> {
    static default: ObjectReturnFn<Required<IBasicEventTypesWithKeywords>> = {
        d: () => [],
    };

    private d: BasicEventTypesForKeywords[];
    protected constructor(basicEventTypesWithKeywords: Required<IBasicEventTypesWithKeywords>) {
        super(basicEventTypesWithKeywords);
        this.d = basicEventTypesWithKeywords.d.map(
            (d) => BasicEventTypesForKeywords.create({ e: d.e, k: d.k })[0],
        );
    }

    static create(): BasicEventTypesWithKeywords;
    static create(
        basicEventTypesWithKeywords: DeepPartial<
            IWrapEventTypesWithKeywordsAttribute<Required<IBasicEventTypesWithKeywords>>
        >,
    ): BasicEventTypesWithKeywords;
    static create(
        basicEventTypesWithKeywords: DeepPartial<IBasicEventTypesWithKeywords>,
    ): BasicEventTypesWithKeywords;
    static create(
        basicEventTypesWithKeywords: DeepPartial<IBasicEventTypesWithKeywords> &
            DeepPartial<
                IWrapEventTypesWithKeywordsAttribute<Required<IBasicEventTypesWithKeywords>>
            >,
    ): BasicEventTypesWithKeywords;
    static create(
        basicEventTypesWithKeywords: DeepPartial<IBasicEventTypesWithKeywords> &
            DeepPartial<
                IWrapEventTypesWithKeywordsAttribute<Required<IBasicEventTypesWithKeywords>>
            > = {},
    ): BasicEventTypesWithKeywords {
        return new this({
            d:
                (basicEventTypesWithKeywords.list?.map((k) => {
                    return { k: k?.keyword, e: k?.events };
                }) as IBasicEventTypesForKeywords[]) ??
                basicEventTypesWithKeywords.d ??
                BasicEventTypesWithKeywords.default.d(),
        });
    }

    toJSON(): IBasicEventTypesWithKeywords {
        return {
            d: this.list.map((d) => d.toJSON()),
        };
    }

    get list() {
        return this.d;
    }
    set list(value: BasicEventTypesForKeywords[]) {
        this.d = value;
    }

    addData(value: BasicEventTypesForKeywords) {
        this.list.push(value);
        return this;
    }
}
