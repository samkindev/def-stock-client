import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { styled } from '@mui/system';
import ConfigNavBar from './NavBars/ConfigNavBar';
import ConfigHome from '../../modules/Configurations/ConfigHome';
import DepotConfigRoutes from './DepotConfigRoutes';
import ProduitConfigRoutes from './ProduitConfigRouts';
import PartenaireRoutes from './PartenaireRoutes';

const StyledContainer = styled('div')(() => ({
    width: '100%',
    "& .main": {
        marginTop: 65
    }
}));

export default function ConfigRoutes() {

    return (
        <StyledContainer>
            <ConfigNavBar />
            <div className="main">
                <Routes>
                    <Route
                        path="depots/*"
                        element={<DepotConfigRoutes />}
                    />
                    <Route
                        path="produits/*"
                        element={<ProduitConfigRoutes />}
                    />
                    <Route
                        path="partenaires/*"
                        element={<PartenaireRoutes />}
                    />
                    <Route
                        path=""
                        element={<ConfigHome />}
                    />
                </Routes>

            </div>
        </StyledContainer>
    )
}
