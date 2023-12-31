//this file renders a list of Playercard with animated entry using framer motion and use to show the record of different users with with a slightly delay represented by delayIdx
import React from 'react';
import { motion } from 'framer-motion';

import dummyProfile from '../../assets/Dummy Profile.png'
import { GameStatus, GameModes } from '../../interfaces/game.d';
import useGameStore from '../../store/gameStore';
import { User } from 'firebase/auth';
import { socket } from '../../utils/socket';
import { toast } from 'react-toastify';
import {GiQueenCrown} from 'react-icons/gi'
import {MdOutlineContentCopy} from 'react-icons/md'
import useGame from '../../hooks/useGame';
import {ExtendedUser} from '../../interfaces/user';
import useUserStore from '../../store/userStore';
//import useUserStore from '../../store/useUserStore';
type Props = {
  player: ExtendedUser;
  delayIdx: number;
};


const PlayerCard = ({ player, delayIdx }: Props) => {
  const [owner]=useGameStore((state)=>[state.owner])
  
  const [gameStatus,progress,soloWpm,soloAccuracy,mode] = useGameStore((state) => [state.gameStatus,state.updateProgress,state.soloWpm,state.soloAccuracy,state.mode]);
  const [currentUsersSocketId] = useUserStore((state) => [state.socketId]);

  const { photoURL,displayName ,stats,socketId} = player;
  const {averageWpm,races}=stats||{averageWpm:0,races:0};
  const userProgress=mode===GameModes.SINGLE_PLAYER?{wpm:soloWpm,accuracy:soloAccuracy}:progress.get(socketId);
  const {accuracy,wpm}=userProgress||{accuracy:0,wpm:0};
  return (
    <motion.div
      animate={{
        x: [20, 0],
        transition: {
          easings: 'easeInOut',
          duration: 1,
          delay: delayIdx * 0.2,
        },
      }}
      className={`flex ${
        currentUsersSocketId === socketId ? 'border-2 border-secondary' : ''
      } max-w-xs flex-col items-center justify-center p-4 rounded-lg px-8 text-center`}>
      <div className="relative w-fit">
        {socketId===owner?(
          <div className='absolute bg-secondary rounded-full flex items-center justify-center w-5 h-5 top-0 right-2'>
            <GiQueenCrown/>
          </div>
        ):null}
        <img alt="" className="self-center flex-shrink-0 w-16 h-16 sm:w-24 sm:h-24 mb-4 bg-center bg-cover rounded-full dark:bg-gray-500" src={photoURL||dummyProfile}/>
      </div>
      <p className='text-base sm:text-xl font-semibold leadi'>{displayName}</p>
      {gameStatus===GameStatus.FINISHED||GameStatus.PLAYING?(
      
      <div className="text-xs">
      <p className="text-gray-400">WPM: {wpm}</p>
      <p className="text-gray-400">Accuracy: {accuracy}</p>
        </div>
      ) : (
        <div className="text-xs">
          <p className="dark:text-gray-400 whitespace-nowrap">Average WPM:{averageWpm}</p>
          <p className="dark:text-gray-400 whitespace-nowrap">Races:{races}</p>
        </div>
      )}
    </motion.div>
  );
};

const Players = () => {
  const [players] = useGameStore((state) => [state.players]);
  const [mode,roomId]=useGameStore((state)=>[state.mode,state.roomId]);
  const [progress] = useGameStore((state) => [state.progress]);
  const handleCopy=()=>{
    navigator.clipboard.writeText(`http:localhost:3000/game?roomId=${roomId}`);
    toast.success('Copied Room Id to clipboard ,share with your friends');
  };
  return (
    <div className=''>
      {mode===GameModes.WITH_FRIENDS&&(
        <div className='py-4 flex flex-col items-center justify-center space-y-4 text-center'>
          <p className="text-gray-300">
            <span className='text-white text-semibold'>Players in lobby:{players?.length||0},</span>{' '}Share Links with your friend's
          </p>
          <div onClick={handleCopy} className='flex cursor-pointer items-center bg-secondary px-4 py-2 rounded-lg text-center text-black w-fit justify-center space-x-2'>
            <span>{roomId}</span><MdOutlineContentCopy/>
          </div>
        </div>
      
      )}
      <div className='flex flex-wrap items-center justify-center'>
      {mode === GameModes.SINGLE_PLAYER
          ? players.map((players, idx) => (
              <PlayerCard delayIdx={idx} player={players} />
            ))
          : players
              .sort((player1, player2) => {
                return progress.get(player2.socketId)?.wpm ||
                  0 > progress.get(player1.socketId)?.wpm! ||
                  0
                  ? 1
                  : -1;
              })
              ?.map((players, idx) => (
                <PlayerCard key={idx} delayIdx={idx} player={players} />
              ))}
      </div>
    </div>
  );
        
};
export default Players;