let counter = 0;

export default {
   createBlock: function (...childs: (HTMLElement[] | HTMLElement)[]): HTMLDivElement {
      const div = document.createElement('div');
      for (const child of childs) {
         if (Array.isArray(child)) {
            for (const c of child) div.append(c);
         } else div.appendChild(child);
      }
      return div;
   },
   createText: function (
      callback: EventListener,
      label: string,
      value: string,
   ): [HTMLInputElement, HTMLLabelElement] {
      const internalName = `input-${counter++}`;
      const htmlInput = document.createElement('input');
      const htmlLabel = document.createElement('label');

      htmlInput.id = 'input__gen-' + internalName;
      htmlInput.className = 'input-toggle input--small';
      htmlInput.type = 'text';
      htmlInput.value = value;
      htmlInput.addEventListener('change', callback);
      if (label) {
         htmlLabel.textContent = label;
         htmlLabel.htmlFor = 'input__gen-' + internalName;
      }

      return [htmlInput, htmlLabel];
   },
   createNumber: function (
      callback: EventListener,
      label: string,
      value: number,
      min?: number | null,
      max?: number | null,
      step?: number | null,
   ): [HTMLLabelElement, HTMLInputElement] {
      const internalName = `input-${counter++}`;
      const htmlInput = document.createElement('input');
      const htmlLabel = document.createElement('label');

      htmlInput.id = 'input__gen-' + internalName;
      htmlInput.className = 'input-toggle input--small';
      htmlInput.type = 'text';
      htmlInput.value = value.toString();
      htmlInput.addEventListener('change', callback);
      if (label) {
         htmlLabel.textContent = label;
         htmlLabel.htmlFor = 'input__gen-' + internalName;
      }
      if (typeof min === 'number') htmlInput.min = min.toString();
      if (typeof max === 'number') htmlInput.max = max.toString();
      if (typeof step === 'number') htmlInput.step = step.toString();

      return [htmlLabel, htmlInput];
   },
   createCheckbox: function (
      callback: EventListener,
      label: string,
      title: string,
      bool: boolean,
   ): [HTMLInputElement, HTMLLabelElement] {
      const internalName = `input-${counter++}`;
      const htmlInput = document.createElement('input');
      const htmlLabel = document.createElement('label');

      htmlLabel.textContent = ' ' + label;
      htmlLabel.title = title;
      htmlLabel.htmlFor = 'input__gen-' + internalName;
      htmlInput.id = 'input__gen-' + internalName;
      htmlInput.className = 'input-toggle';
      htmlInput.type = 'checkbox';
      htmlInput.checked = bool;
      htmlInput.addEventListener('change', callback);

      return [htmlInput, htmlLabel];
   },
   createRadio: function (
      callback: EventListener,
      label: string,
      group: string,
      value: string,
      selected: boolean,
   ): [HTMLLabelElement, HTMLInputElement] {
      const internalName = `input-${counter++}`;
      const htmlInput = document.createElement('input');
      const htmlLabel = document.createElement('label');

      htmlLabel.textContent = label;
      htmlLabel.htmlFor = 'input__gen-' + internalName;
      htmlInput.id = 'input__gen-' + internalName;
      htmlInput.name = group;
      htmlInput.className = 'input-toggle';
      htmlInput.type = 'radio';
      htmlInput.checked = selected;
      htmlInput.value = value;
      htmlInput.addEventListener('change', callback);

      return [htmlLabel, htmlInput];
   },
};
