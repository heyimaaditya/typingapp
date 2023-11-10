import React from 'react';
import './App.css';
import Layout from './components/Layout/Layout';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Home from './pages/Home';
function App(){
  return (
    <Layout>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
        </Routes>
      </Router>
    </Layout>
  )
}
export default App;