/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { AiOutlineTeam } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import GameModeButton from './GameMode';
import {GameModes} from '../../interfaces/game.d'
type Props = {};

const PlayWithFriendsMode = (props: Props) => {
  return (
    <div className="p-6 space-y-4">
      <h3 className="text-2xl font-semibold">
        Play With Friends{' '}
        <span>
          <AiOutlineTeam className="inline pl-1" />
        </span>{' '}
      </h3>

      <GameModeButton mode={GameModes.WITH_FRIENDS} text="Create Room" />
    </div>
  );
};

export default PlayWithFriendsMode;