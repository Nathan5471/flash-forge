import { Navigate, Outlet } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getUser } from './AuthAPIHandler';

const AuthenticatedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                await getUser();
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Authentication check failed:', error);
                setIsAuthenticated(false);
            }
        }
        checkAuthentication();
    }, [isAuthenticated]);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default AuthenticatedRoute;