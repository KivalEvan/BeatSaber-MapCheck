export interface MapDetail {
   automapper: boolean;
   curator: string;
   description: string;
   id: string;
   metadata: MapDetailMetadata;
   name: string;
   qualified: boolean;
   ranked: boolean;
   stats: MapStats;
   uploaded: Instant;
   uploader: UserDetail;
   versions: MapVersion[];
}

export interface MapDetailMetadata {
   bpm: number;
   duration: number;
   levelAuthorName: string;
   songAuthorName: string;
   songName: string;
   songSubName: string;
}

export interface MapStats {
   downloads: number;
   downvotes: number;
   plays: number;
   score: number;
   upvotes: number;
}

export interface Instant {
   epochSeconds: number;
   nanosecondsOfSecond: number;
   value: number;
}

export interface UserDetail {
   avatar: string;
   hash: string;
   id: number;
   name: string;
   stats: UserStats;
   testplay: boolean;
}

export interface UserStats {
   avgBpm: number;
   avgDuration: number;
   avgScore: number;
   diffStats: UserDiffStats;
   firstUpload: Instant;
   lastUpload: Instant;
   rankedMaps: number;
   totalDownvotes: number;
   totalMaps: number;
   totalUpvotes: number;
}

export interface UserDiffStats {
   easy: number;
   expert: number;
   expertplus: number;
   hard: number;
   normal: number;
   total: number;
}

export interface MapVersion {
   coverURL: string;
   createdAt: Instant;
   diffs: MapDifficulty[];
   downloadURL: string;
   feedback: string;
   hash: string;
   key: string;
   previewURL: string;
   sageScore: number;
   state: 'Uploaded' | 'Testplay' | 'Published' | 'Feedback';
   testplayAt: Instant;
   testpalys: MapTestplay[];
}

export interface MapDifficulty {
   bombs: number;
   characteristics:
      | 'Standard'
      | 'OneSaber'
      | 'NoArrows'
      | '_90Degree'
      | '_360Degree'
      | 'Lightshow'
      | 'Lawless';
   chroma: boolean;
   cinema: boolean;
   difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert' | 'ExpertPlus';
   events: number;
   length: number;
   me: boolean;
   ne: boolean;
   njs: number;
   notes: number;
   nps: number;
   obstacles: number;
   offset: number;
   paritySummary: MapParitySummary;
   seconds: number;
   stars: number;
}

export interface MapParitySummary {
   errors: number;
   resets: number;
   warn: number;
}

export interface MapTestplay {
   createdAt: Instant;
   feedback: string;
   feedbackAt: Instant;
   user: UserDetail;
   video: string;
}
