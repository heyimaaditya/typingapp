import React from 'react';
import { BsGlobeAmericas } from 'react-icons/bs';
import GameModeButton from './GameMode';
import {GameModes} from '../../interfaces/game.d'
type Props = {};

const MultiplePlayerMode = (props: Props) => {
  return (
    <div className="p-6 space-y-4">
      <h3 className="text-2xl font-semibold">
        Multi Player{' '}
        <span>
          <BsGlobeAmericas className="inline pl-1" />
        </span>{' '}
      </h3>
      <GameModeButton mode={GameModes.ONLINE} text="Join Game" />
    </div>
  );
};

export default MultiplePlayerMode;