import { CharacteristicName } from './characteristic';
import { DifficultyData, DifficultyName } from './difficulty';
import { EnvironmentName } from './environment';
import { BeatmapInfoSetDifficulty } from './info';
import * as obstacle from './obstacle';

export interface BeatmapSetData {
    _mode: CharacteristicName;
    _difficulty: DifficultyName;
    _info: BeatmapInfoSetDifficulty;
    _data: DifficultyData;
    _environment: EnvironmentName;
}

export const findFirstInteractiveObstacleTime = (
    obstacles: obstacle.Obstacle[]
): number => {
    for (let i = 0, len = obstacles.length; i < len; i++) {
        if (obstacle.isInteractive(obstacles[i])) {
            return obstacles[i]._time;
        }
    }
    return Number.MAX_VALUE;
};

export const findLastInteractiveObstacleTime = (
    obstacles: obstacle.Obstacle[]
): number => {
    let obstacleEnd = 0;
    for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacle.isInteractive(obstacles[i])) {
            obstacleEnd = Math.max(
                obstacleEnd,
                obstacles[i]._time + obstacles[i]._duration
            );
        }
    }
    return obstacleEnd;
};

export const getFirstInteractiveTime = (mapData: DifficultyData): number => {
    const { _notes: notes, _obstacles: obstacles } = mapData;
    let firstNoteTime = Number.MAX_VALUE;
    if (notes.length > 0) {
        firstNoteTime = notes[0]._time;
    }
    const firstInteractiveObstacleTime = findFirstInteractiveObstacleTime(obstacles);
    return Math.min(firstNoteTime, firstInteractiveObstacleTime);
};

export const getLastInteractiveTime = (mapData: DifficultyData): number => {
    const { _notes: notes, _obstacles: obstacles } = mapData;
    let lastNoteTime = 0;
    if (notes.length > 0) {
        lastNoteTime = notes[notes.length - 1]._time;
    }
    const lastInteractiveObstacleTime = findLastInteractiveObstacleTime(obstacles);
    return Math.max(lastNoteTime, lastInteractiveObstacleTime);
};
