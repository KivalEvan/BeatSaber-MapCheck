import {
    UIPanelSizeType,
    UIPanelOffsetType,
    UIPanelSize,
    UIPanelOffset,
} from '../../types/mapcheck/ui/panel';

export default {
    create: (
        size: UIPanelSizeType,
        offset?: UIPanelOffsetType,
        flex?: boolean,
        column?: boolean
    ): HTMLDivElement => {
        const htmlPanel = document.createElement('div');
        htmlPanel.className = `panel ${UIPanelSize[size]}`;
        if (offset && offset !== 'none') {
            htmlPanel.classList.add(UIPanelOffset[offset]);
        }
        if (flex) {
            htmlPanel.classList.add('panel--flex' + column ? '-column' : '');
        }

        return htmlPanel;
    },
};
