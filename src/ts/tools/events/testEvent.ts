import { Tool, ToolArgs } from '../../types/mapcheck';
import UICheckbox from '../../ui/checkbox';
import { round } from '../../utils';

const name = ' Event Peak (1 second) and Per Second';

const tool: Tool = {
    name: 'Insufficient Light',
    description: 'Placeholder',
    type: 'event',
    order: {
        input: 2,
        output: 2,
    },
    input: {
        enabled: false,
        params: {},
        html: UICheckbox.create(name, name, false, function (this: HTMLInputElement) {
            tool.input.enabled = this.checked;
        }),
    },
    output: {
        html: null,
    },
    run,
};

function inputCheckHandler(this: HTMLInputElement) {
    tool.input.enabled = this.checked;
}

function check(map: ToolArgs) {
    const { bpm, audioDuration: duration } = map.settings;
    const { basicBeatmapEvents: events } = map.difficulty.data;

    let second = bpm.toBeatTime(1);
    let peakEPS = 0;
    let currentSectionStart = 0;
    for (let i = 0; i < events.length; i++) {
        while (events[i].time - events[currentSectionStart].time > second) {
            currentSectionStart++;
        }
        peakEPS = Math.max(
            peakEPS,
            (i - currentSectionStart + second) / ((1 / bpm.value) * 60)
        );
    }
    return {
        EPS: duration ? round(events.length / duration, 3) : 0,
        peakEPS: round(peakEPS, 3),
    };
}

function run(map: ToolArgs) {
    const result = check(map);

    if (result) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = `<b>Events per second:</b> ${result.EPS}<br><b>Peak Event (1s):</b> ${result.peakEPS}`;
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
