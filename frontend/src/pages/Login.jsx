import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const onSubmitHandler = async (event) => {
    event.preventDefault();

  }

  return (
    <div>
      <div className='w-full h-screen mt-20'>
        <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center justify-center ">
        <div className="flex flex-col gap-4 w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200 animate-fadeIn">

          <p className="text-3xl font-bold text-gray-800 text-center">
            {state === 'Sign Up' ? 'Create Your Account' : 'Welcome Back'}
          </p>

          <p className="text-center text-gray-500 mb-4">
            Please {state === 'Sign Up' ? 'sign up' : 'log in'} to continue
          </p>

          {state === 'Sign Up' && (
            <div className="w-full">
              <label className="font-medium">Full Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                required
                className="border border-gray-300 rounded-lg w-full p-3 mt-1 focus:ring-2 focus:ring-primary focus:outline-none transition"
              />
            </div>
          )}

          <div className="w-full">
            <label className="font-medium">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              required
              className="border border-gray-300 rounded-lg w-full p-3 mt-1 focus:ring-2 focus:ring-primary focus:outline-none transition"
            />
          </div>

          <div className="w-full">
            <label className="font-medium">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              required
              className="border border-gray-300 rounded-lg w-full p-3 mt-1 focus:ring-2 focus:ring-primary focus:outline-none transition"
            />
          </div>

          <button className="bg-primary text-white w-full py-3 mt-4 rounded-lg text-base font-semibold shadow-md hover:opacity-90 transition">
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </button>

          <p className="text-center text-gray-600 mt-2">
            {state === 'Sign Up' ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setState('Login')}
                  className="text-primary underline cursor-pointer hover:text-primary/80 transition"
                >
                  Login here
                </span>
              </>
            ) : (
              <>
                Create a new account?{" "}
                <span
                  onClick={() => setState('Sign Up')}
                  className="text-primary underline cursor-pointer hover:text-primary/80 transition"
                >
                  Click here
                </span>
              </>
            )}
          </p>
        </div>
      </form>
      </div>

    </div>
  )
}

export default Login