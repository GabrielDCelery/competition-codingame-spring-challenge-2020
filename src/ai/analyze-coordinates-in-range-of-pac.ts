import {
    ICoordinates,
    getWalkableNeighbouringCoordinates,
    transformCoordinatesToKey,
} from '../maps';
import { IGameState } from '../game-state';
import { SCORE_SUPER_PELLET } from '../constants';

interface ITargetsInArea {
    myPacs: {
        [index: string]: {
            coordinates: ICoordinates;
            distance: number;
            score: number;
            pacId: number;
            path: ICoordinates[];
        };
    };
    opponentPacs: {
        [index: string]: {
            coordinates: ICoordinates;
            distance: number;
            score: number;
            pacId: number;
            path: ICoordinates[];
        };
    };
    superPellets: {
        [index: string]: {
            coordinates: ICoordinates;
            distance: number;
            score: number;
            path: ICoordinates[];
        };
    };
    normalPellets: {
        [index: string]: {
            coordinates: ICoordinates;
            distance: number;
            score: number;
            path: ICoordinates[];
        };
    };
}

export const analyzeCoordinatesInRangeOfPac = ({
    pacId,
    maxDistance,
    gameState,
}: {
    pacId: number;
    maxDistance: number;
    gameState: IGameState;
}): ITargetsInArea => {
    const analyzedCells: { [index: string]: boolean } = {};

    const targetsInArea: ITargetsInArea = {
        myPacs: {},
        opponentPacs: {},
        superPellets: {},
        normalPellets: {},
    };

    const queue: Array<{
        coordinates: ICoordinates;
        distance: number;
        score: number;
        path: ICoordinates[];
    }> = [
        {
            coordinates: gameState.pacs.me[pacId].coordinates,
            distance: 0,
            score: 0,
            path: [gameState.pacs.me[pacId].coordinates],
        },
    ];

    while (queue.length > 0) {
        const item = queue.shift();

        if (!item) {
            continue;
        }

        const { distance, coordinates, score, path } = item;
        const locationKey = transformCoordinatesToKey(coordinates);

        if (analyzedCells[locationKey] === true) {
            continue;
        }

        analyzedCells[locationKey] = true;

        const { x, y } = coordinates;

        const myPacId = gameState.map.pacMatrix.me[x][y];

        if (myPacId !== null && myPacId !== pacId) {
            targetsInArea.opponentPacs[locationKey] = {
                coordinates,
                distance,
                score,
                pacId: myPacId,
                path,
            };
            continue;
        }

        const opponentPacId = gameState.map.pacMatrix.opponent[x][y];

        if (opponentPacId !== null) {
            targetsInArea.opponentPacs[locationKey] = {
                coordinates,
                distance,
                score,
                pacId: opponentPacId,
                path,
            };
            continue;
        }

        const pelletScore = gameState.map.pelletMatrix[x][y];

        if (pelletScore === SCORE_SUPER_PELLET) {
            targetsInArea.superPellets[locationKey] = {
                coordinates,
                distance,
                score: score + pelletScore,
                path,
            };
            continue;
        }

        const walkableNeighbouringCoordinates = getWalkableNeighbouringCoordinates({
            coordinates,
            gameMap: gameState.map,
        });

        const isDeadEnd =
            walkableNeighbouringCoordinates.length === 1 &&
            analyzedCells[transformCoordinatesToKey(walkableNeighbouringCoordinates[0])] === true;

        if (distance === maxDistance || isDeadEnd) {
            targetsInArea.normalPellets[locationKey] = {
                coordinates,
                distance,
                score: score + pelletScore,
                path,
            };
            continue;
        }

        walkableNeighbouringCoordinates.forEach(coordinates => {
            queue.push({
                coordinates,
                distance: distance + 1,
                score: score + pelletScore,
                path: [...path, coordinates],
            });
        });
    }

    return targetsInArea;
};
