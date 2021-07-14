const inputToggle = document.querySelectorAll<HTMLInputElement>('.input-toggle');

export const toggleInput = (bool: boolean) => {
    inputToggle.forEach((input) => {
        input.disabled = bool;
    });
};
