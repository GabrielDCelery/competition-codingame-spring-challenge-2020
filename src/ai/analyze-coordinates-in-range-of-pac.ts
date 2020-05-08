import {
    ICoordinates,
    getWalkableNeighbouringCoordinates,
    transformCoordinatesToKey,
} from '../maps';
import { IGameState } from '../game-state';

export interface ICoordinatesAnalysis {
    [index: string]: { distance: number; score: number };
}

export const analyzeCoordinatesInRangeOfPac = ({
    pacId,
    maxDistance,
    gameState,
}: {
    pacId: string;
    maxDistance: number;
    gameState: IGameState;
}): ICoordinatesAnalysis => {
    const coordinatesAnalysis: ICoordinatesAnalysis = {};

    const queue: Array<{
        distance: number;
        coordinates: ICoordinates;
        score: number;
    }> = [
        {
            distance: 0,
            coordinates: gameState.pacs.me[pacId].coordinates,
            score: 0,
        },
    ];

    while (queue.length > 0) {
        const item = queue.shift();

        if (item && (item.distance <= maxDistance || Object.keys(coordinatesAnalysis).length < 2)) {
            const { distance, coordinates, score } = item;

            coordinatesAnalysis[transformCoordinatesToKey(coordinates)] = item;

            getWalkableNeighbouringCoordinates({
                coordinates,
                gameMap: gameState.map,
            }).forEach(coordinates => {
                const locationKey = transformCoordinatesToKey(coordinates);

                if (coordinatesAnalysis[locationKey]) {
                    return;
                }

                const { x, y } = coordinates;
                const analysis = {
                    distance: distance + 1,
                    score: score + gameState.map.pelletMatrix[x][y],
                };

                queue.push({
                    ...analysis,
                    coordinates,
                });
            });
        }
    }

    return coordinatesAnalysis;
};
