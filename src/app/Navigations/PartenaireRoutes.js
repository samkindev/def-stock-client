import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { styled } from '@mui/system';
import PartenaireAside from '../../modules/Configurations/Partenaire/component/Aside';
import PartenaireConfiguration from '../../modules/Configurations/Partenaire/PartenaireConfiguration';
import Fournisseurs from '../../modules/Configurations/Partenaire/component/Fournisseurs';
import FournisseurForm from '../../modules/Configurations/Partenaire/component/FournisseurForm';
import Clients from '../../modules/Configurations/Partenaire/component/Clients';
import ClientForm from '../../modules/Configurations/Partenaire/component/ClientForm';

const StyledContainer = styled('div')(() => ({
    width: '100%',
    "& .main": {
        marginLeft: 280,
    }
}));

export default function PartenaireRoutes() {

    return (
        <StyledContainer>
            <PartenaireAside />
            <div className="main">
                <Routes>
                    <Route
                        path=""
                        element={<PartenaireConfiguration />}
                    />
                    <Route
                        path="fournisseurs"
                        element={<Fournisseurs />}
                    />
                    <Route
                        path="fournisseurs/nouveau"
                        element={<FournisseurForm />}
                    />
                    <Route
                        path='clients'
                        element={<Clients />}
                    />
                    <Route
                        path='clients/nouveau'
                        element={<ClientForm />}
                    />
                </Routes>
            </div>
        </StyledContainer>
    )
}
