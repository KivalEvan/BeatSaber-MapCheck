import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { ColorArray } from '../../types/beatmap/shared/colors';
import { deltaE00, toRGBArray, round } from '../../utils';
import * as beatmap from '../../beatmap';
import UICheckbox from '../../ui/helpers/checkbox';
import { printResult } from '../helpers';

const arrowColor: ColorArray = [1, 1, 1];

const deltaELevel: { [key: number]: string } = {
    1: 'Indistinguishable',
    5: 'Hardly perceivable',
    10: 'Close apparent',
    20: 'Mildly similar',
    40: 'Different',
    90: 'Discernible',
    100: 'Opposite',
} as const;

const levelMsg = (level: { [key: number]: string }, perc: number): string => {
    let findKey = Object.keys(level).find((s) => parseFloat(s) >= perc) ?? '100';
    let key = parseFloat(findKey);
    return level[key];
};

const name = 'Color Check (EXPERIMENTAL)';
const description = 'Compare note color with other colored note and the arrow on itself.';
const enabled = true;

const tool: Tool = {
    name,
    description,
    type: 'note',
    order: {
        input: ToolInputOrder.NOTES_COLOR_CHECK,
        output: ToolOutputOrder.NOTES_COLOR_CHECK,
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

function customColorSimilarity(map: ToolArgs) {
    const checkColorLeft =
        map.difficulty?.info._customData?._colorLeft ??
        beatmap.ColorScheme[beatmap.EnvironmentSchemeName[map.info._environmentName] ?? 'The First']._colorLeft;
    const checkColorRight =
        map.difficulty?.info._customData?._colorRight ??
        beatmap.ColorScheme[beatmap.EnvironmentSchemeName[map.info._environmentName] ?? 'The First']._colorRight;
    if (checkColorLeft && checkColorRight) {
        return deltaE00(toRGBArray(checkColorLeft), toRGBArray(checkColorRight));
    }
    return 100;
}

function customColorArrowSimilarity(map: ToolArgs) {
    let deltaELeft = 100,
        deltaERight = 100;
    const checkColorLeft =
        map.difficulty?.info._customData?._colorLeft ??
        beatmap.ColorScheme[beatmap.EnvironmentSchemeName[map.info._environmentName] ?? 'The First']._colorLeft;
    const checkColorRight =
        map.difficulty?.info._customData?._colorRight ??
        beatmap.ColorScheme[beatmap.EnvironmentSchemeName[map.info._environmentName] ?? 'The First']._colorRight;
    if (checkColorLeft) {
        deltaELeft = deltaE00(arrowColor, toRGBArray(checkColorLeft));
    }
    if (checkColorRight) {
        deltaERight = deltaE00(arrowColor, toRGBArray(checkColorRight));
    }
    return Math.min(deltaELeft, deltaERight);
}

function run(map: ToolArgs) {
    if (!map.difficulty?.info._customData?._colorLeft && !map.difficulty?.info._customData?._colorRight) {
        return;
    }

    const ccSimilar = customColorSimilarity(map);
    const ccaSimilar = customColorArrowSimilarity(map);

    const htmlResult: HTMLElement[] = [];
    if (ccSimilar <= 20) {
        htmlResult.push(
            printResult(
                `${levelMsg(deltaELevel, ccSimilar)} note color (dE${round(ccSimilar, 1)})`,
                'suggest change to better differentiate between 2 note colour',
            ),
        );
    }
    if (ccaSimilar <= 20) {
        htmlResult.push(
            printResult(
                `${levelMsg(deltaELevel, ccaSimilar)} arrow note color (dE${round(ccaSimilar, 1)})`,
                'may be difficult to see the arrow',
            ),
        );
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
