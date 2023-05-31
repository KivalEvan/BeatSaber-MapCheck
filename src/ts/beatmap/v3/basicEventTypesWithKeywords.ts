import { IBasicEventTypesForKeywords } from '../../types/beatmap/v3/basicEventTypesForKeywords';
import { IBasicEventTypesWithKeywords } from '../../types/beatmap/v3/basicEventTypesWithKeywords';
import { IWrapEventTypesWithKeywordsAttribute } from '../../types/beatmap/wrapper/eventTypesWithKeywords';
import { DeepPartial, ObjectReturnFn } from '../../types/utils';
import { WrapEventTypesWithKeywords } from '../wrapper/eventTypesWithKeywords';
import { BasicEventTypesForKeywords } from './basicEventTypesForKeywords';

/** Basic event types with keywords beatmap v3 class object. */
export class BasicEventTypesWithKeywords extends WrapEventTypesWithKeywords<
    IBasicEventTypesWithKeywords,
    IBasicEventTypesForKeywords
> {
    static default: ObjectReturnFn<IBasicEventTypesWithKeywords> = {
        d: () => [],
    };

    constructor();
    constructor(
        data: DeepPartial<IWrapEventTypesWithKeywordsAttribute<IBasicEventTypesWithKeywords>>,
    );
    constructor(data: DeepPartial<IBasicEventTypesWithKeywords>);
    constructor(
        data: DeepPartial<IBasicEventTypesWithKeywords> &
            DeepPartial<IWrapEventTypesWithKeywordsAttribute<IBasicEventTypesWithKeywords>>,
    );
    constructor(
        data: DeepPartial<IBasicEventTypesWithKeywords> &
            DeepPartial<IWrapEventTypesWithKeywordsAttribute<IBasicEventTypesWithKeywords>> = {},
    ) {
        super();

        this._list = (
            (data.list?.map((k) => {
                return { k: k?.keyword, e: k?.events };
            }) as IBasicEventTypesForKeywords[]) ??
            data.d ??
            BasicEventTypesWithKeywords.default.d()
        ).map((d) => new BasicEventTypesForKeywords({ e: d.e, k: d.k }));
    }

    static create(): BasicEventTypesWithKeywords;
    static create(
        data: DeepPartial<IWrapEventTypesWithKeywordsAttribute<IBasicEventTypesWithKeywords>>,
    ): BasicEventTypesWithKeywords;
    static create(data: DeepPartial<IBasicEventTypesWithKeywords>): BasicEventTypesWithKeywords;
    static create(
        data: DeepPartial<IBasicEventTypesWithKeywords> &
            DeepPartial<IWrapEventTypesWithKeywordsAttribute<IBasicEventTypesWithKeywords>>,
    ): BasicEventTypesWithKeywords;
    static create(
        data: DeepPartial<IBasicEventTypesWithKeywords> &
            DeepPartial<IWrapEventTypesWithKeywordsAttribute<IBasicEventTypesWithKeywords>> = {},
    ): BasicEventTypesWithKeywords {
        return new this(data);
    }

    toJSON(): IBasicEventTypesWithKeywords {
        return {
            d: this.list.map((d) => d.toJSON()),
        };
    }

    get list() {
        return this._list as BasicEventTypesForKeywords[];
    }
    set list(value: BasicEventTypesForKeywords[]) {
        this._list = value;
    }

    addData(value: BasicEventTypesForKeywords) {
        this.list.push(value);
        return this;
    }
}
