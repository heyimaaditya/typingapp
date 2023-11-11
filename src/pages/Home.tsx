/* eslint-disable import/first */
import React from 'react'
type Props={};
import GlobalLeaderBoards from '../components/Home/GlobalLeaderBoards';
import MultiplePlayerMode from '../components/Home/MultiplePlayerMode';
import PlayWithFriendsMode from '../components/Home/PlayWithFriendsMode';
import SinglePlayerMode from '../components/Home/SinglePlayerMode';
const Home = (props: Props) => {
  return (
    <div className="p-6 sm:p-10">
    <div className="grid grid-cols-1 max-w-7xl mx-auto md:grid-cols-2 gap-8">
      <div className="grid grid-col-1 md:grid-cols-1 lg:grid-cols-2  h-full gap-6">
        <div className="row-span-1 col-span-2 h-full w-full shadow-md shadow-secondary bg-primary2 rounded-xl ">
          <SinglePlayerMode />
        </div>
        <div className="row-span-1 col-span-2 h-full w-full shadow-md shadow-secondary bg-primary2 rounded-xl xl:col-span-1">
          <MultiplePlayerMode />
        </div>
        <div className="row-span-1 col-span-2 h-full w-full shadow-md shadow-secondary bg-primary2 rounded-xl xl:col-span-1">
          <PlayWithFriendsMode />
        </div>
      </div>

      <GlobalLeaderBoards />
    </div>
  </div>
  );
};
export default Home;