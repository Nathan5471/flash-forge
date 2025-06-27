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
        <div className="flex items-center justify-center w-screen h-screen bg-[#251d24] text-white">
            <div className="bg-[#282828] p-6 rounded-lg w-[calc(80%)] sm:w-[calc(65%)] md:w-1/2 lg:w-[calc(30%)]">
                <h1 className="text-4xl text-[#f081e7] font-bold text-center mb-4">Register</h1>
                <form>
                    <div className="mb-2">
                        <label className="text-xl block mb-1" htmlFor="username">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 rounded bg-[#3f3f3f] text-white"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="text-xl block mb-1" htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 rounded bg-[#3f3f3f] text-white"
                            placeholder="Enter your username"
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
                            className="w-full p-2 rounded bg-[#3f3f3f] text-white"
                            placeholder="Enter your password"
                        />
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-[#f081e7] hover:bg-[#f390ea] text-white p-2 rounded"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-pretty">
                    Already have an account? <a href="/login" className="text-[#f081e7] hover:underline">Login</a>
                </p>
            </div>
        </div>
    )
}