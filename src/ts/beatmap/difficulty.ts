import { DifficultyData } from './types/difficulty';
import { Obstacle } from './types/obstacle';
import { isInteractive } from './obstacle';

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

export const findFirstInteractiveObstacleTime = (obstacles: Obstacle[]): number => {
    for (let i = 0, len = obstacles.length; i < len; i++) {
        if (isInteractive(obstacles[i])) {
            return obstacles[i]._time;
        }
    }
    return Number.MAX_VALUE;
};

export const findLastInteractiveObstacleTime = (obstacles: Obstacle[]): number => {
    let obstacleEnd = 0;
    for (let i = obstacles.length - 1; i >= 0; i--) {
        if (isInteractive(obstacles[i])) {
            obstacleEnd = Math.max(
                obstacleEnd,
                obstacles[i]._time + obstacles[i]._duration
            );
        }
    }
    return obstacleEnd;
};
