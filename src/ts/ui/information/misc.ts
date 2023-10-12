import { EnvironmentRename } from '../../beatmap/shared/environment';
import { toHhmmss } from '../../utils';
import {
   htmlTableTimeSpend,
   htmlTableInformation,
   htmlTableRequirements,
   htmlTableSuggestions,
   htmlTableVersion,
   htmlTableWarnings,
   htmlTableEnvironmentId,
} from './constants';
import { displayTableRow, hideTableRow } from './helpers';

export function setVersion(ver?: string): void {
   if (ver == null) {
      hideTableRow(htmlTableVersion);
      return;
   }
   displayTableRow(htmlTableVersion, ver);
}

export function setEnvironmentId(env?: string): void {
   if (env == null) {
      hideTableRow(htmlTableEnvironmentId);
      return;
   }
   let textContent =
      (EnvironmentRename[env as keyof typeof EnvironmentRename] || 'Unknown') + ' Environment';
   if (!EnvironmentRename[env as keyof typeof EnvironmentRename]) textContent += ` (${env})`;
   displayTableRow(htmlTableEnvironmentId, textContent);
}

export function setTimeSpend(num?: number): void {
   if (num == null) {
      hideTableRow(htmlTableTimeSpend);
      return;
   }
   displayTableRow(htmlTableTimeSpend, toHhmmss(num));
}

export function setRequirements(arr?: string[]): void {
   if (arr == null || !arr.length) {
      hideTableRow(htmlTableRequirements);
      return;
   }
   displayTableRow(htmlTableRequirements, arr.join(', '));
}

export function setSuggestions(arr?: string[]): void {
   if (arr == null || !arr.length) {
      hideTableRow(htmlTableSuggestions);
      return;
   }
   displayTableRow(htmlTableSuggestions, arr.join(', '));
}

export function setInformation(arr?: string[]): void {
   if (arr == null || !arr.length) {
      hideTableRow(htmlTableInformation);
      return;
   }
   displayTableRow(htmlTableInformation, arr);
}

export function setWarnings(arr?: string[]): void {
   if (arr == null || !arr.length) {
      hideTableRow(htmlTableWarnings);
      return;
   }
   displayTableRow(htmlTableWarnings, arr);
}
