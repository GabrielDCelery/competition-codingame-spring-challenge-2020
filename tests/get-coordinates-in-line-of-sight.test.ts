import { expect } from 'chai';
import { describe, it } from 'mocha';
import { getCoordinatesInLineOfSight } from '../src/maps';

const gameMap = {
    width: 6,
    height: 6,
    walkabilityMatrix: [
        [false, false, false, false, false, false],
        [false, false, true, false, false, false],
        [true, true, true, true, true, true],
        [false, false, true, false, false, false],
        [false, false, true, false, false, false],
        [false, false, false, false, false, false],
    ],
    pelletMatrix: [],
    pacMatrix: {
        me: [],
        opponent: [],
    },
};

describe('getCoordinatesInLineOfSight', () => {
    it('does something', () => {
        // Given
        const coordinates = { x: 2, y: 2 };
        // When
        const result = getCoordinatesInLineOfSight({ coordinates, gameMap });
        // Then
        expect(result).to.deep.equal([
            { x: 2, y: 1 },
            { x: 2, y: 0 },
            { x: 2, y: 5 },
            { x: 2, y: 4 },
            { x: 2, y: 3 },
            { x: 2, y: 2 },
            { x: 1, y: 2 },
            { x: 3, y: 2 },
            { x: 4, y: 2 },
        ]);
    });
});
