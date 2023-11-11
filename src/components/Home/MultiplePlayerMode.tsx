import React from "react";
import { BsGlobeAmericas } from 'react-icons/bs';
import GameModeButton from './GameModeButton';

type Props = {};

const MultiplePlayerMode = (props: Props) => {
  return (
    <div className="p-6 cursor-not-allowed space-y-4 opacity-60">
      <h3 className="font-semibold">
        Multi Player{' '}
        <span>
          <BsGlobeAmericas className="inline" />
        </span>{' '}
      </h3>
      <button disabled className="cursor-not-allowed disabled:opacity-50 "><GameModeButton mode="online" text="Join Game" /></button>
      
    </div>
  );
};

export default MultiplePlayerMode;