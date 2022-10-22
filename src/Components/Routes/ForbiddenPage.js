import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAuthState } from '../../app/reducers/auth';

// This component protects the given path to be accessed
// According to a certain reason.
function ForbiddenPage({ path, element, redirectPath = "/", ...other }) {
    const isAuth = useSelector(getAuthState);
    if (isAuth) {
        return (
            <Navigate to={redirectPath} replace />
        );
    }

    return element;
}

export default ForbiddenPage;
