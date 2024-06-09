import { UILoadingStatusType } from '../types/ui/loading';

const htmlLoadingBar: HTMLElement = document.querySelector('.loading__bar')!;
const htmlLoadingBarError = 'loading__bar--error';
const htmlLoadingBarDownload = 'loading__bar--download';
const htmlLoadingText: HTMLElement = document.querySelector('.loading__text')!;

function status(type: UILoadingStatusType, text: string, percentage: number = 100): void {
   htmlLoadingText.textContent = text;
   htmlLoadingBar.style.width = `${percentage}%`;
   type === 'error'
      ? htmlLoadingBar.classList.add(htmlLoadingBarError)
      : htmlLoadingBar.classList.remove(htmlLoadingBarError);
   type === 'download'
      ? htmlLoadingBar.classList.add(htmlLoadingBarDownload)
      : htmlLoadingBar.classList.remove(htmlLoadingBarDownload);
}

function reset(): void {
   status('info', 'No map loaded', 0);
}

export default {
   status,
   reset,
};
