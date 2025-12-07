import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

// Default items to add to cart
const defaultCartItems = [
    {
        _id: '1',
        item_name: 'Margherita Pizza',
        category: 'Pizza',
        price: 299,
        quantity: 2,
        inventory_count: 50,
        description: 'Classic Italian pizza with fresh mozzarella, tomato sauce, and basil leaves',
        image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop'
    },
    {
        _id: '2',
        item_name: 'Chicken Burger',
        category: 'Burgers',
        price: 189,
        quantity: 1,
        inventory_count: 30,
        description: 'Juicy grilled chicken patty with fresh vegetables and special sauce',
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop'
    },
    {
        _id: '3',
        item_name: 'Chocolate Milkshake',
        category: 'Beverages',
        price: 149,
        quantity: 2,
        inventory_count: 40,
        description: 'Rich and creamy chocolate milkshake topped with whipped cream',
        image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop'
    },
    {
        _id: '4',
        item_name: 'Caesar Salad',
        category: 'Salads',
        price: 229,
        quantity: 1,
        inventory_count: 25,
        description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese',
        image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop'
    }
]

const Cart = () => {
    const navigate = useNavigate()
    const { backendUrl, token } = useContext(AppContext)
    
    const [cartItems, setCartItems] = useState([])
    const [diningOption, setDiningOption] = useState('dine-in')
    const [loading, setLoading] = useState(false)

    // Load cart from localStorage on component mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart)
                if (parsedCart.length > 0) {
                    setCartItems(parsedCart)
                } else {
                    // If cart is empty, add default items
                    setCartItems(defaultCartItems)
                }
            } catch (error) {
                console.error('Error loading cart:', error)
                setCartItems(defaultCartItems)
            }
        } else {
            // If no cart exists, initialize with default items
            setCartItems(defaultCartItems)
        }
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (cartItems.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cartItems))
        } else {
            localStorage.removeItem('cart')
        }
    }, [cartItems])

    // Calculate total price
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity)
        }, 0)
    }

    // Update item quantity
    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            removeItem(itemId)
            return
        }
        setCartItems(items => 
            items.map(item => 
                item._id === itemId 
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        )
        toast.success('Cart updated')
    }

    // Remove item from cart
    const removeItem = (itemId) => {
        setCartItems(items => items.filter(item => item._id !== itemId))
        toast.success('Item removed from cart')
    }

    // Place order
    const placeOrder = async () => {
        if (!token) {
            toast.warning('Please login to place an order')
            navigate('/login')
            return
        }

        if (cartItems.length === 0) {
            toast.error('Your cart is empty')
            return
        }

        setLoading(true)
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    item_id: item._id,
                    quantity: item.quantity
                })),
                total_price: calculateTotal(),
                dining_option: diningOption
            }

            const { data } = await axios.post(
                `${backendUrl}/api/user/place-order`,
                orderData,
                { headers: { token } }
            )
            
            if (data.success) {
                toast.success('Order placed successfully!')
                setCartItems([])
                localStorage.removeItem('cart')
                navigate('/')
            } else {
                toast.error(data.message || 'Failed to place order')
            }
        } catch (error) {
            console.error('Error placing order:', error)
            toast.error(error.response?.data?.message || 'Failed to place order. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some items to your cart to continue shopping</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[80vh] py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>
            
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Cart Items */}
                <div className="flex-1">
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                        {cartItems.map((item) => (
                            <div
                                key={item._id}
                                className="flex flex-col sm:flex-row gap-4 p-4 border-b border-gray-200 last:border-b-0"
                            >
                                {/* Item Image */}
                                <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.item_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* Item Details */}
                                <div className="flex-1 flex flex-col justify-between">
        <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {item.item_name}
                                        </h3>
                                        {item.description && (
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {item.description}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-500 mt-1">
                                            Category: {item.category}
                                        </p>
                </div>

                                    <div className="flex items-center justify-between mt-4">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                                                disabled={item.quantity <= 1}
                                            >
                                                −
                                            </button>
                                            <span className="text-lg font-medium w-8 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                                                disabled={item.quantity >= (item.inventory_count || 999)}
                                            >
                                                +
                                            </button>
                    </div>

                                        {/* Price and Remove */}
                                        <div className="flex items-center gap-4">
                                            <p className="text-lg font-bold text-gray-800">
                                                ₹{item.price * item.quantity}
                                            </p>
                                            <button
                                                onClick={() => removeItem(item._id)}
                                                className="text-red-500 hover:text-red-700 transition text-sm font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-96">
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                        
                        {/* Dining Option */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dining Option
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="diningOption"
                                        value="dine-in"
                                        checked={diningOption === 'dine-in'}
                                        onChange={(e) => setDiningOption(e.target.value)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700">Dine In</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="diningOption"
                                        value="delivery"
                                        checked={diningOption === 'delivery'}
                                        onChange={(e) => setDiningOption(e.target.value)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700">Delivery</span>
                                </label>
                </div>
            </div>

                        {/* Price Breakdown */}
                        <div className="border-t border-gray-200 pt-4 space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                <span>₹{calculateTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span>₹{calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={placeOrder}
                            disabled={loading}
                            className="w-full bg-primary text-white py-3 rounded-lg font-semibold mt-6 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>

                        {/* Continue Shopping */}
                        <button
                            onClick={() => navigate('/')}
                            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold mt-3 hover:bg-gray-50 transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
