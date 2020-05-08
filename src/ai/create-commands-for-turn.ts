import { IGameState } from '../game-state';
import { analyzeCoordinatesInRangeOfPac } from './analyze-coordinates-in-range-of-pac';
import { ICoordinates, transformKeyToCoordinates } from '../maps';

export const createCommandsForTurn = (
    gameState: IGameState
): { pacId: string; coordinates: ICoordinates }[] => {
    return Object.keys(gameState.pacs.me).map(pacId => {
        const coordinatesAnalysis = analyzeCoordinatesInRangeOfPac({
            pacId,
            maxDistance: 4,
            gameState,
        });

        let scoreDistanceRatio = 0;
        let chosenCoordinates: ICoordinates = gameState.pacs.me[pacId].coordinates;

        Object.keys(coordinatesAnalysis).forEach(key => {
            const coordinates = transformKeyToCoordinates(key);
            const { score, distance } = coordinatesAnalysis[key];
            const newScoreDistanceRation = score / distance;

            if (scoreDistanceRatio <= newScoreDistanceRation) {
                scoreDistanceRatio = newScoreDistanceRation;
                chosenCoordinates = coordinates;
            }
        });

        return {
            pacId,
            coordinates: chosenCoordinates,
        };
    });
};
