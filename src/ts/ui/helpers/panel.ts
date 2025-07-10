export enum PanelSize {
   TINY = 'panel--tiny',
   X_SMALl = 'panel--x-small',
   SMALL = 'panel--small',
   MEDIUM = 'panel--medium',
   LARGE = 'panel--large',
   X_LARGE = 'panel--x-large',
   MAX = 'panel--max',
}

export enum PanelOffset {
   NORMAL = 'panel--offset',
   HALF = 'panel--offset-half',
   NONE = '',
}

export default {
   create: (
      size: PanelSize,
      offset?: PanelOffset,
      flex?: boolean,
      column?: boolean,
   ): HTMLDivElement => {
      const htmlPanel = document.createElement('div');
      htmlPanel.className = `panel ${size}`;
      if (offset) {
         htmlPanel.classList.add(offset);
      }
      if (flex) {
         htmlPanel.classList.add('panel--flex' + (column ? '-column' : ''));
      }

      return htmlPanel;
   },
};
