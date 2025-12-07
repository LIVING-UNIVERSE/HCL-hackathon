import React from 'react'

import { ToastContainer } from 'react-toastify'
import { Routes,Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';



import Home from './pages/Home';   
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart'
import Menu from './pages/Menu'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import ErrorBanner from './components/ErrorBanner'

const App = () => {
  return (
    <div>
      <Navbar />
    
      <div className='mx-4 sm:mx-[10%]' >
        <ToastContainer/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/menu' element={<Menu/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/admin' element={<AdminPanel/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/contact' element={<Contact/>} /> 
          <Route path='/login' element={<Login />} />    

        </Routes>
      </div>
      <Footer />

    </div>
  )
}

export default App