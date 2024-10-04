import React, { useState } from 'react'
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'
import { FaInfoCircle } from 'react-icons/fa'

export default function Register() {
    const navigate = useNavigate()
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    })
    const [error, setError] = useState('')

    const CustomToast = ({ message }) => (
        <div className="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3 rounded shadow-md">
            <FaInfoCircle className="mr-2" />
            <span>{message}</span>
        </div>
    )

    const registerUser = async (e) => {
        e.preventDefault()
        setError('')
        const { email, name, password, phone } = data
        try {
            const response = await axios.post('/register', {
                name, email, password, phone
            })
            if (response.data.error) {
                setError(response.data.error)
            } else {
                setData({})
                toast.loading('Sending Verification Email...', {
                    duration: 1000
                })
                setTimeout(() => {
                    toast((t) => (
                        <CustomToast message="Verification Email Sent! Please Verify." />
                    ), {
                        duration: 4000,
                    })
                }, 1900)
                // Optionally navigate to login page after successful registration
                // setTimeout(() => navigate('/login'), 6000)
            }
        } catch (error) {
            console.error('Registration error:', error)
            setError('An unexpected error occurred. Please try again.')
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg max-w-4xl w-full mx-4 my-8 flex flex-col md:flex-row overflow-hidden">
                <div className="md:w-1/3 bg-blue-600 bg-opacity-70 backdrop-filter backdrop-blur-lg flex flex-col items-center justify-center p-8 text-white">
                    <h1 className="text-3xl font-bold text-center mb-6">Already Registered?</h1>
                    <Link to="/login">
                        <button className="px-6 py-2 bg-white text-blue-600 rounded-md hover:bg-opacity-90 transition duration-300 ease-in-out transform hover:-translate-y-1">
                            Sign In
                        </button>
                    </Link>
                </div>
                <div className="md:w-2/3 p-8">
                    <form onSubmit={registerUser} className="space-y-4">
                        <h1 className="text-3xl font-bold text-white mb-6">Create Account</h1>
                        {error && <div className="bg-red-500 text-white p-3 rounded">{error}</div>}
                        <input
                            type="text"
                            placeholder="Name"
                            name="name"
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            value={data.name}
                            required
                            className="w-full px-4 py-2 bg-gray-800 bg-opacity-20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-opacity-100"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            value={data.email}
                            required
                            className="w-full px-4 py-2 bg-gray-800 bg-opacity-20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-opacity-100"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            value={data.password}
                            required
                            className="w-full px-4 py-2 bg-gray-800 bg-opacity-20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-opacity-100"
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            name="phone"
                            onChange={(e) => setData({ ...data, phone: e.target.value })}
                            value={data.phone}
                            className="w-full px-4 py-2 bg-gray-800 bg-opacity-20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-opacity-100"
                        />
                        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 ease-in-out transform hover:-translate-y-1">
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}