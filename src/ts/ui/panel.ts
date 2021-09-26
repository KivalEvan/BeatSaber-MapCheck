type PanelSizeType = 'tiny' | 'small' | 'medium' | 'large' | 'max';
enum PanelSize {
    'tiny' = 'panel--tiny',
    'small' = 'panel--small',
    'medium' = 'panel--medium',
    'large' = 'panel--large',
    'max' = 'panel--max',
}

type PanelOffsetType = 'normal' | 'half' | 'none';
enum PanelOffset {
    'none' = '',
    'normal' = 'panel--offset',
    'half' = 'panel--offset-half',
}

export const create = (
    size: PanelSizeType,
    offset?: PanelOffsetType,
    flex?: boolean,
    column?: boolean
): HTMLElement => {
    const htmlPanel = document.createElement('div');
    htmlPanel.className = `panel ${PanelSize[size]}`;
    if (offset && offset !== 'none') {
        htmlPanel.classList.add(PanelOffset[offset]);
    }
    if (flex) {
        htmlPanel.classList.add('panel--flex' + column ? '-column' : '');
    }

    return htmlPanel;
};
