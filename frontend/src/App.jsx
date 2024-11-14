import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SigninForm from './components/SigninForm';
import SignupForm from './components/SignupForm';
import LogOut from './components/LogOut';
import DashBoard from './components/DashBoard';
import SingleSlide from './components/SingleSlide';

const welcomeStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  fontSize: '3rem',
  fontWeight: 'bold',
  color: '#333',
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  return (
    <>
    <BrowserRouter>

    <LogOut token = {token} setToken = {setToken}/>

    <Routes>
    <Route path="/" element={<div style={welcomeStyle}>Welcome Back PRESTO!</div>} />
      <Route path="/login" element={<SigninForm setToken = {setToken} />}></Route> 
      <Route path="/register" element={<SignupForm setToken = {setToken}/>}></Route>
      <Route path="/dashboard" element={<DashBoard/>}></Route>
      <Route path="/edit/:id" element={<SingleSlide/>}></Route>
    </Routes>

    </BrowserRouter>
    </>
  )
}

export default App
