import React from 'react'

import { ToastContainer } from 'react-toastify'
import { Routes,Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';



import Home from './pages/Home';   
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
// import Cart from './pages/Cart'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]' >
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>} />
        {/* <Route path='/cart' element={<Cart/>} /> */}
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} /> 
        <Route path='/login' element={<Login />} />    

      </Routes>
    </div>
  )
}

export default App