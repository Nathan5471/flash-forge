import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../utils/AuthAPIHandler'

export default function Register() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        try {
            await register({ email, username, password })
        } catch (error) {
            setError(error.message || 'Login failed. Please try again.')
            return
        } finally {
            setEmail('')
            setUsername('')
            setPassword('')
        }
        navigate('/login')
    }

    return (
        <div className="flex items-center justify-center w-screen h-screen bg-gray-700">
            <div className="bg-gray-600 p-6 rounded-lg text-white w-[calc(30%)]">
                <h1 className="text-2xl mb-4">Register</h1>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <form>
                    <div className="mb-2">
                        <label className="block mb-1" htmlFor="username">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 rounded bg-gray-500 text-white"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block mb-1" htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 rounded bg-gray-500 text-white"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block mb-1" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded bg-gray-500 text-white"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-sm">
                    Already have an account? <a href="/login" className="text-blue-400 hover:underline">Login</a>
                </p>
            </div>
        </div>
    )
}