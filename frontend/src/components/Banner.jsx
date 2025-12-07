import React from 'react'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate = useNavigate()

  return (
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl shadow-xl mb-8">
            <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    {/* Left Side - Text Content */}
                    <div className="flex-1 text-center lg:text-left z-10">
                        <div className="mb-4">
                            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                🍕 Fresh & Delicious
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight">
                            Every Slice Tells a
                            <span className="text-primary block">Delicious Story</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                            Experience the perfect blend of fresh ingredients, authentic flavors, 
                            and pure joy in every bite. Order now and taste the difference!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button
                                onClick={() => navigate('/menu')}
                                className="bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg text-lg"
                            >
                                Order Now 🍕
                            </button>
                            <button
                                onClick={() => navigate('/menu')}
                                className="border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold hover:bg-primary/10 transition-all transform hover:scale-105 text-lg"
                            >
                                Explore Menu
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="flex-1 relative z-10">
                        <div className="relative">
                            {/* Main Image */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                                <img
                                    src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=800&fit=crop&q=80"
                                    alt="Girl enjoying delicious pizza"
                                    className="w-full h-auto object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop'
                                    }}
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            
                            {/* Floating Pizza Icon */}
                            <div className="absolute -top-6 -right-6 bg-white rounded-full p-4 shadow-2xl animate-bounce hidden lg:block">
                                <span className="text-4xl">🍕</span>
                            </div>
                            
                            {/* Floating Rating Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-2xl hidden lg:block">
                                <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-400">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">4.9 Rating</p>
                                        <p className="text-sm text-gray-600">2k+ Reviews</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-300/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
  )
}

export default Banner
