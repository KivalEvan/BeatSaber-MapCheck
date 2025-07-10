export const enum PayloadType {
   Url,
   Id,
   Hash,
   File,
}

interface PayloadUrl {
   type: PayloadType.Url;
   data: string;
}

interface PayloadId {
   type: PayloadType.Id;
   data: string;
}

interface PayloadHash {
   type: PayloadType.Hash;
   data: string;
}

interface PayloadFile {
   type: PayloadType.File;
   data: File;
}

export type Payload = PayloadUrl | PayloadId | PayloadHash | PayloadFile;
