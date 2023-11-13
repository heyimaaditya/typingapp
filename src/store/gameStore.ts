/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {create} from 'zustand'
import {devtools} from 'zustand/middleware'
import { GameStatus } from '../interfaces/game.d';
import fetchParagraphForGame from '../lib/fetchParagraphForGame';
import calculateWordsPerMinute from '../utils/calculateAccuracyAndWPM';
interface GameState {

  mode: string;
  timer: number;
  duration: number;
  difficulty: string;
  loading: string | null;
  
  gameStatus: GameStatus;
  wpm: number;
  typed: string;
  accuracy: number;
  
  setMode: (mode: string) => void;
  startGame: () => void;
  endGame: () => void;
  setDuration: (duration: number) => void;
  decrementTimer: () => void;
  setGameStatus: (gameStatus: GameStatus) => void;
}

  const useGameStore = create<GameState>()(
    devtools((set, get) => ({
      mode: 'single',
      timer: 0,
      duration: 0,
      difficulty: 'easy',
      
      loading: null,
      wpm: 0,
      gameStatus: GameStatus.WAITING,
      typed: '',
      accuracy: 0,
  
      setGameStatus: (gameStatus) => set({ gameStatus }),
  
      
  
      startGame: async () => {
        set({ loading: 'Generating a paragraph for you! Please Wait....' });
  
        
        set({
          
          gameStatus: GameStatus.PLAYING,
          loading: null,
          
        });
      },
      endGame: () =>
        set({
          timer: 0,
          gameStatus: GameStatus.FINISHED,
          typed: '',
          accuracy: 0,
          wpm: 0,
        }),
        
      decrementTimer: () => set({ timer: get().timer - 1 }),
      setDuration: (duration) => set({ duration }),
      setMode: (mode) => set({ mode }),
    }))
  );   
  export default useGameStore;