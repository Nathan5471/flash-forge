import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUser } from '../utils/AuthAPIHandler';
import { useOverlayContext } from '../contexts/OverlayContext';
import Navbar from '../components/Navbar';
import EditUsername from '../components/EditUsername';
import EditEmail from '../components/EditEmail';
import EditPassword from '../components/EditPassword';
import DeleteAccount from '../components/DeleteAccount';

export default function Settings() {
    const { openOverlay } = useOverlayContext();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refetch, setRefetch] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser();
                setUser(userData.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [refetch]);

    const handleEditUsername = (e) => {
        e.preventDefault();
        openOverlay(<EditUsername setRefetch={setRefetch}/>);
    }

    const handleEditEmail = (e) => {
        e.preventDefault();
        openOverlay(<EditEmail setRefetch={setRefetch}/>);
    }

    const handleEditPassword = (e) => {
        e.preventDefault();
        openOverlay(<EditPassword setRefetch={setRefetch}/>);
    }

    const handleDeleteAccount = (e) => {
        e.preventDefault();
        openOverlay(<DeleteAccount />);
    }

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col h-screen w-screen bg-gray-800 text-white">
                <Navbar />
                <h1 className="text-4xl text-center mt-20">Loading...</h1>
            </div>
        )
    }
    return (
        <div className="flex flex-col h-screen w-screen bg-gray-800 text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-4xl mb-4">Settings</h1>
                <div className="bg-gray-700 p-6 rounded-lg w-1/3">
                    <h2 className="text-3xl mb-4 text-center">Account Settings</h2>
                    <div className="flex flex-row mb-2">
                        <p className="text-xl">Username ({user.username})</p>
                        <button className="ml-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg" onClick={handleEditUsername}>Edit</button>
                    </div>
                    <div className="flex flex-row mb-2">
                        <p className="text-xl">Email ({user.email})</p>
                        <button className="ml-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg" onClick={handleEditEmail}>Edit</button>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 w-full text-white rounded-lg py-2 mb-2" onClick={handleEditPassword}>Change Password</button>
                    <button className="bg-blue-500 hover:bg-blue-600 w-full text-white rounded-lg py-2 mb-2" onClick={handleLogout}>Logout</button>
                    <button className="bg-red-500 hover:bg-red-600 w-full text-white rounded-lg py-2" onClick={handleDeleteAccount}>Delete Account</button>
                </div>
            </div>
        </div>
    )
}