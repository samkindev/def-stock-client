import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import Facturation from '../../modules/Facturation';
import FacturationNavBar from './NavBars/FacturationNavBar';
import SelectProduits from '../../modules/Facturation/components/SelectProduits';

const StyledContainer = styled('div')(() => ({
    width: '100%',
    "& .main": {
        marginTop: 75,
    }
}));

export default function FacturationRoutes() {
    let location = useLocation();
    let state = location.state;
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    useEffect(() => {
    }, []);

    return (
        <StyledContainer>
            <FacturationNavBar />
            <div className="main">
                <Routes location={state ? state.backgroundLocation : location.pathname}>
                    <Route
                        path=""
                        element={<Facturation />}
                    />
                </Routes>
                {state && state.backgroundLocation && (
                    <Routes>
                        <Route path="produits" element={<SelectProduits open={true} onClose={goBack} />} />
                        <Route path="produits/modifier/:rowId" element={<SelectProduits open={true} onClose={goBack} />} />
                    </Routes>
                )}
            </div>
        </StyledContainer>
    )
}
