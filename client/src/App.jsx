import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Landing from './pages/Landing/Landing';
import Home from './pages/Home/Home';
import Detail from './components/Detail/Detail';
import Form from './components/Form/Form';

function App() {


  return (
    <div>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/home' element={<Home />} />
        <Route path='/detail/:id' element={<Detail />} />
        <Route path='/Create' element={<Form />} />
      </Routes>
    </div>
  )
}

export default App
