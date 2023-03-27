import { IndexFilterType } from '../../beatmap/mod';
import { EventList } from '../../beatmap/shared/environment';
import { Difficulty } from '../../beatmap/v3/difficulty';
import { EnvironmentAllName, EnvironmentV3Name } from '../../types/beatmap/shared/environment';
import { IWrapEventBoxGroup } from '../../types/beatmap/wrapper/eventBoxGroup';
import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import UICheckbox from '../../ui/helpers/checkbox';
import { printResultTime } from '../helpers';

const name = 'Invalid Event Box';
const description = 'Check for valid event box group usage.';
const enabled = true;

const tool: Tool = {
    name,
    description,
    type: 'event',
    order: {
        input: ToolInputOrder.EVENTS_INVALID_EVENT_BOX,
        output: ToolOutputOrder.EVENTS_INVALID_EVENT_BOX,
    },
    input: {
        enabled,
        params: {},
        html: UICheckbox.create(name, description, enabled, function (this: HTMLInputElement) {
            tool.input.enabled = this.checked;
        }),
    },
    output: {
        html: null,
    },
    run,
};

const environmentV3: EnvironmentV3Name[] = [
    'EDMEnvironment',
    'LizzoEnvironment',
    'PyroEnvironment',
    'TheSecondEnvironment',
    'TheWeekndEnvironment',
    'WeaveEnvironment',
];
const envFilterID: Record<EnvironmentV3Name, Record<number, number>> = {
    EDMEnvironment: {
        0: 24,
        1: 24,
        2: 24,
        3: 24,
        4: 24,
        5: 24,
        6: 10,
        7: 10,
        8: 10,
        9: 10,
        10: 10,
        11: 10,
        12: 10,
        13: 10,
        14: 1,
        15: 1,
        16: 1,
        17: 1,
    },
    LizzoEnvironment: {
        0: 40,
        1: 16,
        2: 16,
        3: 16,
        4: 16,
        5: 16,
        6: 1,
        7: 1,
        8: 12,
        9: 12,
        10: 12,
        11: 6,
        12: 6,
        13: 14,
        14: 14,
        15: 4,
        16: 4,
        17: 3,
        18: 3,
        19: 14,
    },
    PyroEnvironment: { 0: 3, 1: 3, 2: 5, 3: 5, 4: 3, 5: 12, 6: 48, 7: 48, 8: 4, 9: 4, 10: 3, 11: 3, 12: 10, 13: 10 },
    TheSecondEnvironment: {
        0: 15,
        1: 24,
        2: 12,
        3: 12,
        4: 12,
        5: 12,
        6: 4,
        7: 4,
        8: 4,
        9: 4,
        10: 4,
        11: 4,
        12: 4,
        13: 4,
    },
    TheWeekndEnvironment: {
        0: 4,
        1: 4,
        2: 4,
        3: 4,
        4: 8,
        5: 4,
        6: 4,
        7: 12,
        8: 1,
        9: 6,
        10: 25,
        11: 25,
        12: 25,
        13: 25,
        14: 25,
        15: 25,
        16: 25,
        17: 25,
        18: 25,
        19: 25,
        20: 3,
        21: 3,
        22: 8,
        23: 8,
        29: 3,
        30: 3,
        31: 3,
        32: 3,
        33: 3,
        34: 3,
        35: 3,
        36: 3,
        37: 6,
        38: 6,
        40: 2,
    },
    RockMixtapeEnvironment: {
        0: 5,
        1: 5,
        2: 10,
        3: 10,
        4: 10,
        5: 10,
        6: 10,
        7: 10,
        8: 10,
        9: 10,
        10: 10,
        11: 10,
        12: 10,
        13: 10,
        14: 3,
        15: 10,
        16: 5,
        17: 5,
        18: 24,
        19: 24,
        20: 12,
        21: 12,
        22: 8,
        23: 8,
        24: 36,
        25: 3,
        26: 36,
        27: 3,
        28: 5,
        29: 2,
        30: 16,
        31: 4,
        32: 4,
        33: 4,
        34: 4,
        35: 2,
        36: 2,
        37: 2,
    },
    WeaveEnvironment: {
        0: 8,
        1: 8,
        2: 8,
        3: 8,
        4: 8,
        5: 8,
        6: 8,
        7: 8,
        8: 8,
        9: 8,
        10: 8,
        11: 8,
        12: 12,
        13: 12,
        14: 8,
        15: 8,
    },
    Dragons2Environment: {},
};
// FIXME: EDMEnvironment special case 12 and 13 filter is 1 for rotation
function check(map: Difficulty, environment: EnvironmentAllName) {
    const defectID: IWrapEventBoxGroup[] = [];
    const defectFilter: IWrapEventBoxGroup[] = [];

    if (!environmentV3.includes(environment as EnvironmentV3Name)) return { defectID: [], defectFilter: [] };
    const envV3 = environment as EnvironmentV3Name;
    const eventListEBG = EventList[envV3][1];

    const ebg = [
        ...map.lightColorEventBoxGroups,
        ...map.lightRotationEventBoxGroups,
        ...map.lightTranslationEventBoxGroups,
    ];
    for (const g of ebg) {
        if (!eventListEBG.includes(g.id)) {
            defectID.push(g);
        }
        for (const eb of g.boxes) {
            const filter = eb.filter;
            if (filter.type === IndexFilterType.STEP_AND_OFFSET) {
                if (filter.p0 > envFilterID[envV3][g.id]) {
                    defectFilter.push(g);
                }
            }
        }
    }

    return {
        defectID: defectID
            .map((n) => n.time)
            .filter(function (x, i, ary) {
                return !i || x !== ary[i - 1];
            }),
        defectFilter: defectFilter
            .map((n) => n.time)
            .filter(function (x, i, ary) {
                return !i || x !== ary[i - 1];
            }),
    };
}

function run(map: ToolArgs) {
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const result = check(
        map.difficulty.data,
        map.difficulty.characteristic === '360Degree' || map.difficulty.characteristic === '90Degree'
            ? map.info._allDirectionsEnvironmentName
            : map.info._environmentName,
    );

    const htmlResult: HTMLElement[] = [];
    if (result.defectID.length) {
        htmlResult.push(printResultTime('Invalid event box group ID', result.defectID, map.settings.bpm, 'error'));
    }
    if (result.defectFilter.length) {
        htmlResult.push(printResultTime('Invalid event box filter', result.defectFilter, map.settings.bpm, 'error'));
    }

    if (htmlResult.length) {
        const htmlContainer = document.createElement('div');
        htmlResult.forEach((h) => htmlContainer.append(h));
        tool.output.html = htmlContainer;
    } else {
        tool.output.html = null;
    }
}

export default tool;
