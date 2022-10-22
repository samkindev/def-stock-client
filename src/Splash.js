import { styled } from '@mui/system';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReqStatus, creerDepot, getSaveState, selectAll as SelectAllDepots } from './app/reducers/depot';
import { Chargement } from './Components';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import mvtStcok from './assets/mvtstock.jpg'

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
    padding: '85px 20px 50px',
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
    marginTop: 0,
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

export default function MainSplash() {
    const load = useSelector(getReqStatus) === 'loading';
    const [loading, setLoading] = useState(true);
    const depots = useSelector(SelectAllDepots);
    const saving = useSelector(getSaveState);
    const dispatch = useDispatch();

    const goToConfigurations = async () => {
        if (depots.length === 0) {
            const depot = {
                nom: 'Dépot principal',
                code: 'D001',
                description: 'Le dépot principal.'
            }
            dispatch(creerDepot(depot));
        }
    }

    useEffect(() => {
        setLoading(load);
    }, []);

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
                    <Box justifyContent="center" display="flex" alignItems="center" flexDirection="column">
                        <Typography variant='h1'>
                            <Typography variant="inherit" color="primary">Bienvenu(e)</Typography> dans  Gestion des stocks !
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Vous devez faire quelques configurations avant d'utiliser l'application.
                        </Typography>
                        <Box display="flex" alignItems='center' justifyContent="center" mt={2} width="100%">
                            <Button
                                variant="contained"
                                disableElevation
                                size="large"
                                startIcon={!saving && <SettingsIcon />}
                                onClick={goToConfigurations}
                                disabled={saving}
                                sx={{
                                    maxWidth: 'fit-content',
                                    ml: 2,
                                    minWidth: 178.63,
                                    height: 42.25,
                                }}
                            >
                                {saving ? (
                                    <span>
                                        Preparation ...
                                        <CircularProgress
                                            size={12}
                                            color="inherit"
                                        />
                                    </span>
                                ) : (
                                    "Aller configurer"
                                )}
                            </Button>
                        </Box>
                    </Box>
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
