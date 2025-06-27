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
            setError(error.message || 'Login failed. Please try again.')
            return
        } finally {
            setEmail('')
            setPassword('')
        }
        navigate('/')
    }
    return (
        <div className="flex items-center justify-center w-screen h-screen bg-[#251d24] text-white">
            <div className="bg-[#282828] p-6 rounded-lg w-[calc(80%)] sm:w-[calc(65%)] md:w-1/2 lg:w-[calc(30%)]">
                <h1 className="text-4xl text-[#f081e7] font-bold text-center mb-4">Login</h1>
                <form>
                    <div className="mb-2">
                        <label className="text-xl block mb-1" htmlFor="username">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 rounded bg-[#3f3f3f]"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-xl block mb-1" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded bg-[#3f3f3f]"
                            placeholder="Enter your password"
                        />
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-[#f081e7] hover:bg-[#f390ea] p-2 rounded"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-pretty">
                    Don't have an account? <a href="/register" className="text-[#f081e7] hover:underline">Register</a>
                </p>
            </div>
        </div>
    )
}