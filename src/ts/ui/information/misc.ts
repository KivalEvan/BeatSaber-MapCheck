import { EnvironmentRename } from 'bsmap';
import { minToHhmmss } from 'bsmap/utils';
import { UIInfoHTML } from './html';
import { displayTableRow, hideTableRow } from './helpers';

export function setVersion(ver?: string): void {
   if (ver == null) {
      hideTableRow(UIInfoHTML.htmlTableVersion);
      return;
   }
   displayTableRow(UIInfoHTML.htmlTableVersion, ver);
}

export function setMappers(mappers?: string[]): void {
   if (mappers == null || !mappers.length) {
      hideTableRow(UIInfoHTML.htmlTableMappers);
      return;
   }
   let textContent = mappers.join(', ');
   displayTableRow(UIInfoHTML.htmlTableMappers, textContent);
}

export function setLighters(lighters?: string[]): void {
   if (lighters == null || !lighters.length) {
      hideTableRow(UIInfoHTML.htmlTableLighters);
      return;
   }
   let textContent = lighters.join(', ');
   displayTableRow(UIInfoHTML.htmlTableLighters, textContent);
}

export function setEnvironmentId(env?: string): void {
   if (env == null) {
      hideTableRow(UIInfoHTML.htmlTableEnvironmentId);
      return;
   }
   let textContent =
      (EnvironmentRename[env as keyof typeof EnvironmentRename] || 'Unknown') + ' Environment';
   if (!EnvironmentRename[env as keyof typeof EnvironmentRename]) {
      textContent += ` (${env})`;
   }
   displayTableRow(UIInfoHTML.htmlTableEnvironmentId, textContent);
}

export function setTimeSpend(num?: number): void {
   if (num == null) {
      hideTableRow(UIInfoHTML.htmlTableTimeSpend);
      return;
   }
   displayTableRow(UIInfoHTML.htmlTableTimeSpend, minToHhmmss(num));
}

export function setRequirements(arr?: string[]): void {
   if (arr == null || !arr.length) {
      hideTableRow(UIInfoHTML.htmlTableRequirements);
      return;
   }
   displayTableRow(UIInfoHTML.htmlTableRequirements, arr, 'requirements');
}

export function setSuggestions(arr?: string[]): void {
   if (arr == null || !arr.length) {
      hideTableRow(UIInfoHTML.htmlTableSuggestions);
      return;
   }
   displayTableRow(UIInfoHTML.htmlTableSuggestions, arr, 'suggestions');
}

export function setInformation(arr?: string[]): void {
   if (arr == null || !arr.length) {
      hideTableRow(UIInfoHTML.htmlTableInformation);
      return;
   }
   displayTableRow(UIInfoHTML.htmlTableInformation, arr, 'informations');
}

export function setWarnings(arr?: string[]): void {
   if (arr == null || !arr.length) {
      hideTableRow(UIInfoHTML.htmlTableWarnings);
      return;
   }
   displayTableRow(UIInfoHTML.htmlTableWarnings, arr, 'warnings');
}
