<<<<<<< HEAD
// import React, { useEffect, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux' // 1. Import Redux hooks
// import { fetchDoctorList } from '../features/doctors/doctorSlice' // 2. Import action to refresh data
// // import { assets } from '../assets/assets'
// // import RelatedDoctors from '../components/RelatedDoctors'
// //lol
// import axios from 'axios'
// import { toast } from 'react-toastify'

// const Appointment = () => {

//     const { docId } = useParams()
//     const navigate = useNavigate()
//     const dispatch = useDispatch() // 3. Initialize dispatch

//     // 4. Get global state from Redux Store instead of Context
//     const doctors = useSelector((state) => state.doctors.list)
//     const token = useSelector((state) => state.auth.token)
    
//     // 5. Define static constants locally (or import from a config file)
//     const currencySymbol = '₹'
//     const backendUrl = import.meta.env.VITE_BACKEND_URL

//     const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

//     const [docInfo, setDocInfo] = useState(null) // changed false to null for better type safety
//     const [docSlots, setDocSlots] = useState([])
//     const [slotIndex, setSlotIndex] = useState(0)
//     const [slotTime, setSlotTime] = useState('')

//     const fetchDocInfo = async () => {
//         const docInfo = doctors.find((doc) => doc._id === docId)
//         setDocInfo(docInfo)
//     }

//     const getAvailableSolts = async () => {
//         setDocSlots([])

//         // getting current date
//         let today = new Date()

//         for (let i = 0; i < 7; i++) {
//             // getting date with index 
//             let currentDate = new Date(today)
//             currentDate.setDate(today.getDate() + i)

//             // setting end time of the date with index
//             let endTime = new Date()
//             endTime.setDate(today.getDate() + i)
//             endTime.setHours(21, 0, 0, 0)

//             // setting hours 
//             if (today.getDate() === currentDate.getDate()) {
//                 currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
//                 currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
//             } else {
//                 currentDate.setHours(10)
//                 currentDate.setMinutes(0)
//             }

//             let timeSlots = [];

//             while (currentDate < endTime) {
//                 let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//                 let day = currentDate.getDate()
//                 let month = currentDate.getMonth() + 1
//                 let year = currentDate.getFullYear()

//                 const slotDate = day + "_" + month + "_" + year
//                 const slotTime = formattedTime

//                 const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

//                 if (isSlotAvailable) {
//                     // Add slot to array
//                     timeSlots.push({
//                         datetime: new Date(currentDate),
//                         time: formattedTime
//                     })
//                 }

//                 // Increment current time by 30 minutes
//                 currentDate.setMinutes(currentDate.getMinutes() + 30);
//             }

//             setDocSlots(prev => ([...prev, timeSlots]))
//         }
//     }

//     const bookAppointment = async () => {
//         if (!token) {
//             toast.warning('Login to book appointment')
//             return navigate('/login')
//         }

//         const date = docSlots[slotIndex][0].datetime

//         let day = date.getDate()
//         let month = date.getMonth() + 1
//         let year = date.getFullYear()

//         const slotDate = day + "_" + month + "_" + year

//         try {
//             const { data } = await axios.post(
//                 backendUrl + '/api/user/book-appointment', 
//                 { docId, slotDate, slotTime }, 
//                 { headers: { token } }
//             )
            
//             if (data.success) {
//                 toast.success(data.message)
//                 // 6. Refresh global doctor data via Redux to update available slots
//                 dispatch(fetchDoctorList()) 
//                 navigate('/my-appointments')
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     }

//     useEffect(() => {
//         // Only fetch doc info if doctors list is populated
//         if (doctors.length > 0) {
//             fetchDocInfo()
//         }
//     }, [doctors, docId])

//     useEffect(() => {
//         if (docInfo) {
//             getAvailableSolts()
//         }
//     }, [docInfo])

//     return docInfo ? (
//         <div>
//             {/* ---------- Doctor Details ----------- */}
//             <div className='flex flex-col sm:flex-row gap-4'>
//                 <div>
//                     <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
//                 </div>

//                 <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
//                     {/* ----- Doc Info : name, degree, experience ----- */}
//                     <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{docInfo.name} 
//                         {/* <img className='w-5' src={assets.verified_icon} alt="" /> */}
//                     </p>
//                     <div className='flex items-center gap-2 mt-1 text-gray-600'>
//                         <p>{docInfo.degree} - {docInfo.speciality}</p>
//                         <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience} Years</button>
//                     </div>

//                     {/* ----- Doc About ----- */}
//                     <div>
//                         <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About 
//                            {/* <img className='w-3' src={assets.info_icon} alt="" /> */}
//                         </p>
//                         <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{docInfo.about}</p>
//                     </div>

//                     <p className='text-gray-600 font-medium mt-4'>Appointment fee: <span className='text-gray-800'>{currencySymbol}{docInfo.fees}</span> </p>
//                 </div>
//             </div>

//             {/* Booking slots */}
//             <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]'>
//                 <p >Booking slots</p>
//                 <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
//                     {docSlots.length && docSlots.map((item, index) => (
//                         <div onClick={() => setSlotIndex(index)} key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-[#DDDDDD]'}`}>
//                             <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
//                             <p>{item[0] && item[0].datetime.getDate()}</p>
//                         </div>
//                     ))}
//                 </div>

//                 <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
//                     {docSlots.length && docSlots[slotIndex].map((item, index) => (
//                         <p onClick={() => setSlotTime(item.time)} key={index} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-[#949494] border border-[#B4B4B4]'}`}>{item.time.toLowerCase()}</p>
//                     ))}
//                 </div>

//                 <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6'>Book an appointment</button>
//             </div>

//             {/* Listing Related Doctors */}
//             {/* <RelatedDoctors speciality={docInfo.speciality} docId={docId} /> */}
//         </div>
//     ) : null
// }

// export default Appointment
=======
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
>>>>>>> 9230d90d112e286ef899c28b668eff58b767a380
