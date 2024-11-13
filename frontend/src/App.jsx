import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SigninForm from './components/SigninForm';

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<SigninForm/>}></Route> 
      <Route path="/register" element={<SigninForm/>}></Route>
      <Route path="/login"></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
