/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import useGameStore from "../store/gameStore";
import useUserStore from "../store/useUserStore";
import { useEffect } from "react";
import { useLocation ,useSearchParams} from "react-router-dom";
import { GameStatus,GameModes } from "../interfaces/game.d";
import WaitingScreen from "../components/Game/WaitingScreen";
import { toast } from "react-toastify";
import Status from "../components/Game/Status";
import { socket } from "../utils/socket";
import Players from "../components/Home/Players";
type Props={

};
const Game=(props:Props)=>{
  //const {state}=useLocation();
  const [params]=useSearchParams();
  const [user]=useUserStore((state)=>[state.user]);
  
  const [decrementTimer,timer,setMode,paragraph,gameStatus,loading,duration,typed,setTyped,endGame,setGameStatus,correctWordsArray,incorrectWordsArray,setPlayers,setRoomId,setOwner,mode,setProgress,setTimer,setParagraph]=useGameStore((state)=>[
    state.decrementTimer,
    state.timer,
    //state.setDuration,
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
    state.setRoomId,
    state.setOwner,
    state.mode,
    state.setProgress,
    state.setTimer,
    state.setParagraph,
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
    if(gameStatus===GameStatus.PLAYING){
      if(timer===0) endGame();
      else{
        setTimeout(()=>{
          decrementTimer();
        },1000);

      }
    }
    
  },[gameStatus,decrementTimer,timer,endGame]);
 
  useEffect(()=>{
    return ()=>{
      setGameStatus(GameStatus.WAITING);
    }
  },[setGameStatus]);
  useEffect(() => {
    socket.on('activeUsers', (users) => {
     // console.log(users);
      setPlayers(users);
    });
    socket.on('setOwner',(owner)=>{
     // console.log(owner);
      setOwner(owner);
    })
    socket.on('game-status',({status,timer,paragraph})=>{
      setTimer(timer);
      setGameStatus(status);
      if(paragraph)setParagraph(paragraph);
    })
    socket.on('progressUpdate',({socketId,progress})=>{
      setProgress(socketId,progress)
    })
    return ()=>{
      socket.off('activeUsers');
      socket.off('setOwner');
      socket.off('gameStatus');
      socket.off('progressUpdate');
    }
  },[]);

  useEffect(() => {
    //setRoomId(params.get('roomId'));
    //setMode(GameModes.WITH_FRIENDS);
    if(params.get('roomId')){
      setRoomId(params.get('roomId'));
      setMode(GameModes.WITH_FRIENDS);
      socket.emit('joinRoom',{
        roomId:params.get('roomId'),
        user:user,

      })
    }
  },[user,params,setRoomId,setMode]);

  return (
    <div className="p-6 sm:p-10 relative">
      <motion.div className="absolute top-0 left-0 h-2 w-full bg-secondary" style={{scaleX:timer/duration}}/>
      <div className="w-full flex items-center justify-center p-6 sm:p-10 bg-primary2 rounded-xl">
        {gameStatus===GameStatus.PLAYING?(
          <div className="space-y-4">
            {mode!==GameModes.SINGLE_PLAYER && <Players/>}
            <Status/>
              <p className="text-sm w-full font-bold text-white">{paragraph}</p>
              <p className="text-sm flex gap-2 items-center flex-wrap unselectable w-full space-x-2 text-white">
              {typed?.split(' ').map((word, idx) => {
                return (
                  <span key={idx} className={`${correctWordsArray.includes(word)?'text-green-500':'text-red-400'}`}>
                    {word}
                  </span>
                )
              })}
            </p>
            <textarea placeholder="Type Text here....." onPaste={(e)=>{
              toast.error('Paste is not allowed');
              e.preventDefault(),
            }} onChange={(e)=>setTyped(e.target.value)} rows={8} value={typed} className="w-full outline-none border-none text-black p-2 rounded-xl"></textarea>
          </div>
        ):(
        <WaitingScreen/>)}
      </div>
    </div>
  )
  

};
export default Game;