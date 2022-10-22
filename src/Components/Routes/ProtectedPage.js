import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAuthState } from '../../app/reducers/auth';

// This component protects the given path to be accessed by an unauthenticated user
// After authentication verification
// If not authenticated return the login page
// Otherwise return  the page on the given path
export default function ProtectedPage({ path, element, ...other }) {
    const isAuth = useSelector(getAuthState);
    if (!isAuth) {
        return (
            <Navigate to="/login" />
        );
    }

    return element;
}
