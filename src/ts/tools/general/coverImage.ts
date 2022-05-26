import { Tool } from '../../types/mapcheck';
import uiHeader from '../../ui/header';
import flag from '../../flag';
import settings from '../../settings';

const tool: Tool = {
    name: 'Cover Image',
    description: 'Placeholder',
    type: 'general',
    order: {
        input: 0,
        output: 0,
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

function run() {
    const img = new Image();
    const src = uiHeader.getCoverImage();

    const htmlString: string[] = [];
    if (flag.loading.coverImage && src !== null) {
        img.src = src;
        if (img.width !== img.height) {
            htmlString.push('<b>Cover image is not square:</b> resize to fit square');
        }
        if (img.width < 256 || img.height < 256) {
            htmlString.push('<b>Cover image is too small:</b> require at least 256x256');
        }
    } else {
        htmlString.push(
            '<b>No cover image:</b> ' +
                (settings.load.imageCover ? 'could not be loaded or found' : 'no cover image option is enabled'),
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
