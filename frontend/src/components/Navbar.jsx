import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

function Navbar() {
  const navigate = useNavigate();
  const [showMenu,setShowMenu] = useState(false);
  const { token, setToken } = useContext(AppContext)

  // If your admin panel login is at /admin or /admin/login, set it here.
  // You can also use: const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || `${window.location.origin}/admin`;
  const ADMIN_URL = import.meta.env.VITE_ADMIN_URL ;

  const logout = ()=>{
    setToken(false)
    localStorage.removeItem('token')
  }

  const openAdmin = () => {
    window.open(ADMIN_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
      <img onClick={()=>navigate('/')} className='w-60 cursor-pointer' src={assets.main_logo} alt='' />

      {/* Desktop menu */}
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'>
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 rounded-sm bg-primary w-4/5 m-auto hidden'/>
        </NavLink>

        <NavLink to='/menu'>
          <li className='py-1'>MENU</li>
          <hr className='border-none outline-none h-0.5 rounded-sm bg-primary w-3/5 m-auto hidden'/>
        </NavLink>

        <NavLink to='/about'>
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 rounded-sm bg-primary w-3/5 m-auto hidden'/>
        </NavLink>

        <NavLink to='/contact'>
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 rounded-sm bg-primary w-3/5 m-auto hidden'/>
        </NavLink>
      </ul>

      <div className='flex items-center gap-4'>
        {token ? (
          <div className='flex items-center gap-4'>
            {/* Cart Icon */}
            <div className='relative cursor-pointer' onClick={()=>navigate('/cart')}>
              <img className='w-6' src={assets.basket_icon} alt='cart'/>
              <div className='absolute min-w-4 min-h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center -top-2 -right-2'>
                3
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-9 rounded-full' src={assets.profile_pic} alt=''/>
              <img className='w-2.5' src={assets.dropdown_icon} alt=''/>
              <div className='absolute z-10 text-gray-600 top-0 right-0 pt-14 text-base font-medium hidden group-hover:block'>
                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-2 p-4'>
                  <p className='hover:text-black cursor-pointer' onClick={()=>navigate('/profile')}>Profile</p>
                  <p className='hover:text-black cursor-pointer' onClick={()=>navigate('/orders')}>Orders</p>
                  <hr />
                  <p className='hover:text-black cursor-pointer' onClick={logout}>Logout</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={()=>navigate('/login')} className='bg-primary outine-none rounded-full hidden md:block px-8 py-3 text-white'>
            Sign In
          </button>
        )}

        <img onClick={()=>{setShowMenu(true)}} src={assets.menu_icon} className='md:hidden w-6' alt='' />

        {/* Mobile drawer */}
        <div className={`${showMenu?'fixed w-full' : 'h-0 w-0'} md:hidden bg-white overflow-hidden top-0 bottom-0 right-0 z-20 transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-36' src={assets.logo} alt='' />
            <img className='w-7' src={assets.cross_icon} onClick={()=>{setShowMenu(false)}} alt='' />
          </div>
          <div>
            <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium transition-all'>
              <NavLink onClick={()=>setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
              <NavLink onClick={()=>setShowMenu(false)} to='/menu'><p className='px-4 py-2 rounded inline-block'>Menu</p></NavLink>
              <NavLink onClick={()=>setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>About</p></NavLink>
              <NavLink onClick={()=>setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>Contact</p></NavLink>
              {token && (
                <>
                  <NavLink onClick={()=>setShowMenu(false)} to='/profile'><p className='px-4 py-2 rounded inline-block'>Profile</p></NavLink>
                  <NavLink onClick={()=>setShowMenu(false)} to='/cart'><p className='px-4 py-2 rounded inline-block'>Cart</p></NavLink>
                  <NavLink onClick={()=>setShowMenu(false)} to='/orders'><p className='px-4 py-2 rounded inline-block'>Orders</p></NavLink>
                  <p className='px-4 py-2 rounded inline-block cursor-pointer' onClick={()=>{logout(); setShowMenu(false)}}>Logout</p>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar