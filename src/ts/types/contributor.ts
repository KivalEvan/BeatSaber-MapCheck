import { IContributor } from 'bsmap';

export interface IContributorB64 extends IContributor {
   _base64: string | null;
}
