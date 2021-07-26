type PanelSizeType = 'tiny' | 'small' | 'medium' | 'large' | 'max';
enum PanelSize {
    'tiny' = 'panel--tiny',
    'small' = 'panel--small',
    'medium' = 'panel--medium',
    'large' = 'panel--large',
    'max' = 'panel--max',
}

type PanelOffsetType = 'normal' | 'half';
enum PanelOffset {
    'normal' = 'panel--offset',
    'half' = 'panel--offset-half',
}

export const create = (size: PanelSizeType, offset?: PanelOffsetType): HTMLElement => {
    const htmlPanel = document.createElement('div');
    htmlPanel.className = `panel ${PanelSize[size]}`;
    if (offset) {
        htmlPanel.classList.add(PanelOffset[offset]);
    }

    return htmlPanel;
};
