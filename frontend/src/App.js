import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './pages/LoginRegister';
import Home from './pages/Home';
import './App.css';
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<LoginRegister />} />
      </Routes>
    </div>
  );
}


export default App;
