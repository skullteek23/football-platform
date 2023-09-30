/**
 * Defines the position of a player.
 * DO NOT CHANGE THE ORDER OF THE ENUM VALUES.
 * This list is also stored in the cloud functions
 */
export enum Position {
  manager = 'manager',
  striker = 'striker',
  midfielder = 'midfielder',
  defender = 'defender',
  goalkeeper = 'goalkeeper',
}

export class Player {
  id: string = '';
  name: string = '';
  imgLink: string = '';
  position: Position = Position.striker;
  dob: number = 0;
  locationCity: string = '';
  locationState: string = '';
}
