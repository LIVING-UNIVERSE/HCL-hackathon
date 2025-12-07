import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Cart = () => {
    const navigate = useNavigate()
    const { backendUrl, token } = useContext(AppContext)
    
    const [cartItems, setCartItems] = useState([])
    const [diningOption, setDiningOption] = useState('dine-in')
    const [loading, setLoading] = useState(false)
    const [placedOrder, setPlacedOrder] = useState(null)

    // Load cart from localStorage on component mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart)
                if (parsedCart.length > 0) {
                    setCartItems(parsedCart)
                } else {
                    // Cart is empty, set to empty array
                    setCartItems([])
                }
            } catch (error) {
                console.error('Error loading cart:', error)
                setCartItems([])
            }
        } else {
            // If no cart exists, start with empty cart
            setCartItems([])
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
            // Transform cart items to match backend order model format
            const orderItems = cartItems.map(item => ({
                itemId: item._id,
                name: item.item_name,
                price: item.price,
                quantity: item.quantity
            }))

            // Use dummy phone and address
            const dummyPhone = '+91 9876543210'
            const dummyAddress = {
                line1: '123 Main Street',
                line2: 'Apartment 4B'
            }

            const orderData = {
                items: orderItems,
                totalAmount: calculateTotal(),
                address: dummyAddress,
                phone: dummyPhone,
                paymentMethod: 'COD' // Default to Cash on Delivery
            }

            console.log('Placing order with data:', orderData)

            const { data } = await axios.post(
                `${backendUrl}/api/order/place`,
                orderData,
                { headers: { token } }
            )
            
            if (data.success) {
                toast.success('Order placed successfully!')
                
                // Use order from backend response if available, otherwise create order object
                const orderDetails = data.order ? {
                    orderId: data.order._id || data.orderId,
                    items: data.order.items || orderItems,
                    totalAmount: data.order.totalAmount || calculateTotal(),
                    address: data.order.address || dummyAddress,
                    phone: data.order.phone || dummyPhone,
                    paymentMethod: data.order.paymentMethod || 'COD',
                    status: data.order.status || 'Order Placed',
                    createdAt: data.order.createdAt || new Date().toISOString()
                } : {
                    orderId: data.orderId,
                    items: orderItems,
                    totalAmount: calculateTotal(),
                    address: dummyAddress,
                    phone: dummyPhone,
                    paymentMethod: 'COD',
                    status: 'Order Placed',
                    createdAt: new Date().toISOString()
                }
                
                setPlacedOrder(orderDetails)
                setCartItems([])
                localStorage.removeItem('cart')
            } else {
                toast.error(data.message || 'Failed to place order')
            }
        } catch (error) {
            console.error('Error placing order:', error)
            console.error('Error response:', error.response?.data)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to place order. Please try again.'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    // Handle continue shopping after order placement
    const handleContinueShopping = () => {
        setPlacedOrder(null)
        navigate('/menu')
    }

    // Show order confirmation card if order is placed
    if (placedOrder) {
        return (
            <div className="min-h-[80vh] py-8 flex items-center justify-center">
                <div className="max-w-2xl w-full">
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-8">
                        {/* Success Icon */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
                            <p className="text-gray-600">Your order has been confirmed and will be processed soon.</p>
                        </div>

                        {/* Order Details Card */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Order Details</h3>
                            
                            {/* Order ID */}
                            <div className="mb-4 pb-4 border-b border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                                <p className="text-lg font-semibold text-gray-800">#{placedOrder.orderId}</p>
                            </div>

                            {/* Order Items */}
                            <div className="mb-4 pb-4 border-b border-gray-200">
                                <p className="text-sm text-gray-600 mb-2">Items Ordered</p>
                                <div className="space-y-2">
                                    {placedOrder.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-gray-800">
                                                {item.name} × {item.quantity}
                                            </span>
                                            <span className="text-gray-600 font-medium">
                                                ₹{item.price * item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="mb-4 pb-4 border-b border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                                <p className="text-gray-800">{placedOrder.address.line1}</p>
                                {placedOrder.address.line2 && (
                                    <p className="text-gray-800">{placedOrder.address.line2}</p>
                                )}
                            </div>

                            {/* Contact */}
                            <div className="mb-4 pb-4 border-b border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">Contact Number</p>
                                <p className="text-gray-800">{placedOrder.phone}</p>
                            </div>

                            {/* Payment Method */}
                            <div className="mb-4 pb-4 border-b border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                                <p className="text-gray-800">{placedOrder.paymentMethod}</p>
                            </div>

                            {/* Order Status */}
                            <div className="mb-4 pb-4 border-b border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">Status</p>
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                    {placedOrder.status}
                                </span>
                            </div>

                            {/* Order Date */}
                            {placedOrder.createdAt && (
                                <div className="mb-4 pb-4 border-b border-gray-200">
                                    <p className="text-sm text-gray-600 mb-1">Order Date</p>
                                    <p className="text-gray-800">
                                        {new Date(placedOrder.createdAt).toLocaleString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            )}

                            {/* Total Amount */}
                            <div className="flex justify-between items-center">
                                <p className="text-lg font-semibold text-gray-800">Total Amount</p>
                                <p className="text-2xl font-bold text-primary">₹{placedOrder.totalAmount.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleContinueShopping}
                                className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
                            >
                                Continue Shopping
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                            >
                                Go to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some items to your cart to continue shopping</p>
                    <button
                        onClick={() => navigate('/menu')}
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
