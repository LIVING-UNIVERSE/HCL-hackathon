import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Profile = () => {
    const navigate = useNavigate()
    const { backendUrl, token, userData: contextUserData, setUserData: setContextUserData } = useContext(AppContext)
    const [editMode, setEditMode] = useState(false)
    
    // Use dummy data if user data is missing phone or address
    const userData = contextUserData ? {
        ...contextUserData,
        phone: contextUserData.phone || '+91 9876543210',
        address: contextUserData.address || {
            line1: '123 Main Street',
            line2: 'Apartment 4B'
        }
    } : null
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: ''
    })

    // Initialize form data when userData is available
    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '+91 9876543210',
                addressLine1: userData.address?.line1 || '123 Main Street',
                addressLine2: userData.address?.line2 || 'Apartment 4B'
            })
        }
    }, [userData])

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!token) {
            toast.warning('Please login to view your profile')
            navigate('/login')
        }
    }, [token, navigate])

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/user/profile`,
                { headers: { token } }
            )

            if (data.success && data.userData) {
                setContextUserData(data.userData)
            } else {
                toast.error(data.message || 'Failed to load profile')
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
            toast.error('Failed to load profile. Please try again.')
        }
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSave = async () => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/user/profile`,
                {
                    name: formData.name,
                    phone: formData.phone,
                    addressLine1: formData.addressLine1,
                    addressLine2: formData.addressLine2
                },
                { headers: { token } }
            )

            if (data.success) {
                toast.success('Profile updated successfully!')
                setContextUserData(data.userData)
                setEditMode(false)
                // Refresh profile data
                await fetchProfile()
            } else {
                toast.error(data.message || 'Failed to update profile')
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile. Please try again.')
        }
    }

    // Show loading if userData is not available yet
    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                        {!editMode ? (
                            <button
                                onClick={() => setEditMode(true)}
                                className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditMode(false)
                                        // Reset form data to current user data
                                        setFormData({
                                            name: userData.name || '',
                                            email: userData.email || '',
                                            phone: userData.phone || '+91 9876543210',
                                            addressLine1: userData.address?.line1 || '123 Main Street',
                                            addressLine2: userData.address?.line2 || 'Apartment 4B'
                                        })
                                    }}
                                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Profile Picture */}
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                {userData?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {userData?.name || 'User'}
                                </h2>
                                <p className="text-gray-600">{userData?.email || ''}</p>
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                            ) : (
                                <p className="text-gray-800">{userData?.name || 'Not set'}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <p className="text-gray-800">{userData?.email || 'Not set'}</p>
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            {editMode ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="Enter phone number"
                                />
                            ) : (
                                <p className="text-gray-800">{userData?.phone || 'Not set'}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            {editMode ? (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        name="addressLine1"
                                        value={formData.addressLine1}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                                        placeholder="Address Line 1"
                                    />
                                    <input
                                        type="text"
                                        name="addressLine2"
                                        value={formData.addressLine2}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                                        placeholder="Address Line 2 (Optional)"
                                    />
                                </div>
                            ) : (
                                <div className="text-gray-800">
                                    {userData?.address?.line1 ? (
                                        <div>
                                            <p>{userData.address.line1}</p>
                                            {userData.address.line2 && <p>{userData.address.line2}</p>}
                                        </div>
                                    ) : (
                                        <p>Not set</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile

