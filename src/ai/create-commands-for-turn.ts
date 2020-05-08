import { IGameState } from '../game-state';
import { analyzeCoordinatesInRangeOfPac } from './analyze-coordinates-in-range-of-pac';
import { ICoordinates } from '../maps';

export const createCommandsForTurn = (
    gameState: IGameState
): { pacId: string; coordinates: ICoordinates; comment: string }[] => {
    return Object.keys(gameState.pacs.me).map(pacId => {
        const targetsInArea = analyzeCoordinatesInRangeOfPac({
            pacId: parseInt(pacId),
            maxDistance: 10,
            gameState,
        });

        let scoreDistanceRatio = 0;
        let chosenCoordinates: ICoordinates = gameState.pacs.me[pacId].coordinates;

        Object.keys(targetsInArea.superPellets).forEach(locationKey => {
            const { coordinates, distance, score } = targetsInArea.superPellets[locationKey];
            const newScoreDistanceRation = score / distance;
            if (scoreDistanceRatio <= newScoreDistanceRation) {
                scoreDistanceRatio = newScoreDistanceRation;
                chosenCoordinates = coordinates;
            }
        });

        Object.keys(targetsInArea.normalPellets).forEach(locationKey => {
            const { coordinates, distance, score } = targetsInArea.normalPellets[locationKey];
            const newScoreDistanceRation = score / distance;
            if (scoreDistanceRatio <= newScoreDistanceRation) {
                scoreDistanceRatio = newScoreDistanceRation;
                chosenCoordinates = coordinates;
            }
        });

        return {
            pacId,
            coordinates: chosenCoordinates,
            comment: `${''}`,
        };
    });
};
