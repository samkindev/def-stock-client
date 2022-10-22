import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ConfigLeftAside from '../../modules/Configurations/Depots/components/ConfigAside';
import DepotsConfigurations from '../../modules/Configurations/Depots/DepotsConfigurations';
import SingleDepotConfig from '../../modules/Configurations/Depots/components/SingleDepotConfig';
import { styled } from '@mui/system';

const StyledContainer = styled('div')(() => ({
    width: '100%',
    "& .main": {
        marginLeft: 280,
    }
}));

export default function DepotConfigRoutes() {

    return (
        <StyledContainer>
            <ConfigLeftAside />
            <div className="main">
                <Routes>
                    <Route
                        path=":id"
                        element={<SingleDepotConfig />}
                    />
                    <Route
                        path=""
                        element={<DepotsConfigurations />}
                    />
                </Routes>

            </div>
        </StyledContainer>
    )
}
