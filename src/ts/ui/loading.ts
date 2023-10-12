import { UILoadingStatusType } from '../types/mapcheck/ui/loading';

const htmlLoadingBar: HTMLElement = document.querySelector('.loading__bar')!;
const htmlLoadingBarError = 'loading__bar--error';
const htmlLoadingBarDownload = 'loading__bar--download';
const htmlLoadingText: HTMLElement = document.querySelector('.loading__text')!;

function status(
   statusType: UILoadingStatusType,
   statusString: string,
   percentage: number = 100,
): void {
   htmlLoadingText.textContent = statusString;
   htmlLoadingBar.style.width = `${percentage}%`;
   statusType === 'error'
      ? htmlLoadingBar.classList.add(htmlLoadingBarError)
      : htmlLoadingBar.classList.remove(htmlLoadingBarError);
   statusType === 'download'
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
