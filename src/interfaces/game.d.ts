import {User} from './user'
export enum GameStatus{
  WAITING,
  PLAYING,
  FINISHED,
}
export interface Player extends User{
  wpm:number;
  accuracy:number;
}
export enum GameModes{
  SINGLE_PLAYER,
  ONLINE,
  WITH_FRIENDS
}