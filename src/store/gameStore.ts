/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

//import { GameStatus, GameModes } from '../interfaces/game.d';
import fetchParagraphForGame from '../lib/fetchParagraphForGame';
import calculateWordsPerMinute from '../utils/calculateAccuracyAndWPM';
import { GameDifficulties,GameDuration,GameModes,GameStatus,Progress } from '../interfaces/game';
//import { User } from 'firebase/auth';
import { ExtendedUser } from '../interfaces/user';

interface GameState {
  mode: GameModes;
  timer: number;
  duration: GameDuration;
  difficulty: GameDifficulties;
  loading: string | null;
  paragraph: string | null;
  gameStatus: GameStatus;
  wpm: number;
  typed: string;
  accuracy: number;
  progress:Map<string,Progress>;
  players: ExtendedUser[];
  correctWordsArray: string[];
  incorrectWordsArray: string[];
  owner:string|null;
  setPlayers: (players: ExtendedUser[]) => void;
  setTyped: (typed: string) => void;
  setMode: (mode: GameModes) => void;
  startGame: () => void;
  setDifficulty:(mode:GameDifficulties)=>void;
  endGame: () => void;
  setDuration: (duration: GameDuration) => void;
  decrementTimer: () => void;
  setGameStatus: (gameStatus: GameStatus) => void;
  setRoomId:(roomId:string)=>void;
  setOwner:(owner:string)=>void;
  //updateProgress:(userId:string,progress:any)=>void;
  setProgress: (progress: Progress, socketId: string) => void;
  setParagraph: (paragraph: string) => void;
  setTimer: (timer: number) => void;
}
const useGameStore = create<GameState>()(
  devtools((set, get) => ({
    mode: GameModes.SINGLE_PLAYER,
    timer: 0,
    duration: GameDuration.ONE_MIN,
    difficulty:GameDifficulties.EASY,
    paragraph: null,
    loading: null,
    wpm: 0,
    gameStatus: GameStatus.WAITING,
    typed: '',
    accuracy: 0,
    players: [],
    correctWordsArray: [],
    incorrectWordsArray: [],
    roomId:null,
    owner:null,
    progress:new Map();
    setOwner:(owner)=>set({owner})
    setRoomId:(roomId)=>set({roomId}),
    setTimer: (timer) => set({ timer }),
    setParagraph: (paragraph) => set({ paragraph }),
    setPlayers: (players) => set({ players }),
    setDuration: (duration) => set({ duration }),
    setMode: (mode) => set({ mode }),
    setDificulty: (difficulty) => set({ difficulty }),
    setProgress: (progress, socketId) => {
      const progressMap = get().progress;
      console.log(progressMap.keys(), progressMap.values());
      progressMap.set(socketId, progress);
      set({ progress: progressMap });
    },

    setGameStatus: (gameStatus) => set({ gameStatus }),
    updateProgress:(userId,progress)=>{
      const players=get()?.players?.map((player)=>{
        if(player?.socketId===userId){
          return {
            ...player,
            progress,
          }
        };
        return player;
      })
    }setTyped: (typed) => {
      set({ typed });
      
      
      const {
        wordsPerMinute,
        accuracy,
        correctWordsArray,
        incorrectWordsArray,
      } = calculateWordsPerMinute(get().paragraph!, typed, get().duration / 60);
      if(get().mode===GameModes.WITH_FRIENDS){
        socket.emit('progressUpdate',{
          roomId:get().roomId,
          progress:{
            wpm:wordsPerMinute,
            accuracy,
          }


        })
      }

      set({
        wpm: wordsPerMinute,
        accuracy,
        correctWordsArray: correctWordsArray,
        incorrectWordsArray: incorrectWordsArray,
      });
    },

    startGame: async () => {
      set({ loading: 'Generating a paragraph for you! Please Wait....' });
      socket.emit('game-status',{
        status:GameStatus.PLAYING,
        roomId:get().roomId,

      })
      const response = await fetchParagraphForGame(
        get().difficulty,
        get().duration
      );
      set({
        timer: get().duration,
        gameStatus: GameStatus.PLAYING,
        loading: null,
        paragraph: response?.content,
      });
    },
    endGame: () =>
      set({
        timer: 0,
        gameStatus: GameStatus.FINISHED,
        typed: '',
        accuracy: 0,
        wpm: 0,
        correctWordsArray: [],
        incorrectWordsArray: [],
      }),
    decrementTimer: () => set({ timer: get().timer - 1 }),
    setDuration: (duration) => set({ duration }),
    setMode: (mode) => set({ mode }),
  }))
);
export default useGameStore;