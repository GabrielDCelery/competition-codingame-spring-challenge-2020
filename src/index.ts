import {
    transformGameInputToCell,
    createBlankWalkabilityMatrix,
    isCellFloorTile,
    createBlankPelletMatrix,
    createBlankPacMatrix,
    createInitialPelletMatrix,
    getCoordinatesInLineOfSight,
} from './maps';
import { IPac } from './pacs';
import { createBlankGameStateTemplate } from './game-state';
import { createCommandsForTurn } from './ai';
import { SCORE_EMPTY, SCORE_SUPER_PELLET } from './constants';

declare const readline: any;

const readNextLine = (): string => {
    return readline();
};

const gameState = createBlankGameStateTemplate();

const [width, height] = readNextLine()
    .split(' ')
    .map(elem => {
        return parseInt(elem, 10);
    });

gameState.map.width = width;
gameState.map.height = height;
gameState.map.walkabilityMatrix = createBlankWalkabilityMatrix(gameState.map);

for (let y = 0; y < height; y++) {
    const line: string = readNextLine();
    const cells = [...line.split('')];
    for (let x = 0; x < width; x++) {
        const cell = cells[x];
        gameState.map.walkabilityMatrix[x][y] = isCellFloorTile(transformGameInputToCell(cell));
    }
}

gameState.map.pelletMatrix = createInitialPelletMatrix(gameState.map);

// game loopgameState
while (true) {
    const [myScore, opponentScore] = readNextLine()
        .split(' ')
        .map(elem => {
            return parseInt(elem, 10);
        });

    gameState.scores.me = myScore;
    gameState.scores.opponent = opponentScore;
    gameState.map.pacMatrix.me = createBlankPacMatrix({ width, height });
    gameState.map.pacMatrix.opponent = createBlankPacMatrix({ width, height });
    gameState.pacs.me = {};
    gameState.pacs.opponent = {};

    const visiblePacCount = parseInt(readNextLine(), 10); // all your pacs and enemy pacs in sight

    for (let i = 0; i < visiblePacCount; i++) {
        const inputs = readNextLine().split(' ');
        const pacId = parseInt(inputs[0]); // pac number (unique within a team)
        const isMine = inputs[1] !== '0'; // true if this pac is yours
        const x = parseInt(inputs[2]); // position in the grid
        const y = parseInt(inputs[3]); // position in the grid
        const typeId = inputs[4]; // unused in wood leagues
        const speedTurnsLeft = parseInt(inputs[5]); // unused in wood leagues
        const abilityCooldown = parseInt(inputs[6]); // unused in wood leagues

        const pac: IPac = {
            id: pacId,
            coordinates: { x, y },
            typeId,
            speedTurnsLeft,
            abilityCooldown,
        };

        gameState.pacs[isMine ? 'me' : 'opponent'][pacId] = pac;
        gameState.map.pacMatrix[isMine ? 'me' : 'opponent'][x][y] = pacId;
        gameState.map.pelletMatrix[x][y] = SCORE_EMPTY;
    }

    const visiblePelletMatrix = createBlankPelletMatrix({ width, height });

    const visiblePelletCount = parseInt(readNextLine(), 10); // all pellets in sight

    for (let i = 0; i < visiblePelletCount; i++) {
        const [x, y, value] = readNextLine()
            .split(' ')
            .map(elem => {
                return parseInt(elem, 10);
            });

        visiblePelletMatrix[x][y] = value;

        if (value === SCORE_SUPER_PELLET) {
            gameState.map.pelletMatrix[x][y] = value;
        }
    }

    Object.keys(gameState.pacs.me).forEach(pacId => {
        const { coordinates } = gameState.pacs.me[pacId];
        getCoordinatesInLineOfSight({
            coordinates,
            gameMap: gameState.map,
        }).forEach(coordinates => {
            const { x, y } = coordinates;
            const value = visiblePelletMatrix[x][y];
            gameState.map.pelletMatrix[x][y] = value;
        });
    });

    const commands = createCommandsForTurn(gameState).map(({ pacId, coordinates }) => {
        const { x, y } = coordinates;
        return `MOVE ${pacId} ${x} ${y}`;
    });

    console.log(commands.join('|'));
}
