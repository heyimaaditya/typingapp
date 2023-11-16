/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import useGameStore from "../store/gameStore";
import useUserStore from "../store/useUserStore";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GameStatus } from "../interfaces/game.d";
import WaitingScreen from "../components/Game/WaitingScreen";
import { toast } from "react-toastify";
import Status from "../components/Game/Status";
type Props={

};
const Game=(props:Props)=>{
  const {state}=useLocation();
  const [decrementTimer,timer,setDuration,setMode,paragraph,gameStatus,loading,duration,typed,setTyped,endGame,setGameStatus,correctWordsArray,incorrectWordsArray,setPlayers,]=useGameStore((state)=>[
    state.decrementTimer,
    state.timer,
    state.setDuration,
    state.setMode,
    state.paragraph,
    state.gameStatus,
    state.loading,
    state.typed,
    state.setTyped,
    state.endGame,
    state.setGameStatus,
    state.correctWordsArray,
    state.incorrectWordsArray,
    state.setPlayers,
  ]);
  useEffect(()=>{
    if(loading){
      toast.loading(loading,{
        toastId:'loading',
      });

    }else{
      toast.dismiss('loading');
    }
    return ()=>{
      toast.dismiss('loading');
    }
  },[loading]);
  useEffect(()=>{
    if(gameStatus===GameStatus.PLAYING&&timer>0){
      setTimeout(()=>{
        decrementTimer();
      },1000);
    }else if(gameStatus===GameStatus.PLAYING && timer===0){
      endGame();
    }
    return ()=>{};
  },[gameStatus,decrementTimer,timer,endGame]);
  useEffect(()=>{
    setDuration(state.duration*60);
    setMode(state.mode);
    setPlayers(state.players);
    return ()=>{};
  },[state,setDuration,setMode,setPlayers]);
  const handleChange=(e:any)=>{
    const {value}=e.target;
    setTyped(value);

  };
  useEffect(()=>{
    return ()=>{
      setGameStatus(GameStatus.WAITING);
    }
  },[]);
  const [user]=useUserStore((state)=>[state.user]);
  return (
    <div className="p-10 relative">
      <motion.div className="absolute top-0 left-0 h-2 w-full bg-secondary" style={{scaleX:timer/duration}}/>
      <div className="w-full flex items-center justify-center p-10 bg-primary2 rounded-xl">
        {gameStatus===GameStatus.PLAYING?(
          <div className="space-y-4">
            <Status/>
            <p className="text-base w-full space-x-2 unselectable text-white">
              {paragraph?.split(' ').map((word,idx)=>{
                return (
                  <span key={idx} className={`${correctWordsArray.includes(word)?'text-green-500':'text-white'}`}>
                    {word}
                  </span>
                )
              })}
            </p>
            <textarea placeholder="Type Text here....." onChange={handleChange} rows={8} value={typed} className="w-full outline-none border-none text-black p-2 rounded-xl"></textarea>
          </div>
        ):null}
        {gameStatus === GameStatus.WAITING ? <WaitingScreen /> : null}
        {gameStatus === GameStatus.FINISHED ? <WaitingScreen /> : null}
      </div>
    </div>
  )
  

};
export default Game;