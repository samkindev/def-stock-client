import { styled } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectAll as getAllDepots, getDepots, getReqStatus, creerDepot } from '../../../app/reducers/depot';
import { Chargement } from '../../../Components';
import { Box, Button, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import mvtStcok from '../../../assets/mvtstock.jpg'
import ConfigurationView from '../components/ConfigurationsView';

const StyledContainer = styled('div')(() => ({
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 53,
    overflow: 'hidden',
    backgroundColor: '#91d1ff1c',
    "& h1": {
        fontSize: 35,
        marginBottom: '30px!important',
        textAlign: 'center'
    }
}));

const StyledContentContainer = styled('div')(({ theme }) => ({
    padding: '85px 20px',
    height: 'fit-content',
    maxWidth: 850,
    "& p": {
        textAlign: 'center'
    },
    "& .primary-color": {
        color: theme.palette.primary.main,
        cursor: 'pointer'
    },
    "& .primary-color:hover": {
        textDecoration: 'underline'
    },
}));

const StyledBottomBanner = styled('div')(() => ({
    flex: 1,
    padding: 20,
    marginTop: 20,
    "& .illustration": {
        width: 815,
        height: 370,
        boxShadow: '0px 0px 20px 8px #c2e6fdb3',
        borderRadius: 8,
        overflow: 'hidden',
        "& img": {
            width: '100%',
            height: '100%'
        }
    }
}))

export default function SplashPage({ onConfigOk, goToConfig }) {
    const [openConfigView, setOpenConfigView] = useState(false);
    const loading = useSelector(getReqStatus) === 'loading';
    const magasins = useSelector(getAllDepots);
    const canGo = magasins.length > 0;
    const navigate = useNavigate();

    const defaultConfigs = {
        organisation: 'desactivée',
        subdivision: 'aucune',
        referenceEmplacements: 'non défini',
        referenceProduits: 'sku',
        reaprovisionnement: 'méthode du point de commande',
        valorisation: 'Premier entré - premier sorti (PEPS ou FIFO) sans contrainte d\'expiration',
    };

    const toggleConfigView = () => {
        setOpenConfigView(!openConfigView);
    }

    const handleDefaultConfig = () => {
        toggleConfigView();
    };

    const dispatch = useDispatch();

    const handleConfirmation = () => {
        dispatch(creerDepot({
            ...defaultConfigs,
            nom: 'Magasin Principal',
            code: 'M001',
            description: "Magasin principal de l'entreprise",
            valorisation: 'fifo'
        }));
    }
    useEffect(() => {
        if (magasins.length === 0) {
            dispatch(getDepots());
        } else {
            onConfigOk();
        }
    }, [magasins]);
    return (
        <StyledContainer>
            {loading ? (
                <Chargement
                    message="Chargement..."
                    sx={{
                        minHeight: "100vh",
                    }}
                />
            ) :
                <StyledContentContainer>
                    {!canGo ?
                        <>
                            <Box justifyContent="center" display="flex" alignItems="center" flexDirection="column">
                                <Typography variant='h1'>
                                    Bienvenu(e) dans DEF Gestion des stocks !
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    Vous devez faire quelques configurations avant d'utiliser l'application.
                                </Typography>
                                <Typography variant='caption' className="small">Vous pouvez aussi concerver les <span className="primary-color">configurations par défaut</span>.</Typography>
                                <Box display="flex" alignItems='center' justifyContent="center" mt={2} width="100%">
                                    <Button
                                        variant="outlined"
                                        color="default"
                                        disableElevation
                                        size="large"
                                        onClick={handleDefaultConfig}
                                        sx={{
                                            maxWidth: 'fit-content',
                                        }}
                                    >
                                        Configurations par défaut
                                    </Button>
                                    <Button
                                        variant="contained"
                                        disableElevation
                                        size="large"
                                        startIcon={<SettingsIcon />}
                                        onClick={goToConfig}
                                        sx={{
                                            maxWidth: 'fit-content',
                                            ml: 2
                                        }}
                                    >
                                        Aller configurer
                                    </Button>
                                </Box>
                                {openConfigView &&
                                    <ConfigurationView
                                        open={openConfigView}
                                        onClose={toggleConfigView}
                                        configurations={defaultConfigs}
                                        handleConfirmation={handleConfirmation}
                                    />
                                }
                            </Box>
                        </> :
                        <Box>

                        </Box>
                    }
                </StyledContentContainer>
            }
            <StyledBottomBanner>
                <div className='illustration'>
                    <img src={mvtStcok} alt="def-stock-illustration" />
                </div>
            </StyledBottomBanner>
        </StyledContainer>
    )
}
