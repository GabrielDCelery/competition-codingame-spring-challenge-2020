import { ICoordinates } from '../maps';

export interface IPac {
    id: number;
    coordinates: ICoordinates;
    typeId: string;
    speedTurnsLeft: number;
    abilityCooldown: number;
}
