export interface ICoordinates {
    x: number;
    y: number;
}

export interface IVector {
    x: number;
    y: number;
}

export type TWalkabilityMatrix = boolean[][];

export type TPelletMatrix = number[][];

export type TPacMatrix = (number | null)[][];

export interface IGameMap {
    width: number;
    height: number;
    walkabilityMatrix: TWalkabilityMatrix;
    pelletMatrix: TPelletMatrix;
    pacMatrix: {
        me: TPacMatrix;
        opponent: TPacMatrix;
    };
}
