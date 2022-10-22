import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
// import StockNavigation from '../../modules/Stock/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectAll as selectAllDepots } from '../reducers/depot';
import MainSplash from '../../Splash';
import { styled } from '@mui/system';
import ConfigRoutes from './ConfigRoutes';
import GestionDepotsRoutes from './GestionDepotsRoutes';
import { getDepots, getReqStatus } from '../reducers/depot';
import { Chargement } from '../../Components';
import FacturationRoutes from './FacturationRoutes';
const StyledContainer = styled('div')(() => ({
    width: '100%'
}));

export default function MainRoutes() {
    const depots = useSelector(selectAllDepots);
    const loading = useSelector(getReqStatus) === 'loading';
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getDepots());
    }, [dispatch]);
    return (
        <StyledContainer>
            {loading ?
                <Chargement sx={{ minHeight: "calc(100vh - 56px)" }} /> :
                depots.length === 0 ?
                    <MainSplash /> :
                    <Routes>
                        <Route
                            path="/"
                            element={<ConfigRoutes />}
                        />
                        <Route
                            path="configurations/*"
                            element={<ConfigRoutes />}
                        />
                        <Route
                            path="depots/*"
                            element={<GestionDepotsRoutes />}
                        />
                        <Route
                            path="facturation/*"
                            element={<FacturationRoutes />}
                        />
                    </Routes>
            }
        </StyledContainer>
    )
}
