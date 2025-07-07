import React, { useEffect, useState } from 'react';
import { getUser } from '../utils/AuthAPIHandler';
import { useOverlayContext } from "../contexts/OverlayContext";
import { useNavigate } from "react-router-dom";

export default function MobileMenu({ isOffline = false }) {
    const navigate = useNavigate();
    const { closeOverlay } = useOverlayContext();
    const [buttons, setButtons] = useState([]);

    useEffect(() => {
        const handleSetButtons = async () => {
            console.log(isOffline);
            if (isOffline) {
                setButtons([
                    { label: 'Create', path: '/downloads/create' },
                    { label: 'Go Online', path: '/' }
                ])
                return;
            }
            try {
                await getUser();
                setButtons([
                    { label: 'Create', path: '/create' },
                    { label: 'Downloads', path: '/downloads' },
                    { label: 'My Sets', path: '/sets' },
                    { label: 'Settings', path: '/settings' }
                ])
            } catch (error) {
                console.error('Error fetchign user data:', error);
                setButtons([
                    { label: 'Login', path: '/login' },
                    { label: 'Register', path: '/register' },
                ])
            }
        }
        handleSetButtons();
    }, [isOffline])

    const handleNavigate = (e, path) => {
        e.preventDefault();
        closeOverlay();
        navigate(path);
    }

    const handleClose = (e) => {
        e.preventDefault();
        closeOverlay();
    }

    return (
        <div className="flex flex-col items-center justify-center w-80 p-4">
            {buttons.map((button, index) => (
                <button
                    key={index}
                    className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg w-full mb-2"
                    onClick={(e) => handleNavigate(e, button.path)}
                >{button.label}</button>
            ))}
            <button
                className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg w-full"
                onClick={handleClose}
            >Close</button>
        </div>
    )
}