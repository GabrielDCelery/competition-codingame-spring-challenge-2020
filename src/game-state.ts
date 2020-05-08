import { IGameMap } from './maps';
import { IPac } from './pacs';

export interface IGameState {
    scores: {
        me: number;
        opponent: number;
    };
    map: IGameMap;
    pacs: {
        me: { [index: string]: IPac };
        opponent: { [index: string]: IPac };
    };
}

export const createBlankGameStateTemplate = (): IGameState => {
    return {
        scores: {
            me: 0,
            opponent: 0,
        },
        map: {
            width: 0,
            height: 0,
            walkabilityMatrix: [],
            pelletMatrix: [],
            pacMatrix: {
                me: [],
                opponent: [],
            },
        },
        pacs: {
            me: {},
            opponent: {},
        },
    };
};
