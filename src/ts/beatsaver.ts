interface MapDetail {
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

interface MapDetailMetadata {
    bpm: number;
    duration: number;
    levelAuthorName: string;
    songAuthorName: string;
    songName: string;
    songSubName: string;
}

interface MapStats {
    downloads: number;
    downvotes: number;
    plays: number;
    score: number;
    upvotes: number;
}

interface Instant {
    epochSeconds: number;
    nanosecondsOfSecond: number;
    value: number;
}

interface UserDetail {
    avatar: string;
    hash: string;
    id: number;
    name: string;
    stats: UserStats;
    testplay: boolean;
}

interface UserStats {
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

interface UserDiffStats {
    easy: number;
    expert: number;
    expertplus: number;
    hard: number;
    normal: number;
    total: number;
}

interface MapVersion {
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

interface MapDifficulty {
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

interface MapParitySummary {
    errors: number;
    resets: number;
    warn: number;
}

interface MapTestplay {
    createdAt: Instant;
    feedback: string;
    feedbackAt: Instant;
    user: UserDetail;
    video: string;
}

const fetchJSON = async (url: string): Promise<any> => {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.timeout = 5000;

        let startTime = Date.now();
        xhr.onprogress = () => {
            xhr.timeout += Date.now() - startTime;
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            }
            if (xhr.status === 404) {
                reject('Error 404: Map does not exist');
            }
            if (xhr.status === 403) {
                reject('Error 403: Forbidden');
            }
            reject(`Error ${xhr.status}`);
        };

        xhr.onerror = () => {
            reject('Error downloading');
        };

        xhr.ontimeout = () => {
            reject('Connection timeout');
        };

        xhr.send();
    });
};

export const getIdZipURL = async (id: string): Promise<string> => {
    const url = `https://api.beatsaver.com/maps/id/${id}`;
    const json = (await fetchJSON(url)) as MapDetail;
    if (json?.versions.length) {
        return json.versions[json.versions.length - 1].downloadURL;
    }
    throw new Error('could not find map download link');
};

export const getHashZipURL = async (hash: string): Promise<string> => {
    const url = `https://api.beatsaver.com/maps/hash/${hash}`;
    const json = (await fetchJSON(url)) as MapDetail;
    if (json?.versions.length) {
        return json.versions[json.versions.length - 1].downloadURL;
    }
    throw new Error('could not find map download link');
};
