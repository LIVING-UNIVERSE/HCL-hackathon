import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'



const Login = () => {

  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Check if backendUrl is set
    if (!backendUrl) {
      toast.error('Backend URL is not configured. Please check your environment variables.')
      console.error('Backend URL is undefined. VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL)
      return
    }

    try {
      if (state === 'Sign Up') {
        const url = `${backendUrl}/api/user/register`
        console.log('Registering user at:', url)
        const { data } = await axios.post(url, { name, email, password })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Account created successfully!')
          // Clear form
          setName('')
          setEmail('')
          setPassword('')
          // Role will be fetched automatically by AppContext useEffect
        } else {
          toast.error(data.message || 'Registration failed')
        }
      } else {
        const url = `${backendUrl}/api/user/login`
        console.log('Logging in at:', url)
        const { data } = await axios.post(url, { email, password })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Login successful!')
          // Clear form
          setEmail('')
          setPassword('')
          // Role will be fetched automatically by AppContext useEffect
        } else {
          toast.error(data.message || 'Login failed')
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      console.error('Request URL:', error.config?.url)
      console.error('Response status:', error.response?.status)
      console.error('Response data:', error.response?.data)
      
      if (error.response?.status === 404) {
        toast.error(`API endpoint not found. Please check if backend is running at ${backendUrl}`)
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred. Please try again.'
        toast.error(errorMessage)
      }
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

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