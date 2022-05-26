import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';

const tool: Tool = {
    name: 'Note Jump Speed',
    description: 'Placeholder',
    type: 'other',
    order: {
        input: 40,
        output: 40,
    },
    input: {
        enabled: true,
        params: {},
    },
    output: {
        html: null,
    },
    run,
};

function run(map: ToolArgs) {
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const { njs, bpm } = map.settings;
    const htmlString: string[] = [];

    if (map.difficulty.info._noteJumpMovementSpeed === 0) {
        htmlString.push(`<b>Unset NJS</b>: fallback NJS is used`);
    }
    if (njs.value > 23) {
        htmlString.push(`<b>NJS is too high (${round(njs.value, 2)}):</b> use lower whenever necessary`);
    }
    if (njs.jd < 18) {
        htmlString.push(`<b>Very low jump distance:</b> ${round(njs.jd, 2)}`);
    }
    if (njs.jd > 36) {
        htmlString.push(`<b>Very high jump distance:</b> ${round(njs.jd, 2)}`);
    }
    if (njs.jd > njs.calcJumpDistanceOptimalHigh()) {
        htmlString.push(
            `<b>High jump distance warning (>${round(njs.calcJumpDistanceOptimalHigh(), 2)}):</b> ${round(
                njs.jd,
                2,
            )} at ${round(njs.value, 2)} NJS may be uncomfortable to play`,
        );
    }
    if (bpm.toRealTime(njs.hjd) < 0.45) {
        htmlString.push(
            `<b>Very quick reaction time (${round(
                bpm.toRealTime(njs.hjd) * 1000,
            )}ms):</b> may lead to suboptimal gameplay`,
        );
    }
    if (njs.calcHalfJumpDurationRaw() + njs.offset < njs.hjdMin) {
        htmlString.push(`<b>Unnecessary negative offset:</b> will not drop below ${njs.hjdMin}`);
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
