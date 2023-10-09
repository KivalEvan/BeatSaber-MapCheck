export default {
   enable: (bool: boolean) => {
      const htmlInputToggle = document.querySelectorAll<HTMLInputElement>('.input-toggle');
      htmlInputToggle.forEach((input) => {
         input.disabled = !bool;
      });
   },
};
