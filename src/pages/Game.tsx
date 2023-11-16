/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import useGameStore from "../store/gameStore";
import useUserStore from "../store/useUserStore";
import { useEffect } from "react";
import { useLocation ,useSearchParams} from "react-router-dom";
import { GameStatus } from "../interfaces/game.d";
import WaitingScreen from "../components/Game/WaitingScreen";
import { toast } from "react-toastify";
import Status from "../components/Game/Status";
import { socket } from "../utils/socket";
type Props={

};
const Game=(props:Props)=>{
  const {state}=useLocation();
  const [params]=useSearchParams();
  
  const [decrementTimer,timer,setDuration,setMode,paragraph,gameStatus,loading,duration,typed,setTyped,endGame,setGameStatus,correctWordsArray,incorrectWordsArray,setPlayers,setRoomId]=useGameStore((state)=>[
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
    state.setRoomId,
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
    if(state){
      setDuration(state.duration*60);
      setMode(state.mode);
      setPlayers(state.players);
    }
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
  },[setGameStatus]);
  useEffect(() => {
    socket.on('activeUsers', (users) => {
      console.log(users);
      setPlayers(users);
    });
  }, []);

  useEffect(() => {
    if (params.get('roomId') && user) {
      setRoomId(params.get('roomId')!);
      socket.emit('joinRoom', { roomId: params.get('roomId'), user: user });
    }
  }, []);

  return (
    <div className="p-10 relative">
      <motion.div className="absolute top-0 left-0 h-2 w-full bg-secondary" style={{scaleX:timer/duration}}/>
      <div className="w-full flex items-center justify-center p-10 bg-primary2 rounded-xl">
        {gameStatus===GameStatus.PLAYING?(
          <div className="space-y-4">
            <Status/>
              <p className="text-sm font-bold text-white">{paragraph}</p>
              <p className="text-base flex items-center flex-wrap unselectable w-full space-x-2 text-white">
              {typed?.split(' ').map((word, idx) => {
                return (
                  <span key={idx} className={`${correctWordsArray.includes(word)?'text-green-500':'text-red-400'}`}>
                    {word}
                  </span>
                )
              })}
            </p>
            <textarea placeholder="Type Text here....." onChange={handleChange} rows={8} value={typed} className="w-full outline-none border-none text-black p-2 rounded-xl"></textarea>
          </div>
        ):null}
        <WaitingScreen/>
      </div>
    </div>
  )
  

};
export default Game;