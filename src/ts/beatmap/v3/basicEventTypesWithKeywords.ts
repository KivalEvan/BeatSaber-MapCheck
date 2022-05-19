import { IBasicEventTypesForKeywords } from '../../types/beatmap/v3/basicEventTypesForKeywords';
import { IBasicEventTypesWithKeywords } from '../../types/beatmap/v3/basicEventTypesWithKeywords';
import { ObjectToReturn } from '../../types/utils';
import { Serializable } from '../shared/serializable';
import { BasicEventTypesForKeywords } from './basicEventTypesForKeywords';

/** Basic event types with keywords. */
export class BasicEventTypesWithKeywords extends Serializable<IBasicEventTypesWithKeywords> {
    static default: ObjectToReturn<Required<IBasicEventTypesWithKeywords>> = {
        d: () => [],
    };

    private d: BasicEventTypesForKeywords[];
    private constructor(
        basicEventTypesWithKeywords: Required<IBasicEventTypesWithKeywords>
    ) {
        super(basicEventTypesWithKeywords);
        this.d = basicEventTypesWithKeywords.d.map((d) =>
            BasicEventTypesForKeywords.create({ e: d.e, k: d.k })
        );
    }

    static create(
        basicEventTypesWithKeywords: Partial<IBasicEventTypesWithKeywords> = {}
    ): BasicEventTypesWithKeywords {
        return new BasicEventTypesWithKeywords({
            d: basicEventTypesWithKeywords.d ?? BasicEventTypesWithKeywords.default.d(),
        });
    }

    toObject(): IBasicEventTypesWithKeywords {
        return {
            d: this.list.map((d) => d.toObject()),
        };
    }

    /** Data list of basic event types with keywords. */
    get list() {
        return this.d;
    }
    set list(value: BasicEventTypesWithKeywords['d']) {
        this.d = value;
    }

    setData(value: BasicEventTypesWithKeywords['d']) {
        this.list = value;
        return this;
    }
    addData(value: IBasicEventTypesForKeywords) {
        this.list.push(BasicEventTypesForKeywords.create(value));
        return this;
    }
    removeData(value: string) {
        this.list = this.list.filter((d) => d.keyword !== value);
        return this;
    }
}
