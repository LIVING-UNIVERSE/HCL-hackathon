import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { token, setToken, userData, isAdmin } = useContext(AppContext)
    
    const [cartCount, setCartCount] = useState(0)
    const [showProfileDropdown, setShowProfileDropdown] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    // Update cart count from localStorage
    useEffect(() => {
        const updateCartCount = () => {
            const savedCart = localStorage.getItem('cart')
            if (savedCart) {
                try {
                    const parsedCart = JSON.parse(savedCart)
                    const totalItems = parsedCart.reduce((sum, item) => sum + (item.quantity || 1), 0)
                    setCartCount(totalItems)
                } catch (error) {
                    setCartCount(0)
                }
            } else {
                setCartCount(0)
            }
        }

        updateCartCount()
        
        // Listen for cart updates
        window.addEventListener('storage', updateCartCount)
        window.addEventListener('cartUpdated', updateCartCount)
        
        // Check periodically for cart changes
        const interval = setInterval(updateCartCount, 500)
        
        return () => {
            window.removeEventListener('storage', updateCartCount)
            window.removeEventListener('cartUpdated', updateCartCount)
            clearInterval(interval)
        }
    }, [])

    // Close mobile menu when route changes
    useEffect(() => {
        setShowMobileMenu(false)
        setShowProfileDropdown(false)
    }, [location.pathname])

    // Logout function
    const handleLogout = () => {
        setToken('')
        localStorage.removeItem('token')
        localStorage.removeItem('cart') // Optional: clear cart on logout
        setShowProfileDropdown(false)
        toast.success('Logged out successfully')
        navigate('/login')
    }

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="mx-4 sm:mx-[10%]">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <NavLink to="/" className="flex items-center gap-2 cursor-pointer">
                        <div className="text-3xl">🍕</div>
                        <div>
                            <h1 className="text-xl font-bold text-primary">PizzaHub</h1>
                            <p className="text-xs text-gray-500">Fresh & Delicious</p>
                        </div>
                    </NavLink>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `font-medium transition-colors ${
                                    isActive
                                        ? 'text-primary border-b-2 border-primary pb-1'
                                        : 'text-gray-700 hover:text-primary'
                                }`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/menu"
                            className={({ isActive }) =>
                                `font-medium transition-colors ${
                                    isActive
                                        ? 'text-primary border-b-2 border-primary pb-1'
                                        : 'text-gray-700 hover:text-primary'
                                }`
                            }
                        >
                            Menu
                        </NavLink>
                        <NavLink
                            to="/cart"
                            className={({ isActive }) =>
                                `font-medium transition-colors relative ${
                                    isActive
                                        ? 'text-primary border-b-2 border-primary pb-1'
                                        : 'text-gray-700 hover:text-primary'
                                }`
                            }
                        >
                            Cart
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-4 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </NavLink>

                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                `font-medium transition-colors ${
                                    isActive
                                        ? 'text-primary border-b-2 border-primary pb-1'
                                        : 'text-gray-700 hover:text-primary'
                                }`
                            }
                        >
                            Profile
                        </NavLink>
                        {isAdmin && (
                            <NavLink
                                to="/admin"
                                className={({ isActive }) =>
                                    `font-medium transition-colors ${
                                        isActive
                                            ? 'text-primary border-b-2 border-primary pb-1'
                                            : 'text-gray-700 hover:text-primary'
                                    }`
                                }
                            >
                                Admin Panel
                            </NavLink>
                        )}

                        {token ? (
                            <>
                                {/* User Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                        className="flex items-center gap-2 font-medium text-gray-700 hover:text-primary transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                                            {userData?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <span>Profile</span>
                                        <svg
                                            className={`w-4 h-4 transition-transform ${
                                                showProfileDropdown ? 'rotate-180' : ''
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>

                                    {showProfileDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                            {isAdmin && (
                                                <NavLink
                                                    to="/admin"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                                    onClick={() => setShowProfileDropdown(false)}
                                                >
                                                    Admin Panel
                                                </NavLink>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <NavLink
                                to="/login"
                                className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
                            >
                                Login
                            </NavLink>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="md:hidden text-gray-700 hover:text-primary transition-colors"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {showMobileMenu ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col gap-4">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `font-medium px-4 py-2 rounded ${
                                        isActive
                                            ? 'text-primary bg-primary/10'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/menu"
                                className={({ isActive }) =>
                                    `font-medium px-4 py-2 rounded ${
                                        isActive
                                            ? 'text-primary bg-primary/10'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Menu
                            </NavLink>
                            <NavLink
                                to="/cart"
                                className={({ isActive }) =>
                                    `font-medium px-4 py-2 rounded relative ${
                                        isActive
                                            ? 'text-primary bg-primary/10'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Cart
                                {cartCount > 0 && (
                                    <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-1">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </NavLink>

                            {token ? (
                                <>
                                    <NavLink
                                        to="/profile"
                                        className={({ isActive }) =>
                                            `font-medium px-4 py-2 rounded ${
                                                isActive
                                                    ? 'text-primary bg-primary/10'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`
                                        }
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        Profile
                                    </NavLink>
                                    {isAdmin && (
                                        <NavLink
                                            to="/admin"
                                            className={({ isActive }) =>
                                                `font-medium px-4 py-2 rounded ${
                                                    isActive
                                                        ? 'text-primary bg-primary/10'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                }`
                                            }
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            Admin Panel
                                        </NavLink>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="text-left font-medium px-4 py-2 rounded text-red-600 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <NavLink
                                    to="/login"
                                    className="bg-primary text-white px-4 py-2 rounded-full font-medium text-center hover:bg-primary/90 transition-colors"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    Login
                                </NavLink>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Click outside to close dropdown */}
            {showProfileDropdown && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfileDropdown(false)}
                />
            )}
        </nav>
  )
}

export default Navbar
