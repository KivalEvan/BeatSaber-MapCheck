export function createTab(
   id: string,
   label: string,
   group: string,
   value: string,
   selected: boolean,
   callback: EventListener,
): HTMLDivElement {
   const htmlTab = document.createElement('div');
   htmlTab.className = 'tabs__container';

   const radio = document.createElement('input');
   radio.className = 'tabs__radio';
   radio.type = 'radio';
   radio.id = id;
   radio.name = group;
   radio.value = value;
   radio.checked = selected;
   radio.addEventListener('change', callback);

   htmlTab.appendChild(radio);

   const htmlLabel = document.createElement('label');
   htmlLabel.className = 'tabs__label tabs__label-tab unselectable';
   htmlLabel.htmlFor = id;
   const str = label.split('\n');
   for (let i = 0; i < str.length; i++) {
      const s = str[i];
      const htmlSpan = document.createElement('span');
      htmlSpan.textContent = s;
      htmlLabel.appendChild(htmlSpan);
      if (i !== str.length - 1) htmlLabel.appendChild(document.createElement('br'));
   }
   htmlTab.appendChild(htmlLabel);

   return htmlTab;
}
