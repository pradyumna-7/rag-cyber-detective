import React, { useState } from 'react'
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: '',
        password: '',
        phone: '',
        otp: '',
        flag: false
    })

    const loginUser = async (e) => {
        e.preventDefault()
        const { email, password } = data
        try {
            const { data: responseData } = await axios.post('/login', {
                email,
                password
            })
            if (responseData.error) {
                toast.error(responseData.error)
            } else {
                setData({})
                toast.success('Logged in successfully!')
                navigate('/home')
            }
        } catch (error) {
            console.log(error)
            toast.error('An error occurred. Please try again.')
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
                <div className="md:w-2/3 p-8">
                    <form onSubmit={loginUser} className="space-y-4">
                        <h1 className="text-3xl font-bold text-white mb-6">Login to Your Account</h1>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            value={data.email}
                            required
                            className="w-full px-4 py-2 bg-gray-800 bg-opacity-20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 ease-in-out"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            required
                            className="w-full px-4 py-2 bg-gray-800 bg-opacity-20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 ease-in-out"
                        />
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 ease-in-out transform hover:-translate-y-1"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
                <div className="md:w-1/3 bg-blue-600 bg-opacity-70 backdrop-filter backdrop-blur-lg flex flex-col items-center justify-center p-8 text-white">
                    <h1 className="text-3xl font-bold text-center mb-6">New Here?</h1>
                    <Link to="/">
                        <button className="px-6 py-2 bg-white text-blue-600 rounded-md hover:bg-opacity-90 transition duration-300 ease-in-out transform hover:-translate-y-1">
                            Register
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}