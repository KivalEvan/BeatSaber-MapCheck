import { Tool, ToolArgs } from '../../types/mapcheck';
import { ColorArray } from '../../types/beatmap/shared/colors';
import { deltaE00, toRGBArray, round } from '../../utils';
import * as beatmap from '../../beatmap';
import UICheckbox from '../../ui/helpers/checkbox';

const arrowColor: ColorArray = [1, 1, 1];

const deltaELevel: { [key: number]: string } = {
    1: 'Indistinguishable',
    5: 'Hardly perceivable',
    10: 'Close apparent',
    20: 'Mildly similar',
    40: 'Different',
    90: 'Discernible',
    100: 'Opposite',
};

const levelMsg = (level: { [key: number]: string }, perc: number): string => {
    let findKey = Object.keys(level).find((s) => parseFloat(s) >= perc) ?? '100';
    let key = parseFloat(findKey);
    return level[key];
};

const name = 'Color Check (EXPERIMENTAL)';

const tool: Tool = {
    name,
    description: 'Placeholder',
    type: 'note',
    order: {
        input: 97,
        output: 45,
    },
    input: {
        enabled: true,
        params: {},
        html: UICheckbox.create(name, name, true, function (this: HTMLInputElement) {
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

    const htmlString: string[] = [];
    if (ccSimilar <= 20) {
        htmlString.push(
            `<b>${levelMsg(deltaELevel, ccSimilar)} note color (dE${round(
                ccSimilar,
                1,
            )}):</b> suggest change to better differentiate between 2 note colour`,
        );
    }
    if (ccaSimilar <= 20) {
        htmlString.push(
            `<b>${levelMsg(deltaELevel, ccaSimilar)} arrow note color (dE${round(
                ccaSimilar,
                1,
            )}):</b> may be difficult to see the arrow`,
        );
    }

    if (htmlString.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = htmlString.join('<br>');
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
