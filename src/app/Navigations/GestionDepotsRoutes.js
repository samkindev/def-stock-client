import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { styled } from '@mui/system';
import DepotsModuleHome from '../../modules/Depots/index.js';
import DepotsNavbar from './NavBars/DepotNavbar.js';
import SingleDepot from '../../modules/Depots/components/SingleDepot.js';
import EntreeStock from '../../modules/Depots/components/EntreeStock.js';
import InstockProduct from '../../modules/Depots/components/InstockProduct.js';
import EntreeForm from '../../modules/Depots/components/EntreeForm.js';
import { getProducts } from '../reducers/myProduct';
import SortieStock from '../../modules/Depots/components/SortieStock.js';
import SortieForm from '../../modules/Depots/components/SortieForm.js';

const StyledContainer = styled('div')(() => ({
    width: '100%',
    "& .main": {
        marginTop: 65
    }
}));

export default function GestionDepotsRoutes() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getProducts());
    }, []);
    return (
        <StyledContainer>
            <DepotsNavbar />
            <div className='main'>
                <Routes>
                    <Route
                        path=""
                        element={<DepotsModuleHome />}
                    />
                    <Route path=':id/*' element={<SingleDepot />} >
                        <Route path="produits" element={<InstockProduct />} />
                        <Route path="entrees/*" element={<EntreeStockRoutes />} />
                        <Route path="sorties/*" element={<SortieStockRoutes />} />
                    </Route>
                </Routes>
            </div>
        </StyledContainer>
    )
}


const EntreeStockRoutes = () => {
    const location = useLocation();
    const state = location.state;
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }
    return (
        <div>
            <Routes location={state ? state.backgroundLocation : location.pathname}>
                <Route path="" element={<EntreeStock />} />
            </Routes>
            {state && state.backgroundLocation && (
                <Routes>
                    <Route path="nouveau" element={<EntreeForm open={true} onClose={goBack} />} />
                </Routes>
            )}
        </div>
    )
}

const SortieStockRoutes = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }
    return (
        <div>
            <Routes>
                <Route path="" element={<SortieStock />} />
                <Route path="nouveau" element={<SortieForm onClose={goBack} />} />
            </Routes>
        </div>
    )
}