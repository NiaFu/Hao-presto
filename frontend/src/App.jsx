import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/"></Route> 
      <Route path="/register"></Route>
      <Route path="/login"></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
