import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Menu = () => {
    const navigate = useNavigate()
    const { backendUrl } = useContext(AppContext)
    
    const [menuItems, setMenuItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState('Pizza')
    const [cartCount, setCartCount] = useState(0)

    // Fetch menu items from backend
    useEffect(() => {
        const fetchMenuItems = async () => {
            if (!backendUrl) {
                console.warn('Backend URL not configured')
                setLoading(false)
                return
            }

            setLoading(true)
            try {
                const { data } = await axios.get(`${backendUrl}/api/item/list`)
                
                if (data.success && data.items) {
                    // Transform backend data to match frontend format
                    const transformedItems = data.items.map(item => {
                        // Handle image URL - check if it's already a full URL or just a filename
                        let imageUrl = 'https://via.placeholder.com/400x300?text=No+Image';
                        
                        if (item.image && item.image.trim() !== '') {
                            // Check if image is already a full URL (starts with http:// or https://)
                            if (item.image.startsWith('http://') || item.image.startsWith('https://')) {
                                imageUrl = item.image;
                            } else {
                                // It's a filename, construct the full URL
                                // Remove any leading/trailing slashes and whitespace from the filename
                                const cleanFilename = item.image.trim().replace(/^\/+|\/+$/g, '');
                                // Ensure backendUrl doesn't have trailing slash
                                const cleanBackendUrl = backendUrl.replace(/\/+$/, '');
                                imageUrl = `${cleanBackendUrl}/uploads/${cleanFilename}`;
                            }
                        }
                        
                        return {
                            _id: item._id,
                            item_name: item.name,
                            category: item.category,
                            price: item.price,
                            inventory_count: item.stock,
                            description: item.description,
                            image_url: imageUrl
                        };
                    })
                    
                    setMenuItems(transformedItems)
                    
                    // Set default category to first available category
                    if (transformedItems.length > 0) {
                        const firstCategory = transformedItems[0].category
                        setSelectedCategory(firstCategory)
                    }
                } else {
                    toast.error('Failed to load menu items')
                    setMenuItems([])
                }
            } catch (error) {
                console.error('Error fetching menu items:', error)
                toast.error('Failed to load menu items. Please try again.')
                setMenuItems([])
            } finally {
                setLoading(false)
            }
        }

        fetchMenuItems()
    }, [backendUrl])

    // Get unique categories from fetched items
    const categories = [...new Set(menuItems.map(item => item.category))]

    // Filter items by selected category
    const filteredItems = menuItems.filter(item => item.category === selectedCategory)

    // Load cart count from localStorage
    useEffect(() => {
        const updateCartCount = () => {
            const savedCart = localStorage.getItem('cart')
            if (savedCart) {
                try {
                    const parsedCart = JSON.parse(savedCart)
                    const totalItems = parsedCart.reduce((sum, item) => sum + item.quantity, 0)
                    setCartCount(totalItems)
                } catch (error) {
                    console.error('Error loading cart:', error)
                    setCartCount(0)
                }
            } else {
                setCartCount(0)
            }
        }
        
        updateCartCount()
        // Listen for cart updates from other components
        window.addEventListener('storage', updateCartCount)
        
        // Also check periodically for cart changes
        const interval = setInterval(updateCartCount, 500)
        
        return () => {
            window.removeEventListener('storage', updateCartCount)
            clearInterval(interval)
        }
    }, [])

    // Add item to cart
    const addToCart = (item) => {
        const savedCart = localStorage.getItem('cart')
        let cart = savedCart ? JSON.parse(savedCart) : []
        
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(cartItem => cartItem._id === item._id)
        
        if (existingItemIndex >= 0) {
            // Increase quantity if item exists
            cart[existingItemIndex].quantity += 1
            toast.success(`${item.item_name} quantity increased!`)
        } else {
            // Add new item to cart with quantity 1
            cart.push({
                ...item,
                quantity: 1
            })
            toast.success(`${item.item_name} added to cart!`)
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart))
        
        // Update cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(totalItems)
        
        // Trigger custom event for other components to listen
        window.dispatchEvent(new Event('cartUpdated'))
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen py-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-gray-600">Loading menu items...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Menu</h1>
                <p className="text-gray-600">Choose from our delicious selection</p>
            </div>

            {/* Category Tabs */}
            {categories.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-3 rounded-full font-semibold transition-all ${
                                selectedCategory === category
                                    ? 'bg-primary text-white shadow-lg scale-105'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                        {/* Item Image */}
                        <div className="w-full h-48 bg-gray-100 overflow-hidden">
                            {item.image_url && item.image_url !== 'https://via.placeholder.com/400x300?text=No+Image' ? (
                                <img
                                    src={item.image_url}
                                    alt={item.item_name}
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                    onError={(e) => {
                                        console.error('Image failed to load:', item.image_url);
                                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                                    }}
                                    onLoad={() => {
                                        console.log('Image loaded successfully:', item.image_url);
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Item Details */}
                        <div className="p-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                {item.item_name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {item.description}
                            </p>
                            
                            {/* Price and Stock */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-2xl font-bold text-primary">
                                        ₹{item.price}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {item.inventory_count > 0 ? (
                                            <span className="text-green-600">In Stock</span>
                                        ) : (
                                            <span className="text-red-600">Out of Stock</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={() => addToCart(item)}
                                disabled={item.inventory_count === 0}
                                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                                    item.inventory_count > 0
                                        ? 'bg-primary text-white hover:bg-primary/90 hover:scale-105'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {item.inventory_count > 0 ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                        </svg>
                                        Add to Cart
                                    </span>
                                ) : (
                                    'Out of Stock'
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Cart Button */}
            {cartCount > 0 && (
                <button
                    onClick={() => navigate('/cart')}
                    className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 z-50"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    <span className="bg-white text-primary rounded-full px-3 py-1 font-bold">
                        {cartCount}
                    </span>
                </button>
            )}

            {/* Empty State */}
            {!loading && filteredItems.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🍕</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {menuItems.length === 0 ? 'No items available' : 'No items found in this category'}
                    </h2>
                    <p className="text-gray-600">
                        {menuItems.length === 0 
                            ? 'Please check back later or contact support'
                            : 'Try selecting a different category'
                        }
                    </p>
                </div>
            )}
        </div>
    )
}

export default Menu
