import { EDirection, ECell } from './enums';
import {
    ICoordinates,
    IGameMap,
    IVector,
    TPacMatrix,
    TPelletMatrix,
    TWalkabilityMatrix,
} from './interfaces';
import { SCORE_PELLET, SCORE_EMPTY } from '../constants';

export const directionVectors: { [key in EDirection]: IVector } = {
    [EDirection.UP]: { x: 0, y: -1 },
    [EDirection.DOWN]: { x: 0, y: 1 },
    [EDirection.LEFT]: { x: -1, y: 0 },
    [EDirection.RIGHT]: { x: 1, y: 0 },
};

export const createBlankWalkabilityMatrix = ({
    width,
    height,
}: {
    width: number;
    height: number;
}): TWalkabilityMatrix => {
    return new Array(width).fill(null).map(() => new Array(height).fill(true));
};

export const createBlankPelletMatrix = ({
    width,
    height,
}: {
    width: number;
    height: number;
}): TPelletMatrix => {
    return new Array(width).fill(null).map(() => new Array(height).fill(SCORE_EMPTY));
};

export const createInitialPelletMatrix = ({
    width,
    height,
}: {
    width: number;
    height: number;
}): TPelletMatrix => {
    return new Array(width).fill(null).map(() => new Array(height).fill(SCORE_PELLET));
};

export const createBlankPacMatrix = ({
    width,
    height,
}: {
    width: number;
    height: number;
}): TPacMatrix => {
    return new Array(width).fill(null).map(() => new Array(height).fill(null));
};

export const isCellFloorTile = (cell: ECell): boolean => {
    return cell === ECell.FLOOR;
};

export const transformGameInputToCell = (gameInput: string): ECell => {
    if (gameInput === '#') {
        return ECell.WALL;
    }

    if (gameInput === ' ') {
        return ECell.FLOOR;
    }

    throw new Error(`Cannot process game input -> ${gameInput}`);
};

export const addVectorToCoordinates = ({
    coordinates,
    vector,
    gameMap,
}: {
    coordinates: ICoordinates;
    vector: IVector;
    gameMap: IGameMap;
}): ICoordinates => {
    const { width, height } = gameMap;

    return {
        x: (((coordinates.x + vector.x) % width) + width) % width,
        y: (((coordinates.y + vector.y) % height) + height) % height,
    };
};

export const getWalkableNeighbouringCoordinates = ({
    coordinates,
    gameMap,
}: {
    coordinates: ICoordinates;
    gameMap: IGameMap;
}): ICoordinates[] => {
    const validNeighbouringCoordinates: ICoordinates[] = [];

    [
        directionVectors[EDirection.UP],
        directionVectors[EDirection.DOWN],
        directionVectors[EDirection.LEFT],
        directionVectors[EDirection.RIGHT],
    ].forEach((vector: IVector): void => {
        const { x, y } = addVectorToCoordinates({ coordinates, vector, gameMap });

        if (gameMap.walkabilityMatrix[x][y] === false) {
            return;
        }

        validNeighbouringCoordinates.push({ x, y });
    });

    return validNeighbouringCoordinates;
};

export const areCoordinatesTheSame = (source: ICoordinates, target: ICoordinates): boolean => {
    return source.x === target.x && source.y === target.y;
};

export const transformCoordinatesToKey = ({ x, y }: ICoordinates): string => {
    return `${x}_${y}`;
};

export const transformKeyToCoordinates = (key: string): ICoordinates => {
    const [x, y] = key.split('_').map(elem => parseInt(elem, 10));

    return { x, y };
};

export const multiplyVector = ({
    vector,
    distance,
}: {
    vector: IVector;
    distance: number;
}): IVector => {
    const { x, y } = vector;
    return {
        x: x * distance,
        y: y * distance,
    };
};

export const getCoordinatesInLineOfSight = ({
    coordinates,
    gameMap,
}: {
    coordinates: ICoordinates;
    gameMap: IGameMap;
}): ICoordinates[] => {
    const visitedCoordinatesMap: { [index: string]: boolean } = {};
    const coordinatesInLineOfSight: ICoordinates[] = [];

    [
        directionVectors[EDirection.UP],
        directionVectors[EDirection.DOWN],
        directionVectors[EDirection.LEFT],
        directionVectors[EDirection.RIGHT],
    ].forEach((vector: IVector): void => {
        let distance = 1;
        let hasNotHitWall = true;
        let hasNotVisitedCoordinates = true;

        while (hasNotHitWall && hasNotVisitedCoordinates) {
            const { x, y } = addVectorToCoordinates({
                coordinates,
                vector: multiplyVector({ vector, distance }),
                gameMap,
            });

            hasNotHitWall = gameMap.walkabilityMatrix[x][y] === true;
            const locationKey = transformCoordinatesToKey({ x, y });
            hasNotVisitedCoordinates = visitedCoordinatesMap[locationKey] !== true;

            if (hasNotHitWall && hasNotVisitedCoordinates) {
                coordinatesInLineOfSight.push({ x, y });
                distance = distance + 1;
                visitedCoordinatesMap[locationKey] = true;
            }
        }
    });

    return coordinatesInLineOfSight;
};
