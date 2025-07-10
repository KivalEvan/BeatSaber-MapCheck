export class UISelect {
   static create(
      id: string,
      label: string,
      containerTag: string,
      containerClass: string,
      ...options: { text: string; value: string }[]
   ): HTMLElement {
      const htmlContainer = document.createElement(containerTag);
      htmlContainer.className = containerClass;

      const htmlSelect = document.createElement('select');
      htmlSelect.className = 'input-toggle';
      htmlSelect.id = id;

      options.forEach((option) => {
         const htmlOption = document.createElement('option');
         htmlOption.textContent = option.text;
         htmlOption.value = option.value;
         htmlSelect.append(htmlOption);
      });

      const htmlLabel = document.createElement('label');
      htmlLabel.htmlFor = id;
      htmlLabel.innerHTML = `<span>${label}</span>`;

      htmlContainer.append(htmlLabel);
      htmlContainer.append(htmlSelect);

      return htmlContainer;
   }
}
