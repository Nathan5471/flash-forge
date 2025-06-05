import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../utils/AuthAPIHandler'

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        try {
            await login({ email, password })
        } catch (error) {
            console.error('Login error:', error)
            setError('Login failed. Please check your credentials.')
            return
        } finally {
            setEmail('')
            setPassword('')
        }
        navigate('/')
    }
    return (
        <div className="flex items-center justify-center w-screen h-screen bg-gray-700">
            <div className="bg-gray-600 p-6 rounded-lg text-white">
                <h1 className="text-2xl mb-4">Login</h1>
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
                        Login
                    </button>
                </form>
                <p className="mt-4 text-sm">
                    Don't have an account? <a href="/register" className="text-blue-400 hover:underline">Register</a>
                </p>
            </div>
        </div>
    )
}