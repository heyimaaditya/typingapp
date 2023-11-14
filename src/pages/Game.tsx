/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import useGameStore from "../store/gameStore";
import { GameStatus } from "../interfaces/game";
import WaitingScreen from "../components/Game/WaitingScreen";
import Status from "../components/Game/Status";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import e from "express";
type Props={}
const Game=(props:Props)=>{
  const {state}=useLocation();
  const [
    decrementTimer,
    timer,
    setDuration,
    setMode,
    paragraph,
    gameStatus,
    loading,
    duration,
    typed,
    setTyped,
    endGame,
    setGameStatus,

  ]=useGameStore((state)=>[
    state.decrementTimer,
    state.timer,
    state.setDuration,
    state.setMode,
    state.paragraph,
    state.gameStatus,
    state.loading,
    state.duration,
    state.typed,
    state.setTyped,
    state.endGame,
    state.setGameStatus,

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
    }else if(gameStatus===GameStatus.PLAYING&&timer===0){
      endGame();
    }
    return ()=>{};
  },[gameStatus,decrementTimer,timer,endGame]);
  useEffect(()=>{
    setDuration(state.duration*60);
    setMode(state.mode);
    return ()=>{};

  },[state,setDuration,setMode]);
  const handleChange=(e:any)=>{
    const {value}:e.target;
    setTyped(value);
  }
  useEffect(() => {
    return () => {
      setGameStatus(GameStatus.WAITING);
    };
  }, []);

  return (
    <div className="p-10 relative">
      <motion.div style={{ scaleX: timer / duration }}
        className="absolute top-0 h-2 w-full bg-secondary left-0"
      />
       <div className="w-full flex items-center justify-center p-10 bg-primary2 rounded-xl">
        {gameStatus === GameStatus.PLAYING ? (
          <div className="space-y-4">
            <Status />
            <p className="text-base text-white">{paragraph}</p>
            <textarea
              placeholder="Type the text here..."
              onChange={handleChange}
              rows={8}
              value={typed}
              className="w-full outline-none border-none text-black p-2 rounded-xl"
            ></textarea>
          </div>
        ) : null}

        {gameStatus === GameStatus.WAITING ? <WaitingScreen /> : null}
        {gameStatus === GameStatus.FINISHED ? <WaitingScreen /> : null}
      </div>
    </div>
  );
};
export default Game;
