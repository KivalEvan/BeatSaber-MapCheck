export function toggleInputs(bool: boolean): void {
   const htmlInputToggle = document.querySelectorAll<HTMLInputElement>('.input-toggle');
   htmlInputToggle.forEach((input) => {
      input.disabled = !bool;
   });
}
