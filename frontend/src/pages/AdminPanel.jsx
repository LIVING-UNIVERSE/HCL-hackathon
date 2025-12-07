import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

// Same menu items data as used in Menu section
const defaultMenuItems = [
    // Pizza Category
    {
        _id: 'p1',
        item_name: 'Margherita Pizza',
        category: 'Pizza',
        price: 299,
        inventory_count: 50,
        description: 'Classic Italian pizza with fresh mozzarella, tomato sauce, and basil leaves',
        image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop'
    },
    {
        _id: 'p2',
        item_name: 'Pepperoni Pizza',
        category: 'Pizza',
        price: 349,
        inventory_count: 45,
        description: 'Loaded with spicy pepperoni, mozzarella cheese, and signature pizza sauce',
        image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop'
    },
    {
        _id: 'p3',
        item_name: 'Veggie Supreme Pizza',
        category: 'Pizza',
        price: 379,
        inventory_count: 40,
        description: 'A medley of fresh vegetables including bell peppers, onions, mushrooms, and olives',
        image_url: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=400&fit=crop'
    },
    {
        _id: 'p4',
        item_name: 'BBQ Chicken Pizza',
        category: 'Pizza',
        price: 399,
        inventory_count: 35,
        description: 'Tender grilled chicken with tangy BBQ sauce, red onions, and mozzarella',
        image_url: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=400&h=400&fit=crop'
    },
    {
        _id: 'p5',
        item_name: 'Cheese Burst Pizza',
        category: 'Pizza',
        price: 429,
        inventory_count: 30,
        description: 'Extra cheesy pizza with a layer of cheese in the crust and on top',
        image_url: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=400&fit=crop'
    },
    {
        _id: 'p6',
        item_name: 'Farmhouse Pizza',
        category: 'Pizza',
        price: 359,
        inventory_count: 38,
        description: 'Fresh mushrooms, sweet corn, tomatoes, and capsicum on a cheesy base',
        image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop'
    },

    // Beverages Category
    {
        _id: 'b1',
        item_name: 'Coca Cola',
        category: 'Beverages',
        price: 60,
        inventory_count: 100,
        description: 'Classic carbonated soft drink',
        image_url: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=400&fit=crop'
    },
    {
        _id: 'b2',
        item_name: 'Chocolate Milkshake',
        category: 'Beverages',
        price: 149,
        inventory_count: 50,
        description: 'Rich and creamy chocolate milkshake topped with whipped cream',
        image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop'
    },
    {
        _id: 'b3',
        item_name: 'Mango Smoothie',
        category: 'Beverages',
        price: 129,
        inventory_count: 45,
        description: 'Refreshing mango smoothie with fresh mango chunks',
        image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop'
    },
    {
        _id: 'b4',
        item_name: 'Strawberry Shake',
        category: 'Beverages',
        price: 149,
        inventory_count: 40,
        description: 'Creamy strawberry milkshake with fresh strawberries',
        image_url: 'https://images.unsplash.com/photo-1534945773097-0592456c8b05?w=400&h=400&fit=crop'
    },
    {
        _id: 'b5',
        item_name: 'Iced Tea',
        category: 'Beverages',
        price: 79,
        inventory_count: 60,
        description: 'Refreshing iced tea with lemon and mint',
        image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop'
    },
    {
        _id: 'b6',
        item_name: 'Fresh Lime Soda',
        category: 'Beverages',
        price: 69,
        inventory_count: 55,
        description: 'Zesty lime soda with a dash of salt and mint',
        image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop'
    },

    // Breads Category
    {
        _id: 'br1',
        item_name: 'Garlic Bread',
        category: 'Breads',
        price: 129,
        inventory_count: 50,
        description: 'Crispy bread brushed with garlic butter and herbs',
        image_url: 'https://images.unsplash.com/photo-1571067921383-90d0c3efdb29?w=400&h=400&fit=crop'
    },
    {
        _id: 'br2',
        item_name: 'Cheese Garlic Bread',
        category: 'Breads',
        price: 159,
        inventory_count: 45,
        description: 'Garlic bread topped with melted mozzarella cheese',
        image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop'
    },
    {
        _id: 'br3',
        item_name: 'Butter Naan',
        category: 'Breads',
        price: 49,
        inventory_count: 80,
        description: 'Soft and fluffy Indian bread brushed with butter',
        image_url: 'https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=400&h=400&fit=crop'
    },
    {
        _id: 'br4',
        item_name: 'Cheese Naan',
        category: 'Breads',
        price: 79,
        inventory_count: 60,
        description: 'Traditional naan stuffed with melted cheese',
        image_url: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400&h=400&fit=crop'
    },
    {
        _id: 'br5',
        item_name: 'Garlic Naan',
        category: 'Breads',
        price: 69,
        inventory_count: 65,
        description: 'Soft naan bread flavored with garlic and cilantro',
        image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop'
    },
    {
        _id: 'br6',
        item_name: 'Pizza Bread Sticks',
        category: 'Breads',
        price: 179,
        inventory_count: 35,
        description: 'Crispy bread sticks topped with pizza sauce, cheese, and herbs',
        image_url: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400&h=400&fit=crop'
    }
]

const AdminPanel = () => {
    const navigate = useNavigate()
    const { isAdmin, userData } = useContext(AppContext)
    
    const [items, setItems] = useState([])
    const [editingStock, setEditingStock] = useState(null)
    const [stockValue, setStockValue] = useState('')
    const [filterCategory, setFilterCategory] = useState('all')

    useEffect(() => {
        // Check if user is admin (optional check, can be removed if you want it accessible to all)
        if (userData && userData.role !== 'admin' && isAdmin === false) {
            // Still allow access but could add restriction here if needed
        }
        
        // Initialize with default menu items
        setItems(defaultMenuItems)
    }, [isAdmin, userData])

    const handleInventoryUpdate = (itemId, newInventoryCount) => {
        if (!stockValue || isNaN(stockValue) || stockValue < 0) {
            toast.error('Please enter a valid quantity')
            return
        }

        const updatedCount = parseInt(stockValue)
        
        // Update inventory locally
        setItems(items.map(item => 
            item._id === itemId 
                ? { ...item, inventory_count: updatedCount }
                : item
        ))
        
        toast.success('Inventory updated successfully!')
        setEditingStock(null)
        setStockValue('')
    }

    const startEditingStock = (item) => {
        setEditingStock(item._id)
        setStockValue(item.inventory_count.toString())
    }

    const cancelEditing = () => {
        setEditingStock(null)
        setStockValue('')
    }

    const getCategories = () => {
        const categories = new Set(items.map(item => item.category))
        return Array.from(categories)
    }

    const filteredItems = filterCategory === 'all' 
        ? items 
        : items.filter(item => item.category === filterCategory)

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
                    <p className="text-gray-600">Manage inventory and items (Temporary - Using Default Data)</p>
                </div>

                {/* Category Filter */}
                <div className="mb-6 flex flex-wrap gap-4">
                    <button
                        onClick={() => setFilterCategory('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filterCategory === 'all'
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        All Categories
                    </button>
                    {getCategories().map((category) => (
                        <button
                            key={category}
                            onClick={() => setFilterCategory(category)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filterCategory === category
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Items Table */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Item
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Inventory Count
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            No items found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        {item.image_url ? (
                                                            <img
                                                                src={item.image_url}
                                                                alt={item.item_name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/100?text=No+Image'
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                                No Image
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.item_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 line-clamp-1">
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ₹{item.price}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingStock === item._id ? (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={stockValue}
                                                            onChange={(e) => setStockValue(e.target.value)}
                                                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                                            min="0"
                                                        />
                                                        <button
                                                            onClick={() => handleInventoryUpdate(item._id, item.inventory_count)}
                                                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                                                        >
                                                            ✓
                                                        </button>
                                                        <button
                                                            onClick={cancelEditing}
                                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-sm font-medium ${
                                                            item.inventory_count === 0
                                                                ? 'text-red-600'
                                                                : item.inventory_count < 10
                                                                ? 'text-yellow-600'
                                                                : 'text-green-600'
                                                        }`}>
                                                            {item.inventory_count}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    item.inventory_count > 0
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {item.inventory_count > 0 ? 'Available' : 'Out of Stock'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => startEditingStock(item)}
                                                    className="text-primary hover:text-primary/80 transition-colors"
                                                >
                                                    Update Inventory
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Items</p>
                                <p className="text-2xl font-bold text-gray-800">{items.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">📦</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {items.filter(item => item.inventory_count > 0 && item.inventory_count < 10).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">⚠️</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {items.filter(item => item.inventory_count === 0).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🚫</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminPanel
