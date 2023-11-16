/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Layout from './components/Layout/Layout';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Home from './pages/Home';
import { useEffect, useState } from 'react';
import { socket } from './utils/socket';
import GameSettings from './pages/GameSettings';
import Game from './pages/Game'
import useUserStore from './store/useUserStore';
import useGameStore from './store/gameStore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ExtendedUser } from './interfaces/user';
//import { useEffect } from 'react';
//import useGameStore from './store/gameStore';
function App(){
  const [setSocketId]=useUserStore((state)=>[state.setSocketId]);
  //const [setPlayers]=useGameStore((state)=>[state.setPlayers]);
  const [roomId] = useGameStore((state) => [state.roomId]);
  const [setUser] = useUserStore((state) => [state.setUser]);

  useEffect(() => {
    const auth = getAuth();

    const listener = onAuthStateChanged(auth, async (user) => {
      if (user !== null) setUser(user as ExtendedUser);
    });

    return () => {
      listener();
    };
  }, []);

  useEffect(() => {
    function onConnect() {
      setSocketId(socket.id);
    }

    function onDisconnect() {
      setSocketId(null);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/game-settings' element={<GameSettings/>}/>
          <Route path='/game' element={<Game/>}/>
        </Routes>
      </Layout>
    </Router>
  )
}
export default App;