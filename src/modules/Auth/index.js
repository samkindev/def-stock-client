import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Typography, Button, CircularProgress, Alert, Fade } from '@mui/material';
import { Box, styled } from '@mui/system';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import KeyIcon from '@mui/icons-material/Key';
import { login, getLoggingIn, getError } from '../../app/reducers/auth';

const StyledContainer = styled('div')(() => ({
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}));

const StyledContentContainer = styled('div')(() => ({
    padding: 20,
    borderRadius: 10,
    boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.2)',
    minWidth: 300,
    maxWidth: 330,
    border: '1px solid #eaeaea',
    "& .form-controle": {
        display: 'flex',
        alignItems: 'center',
        "& .label": {
            marginLeft: 10
        },
    },
    "& a": {
        TextDecorationLine: 'none!important',
    }
}));

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const loading = useSelector(getLoggingIn);
    const error = useSelector(getError);

    const dispatch = useDispatch();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("submited");
        dispatch(login({ username, password }))
    }
    return (
        <StyledContainer>
            <StyledContentContainer>
                <Box mb={3}>
                    <Typography variant="h3">Connexion</Typography>
                </Box>
                <form className="form" onSubmit={handleSubmit}>
                    {error && <Fade in={error && error !== ""}><Alert severity='error' color='error' sx={{ my: 1 }}>{error}</Alert></Fade>}
                    <Box mb={1.5}>
                        <div className="form-controle">
                            <PermIdentityIcon />
                            <Typography variant="caption" className="label">Identifiant</Typography>
                        </div>
                        <TextField
                            name="username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            size="small"
                            fullWidth
                        />
                    </Box>
                    <Box mb={1}>
                        <div className='form-controle'>
                            <KeyIcon />
                            <Typography variant="caption" className="label">Mot de passe</Typography>
                        </div>
                        <TextField
                            name="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            size="small"
                            fullWidth
                        />
                    </Box>
                    <Box mb={1.5}>
                        <Link to="">
                            <Typography variant="body2" color="primary">Mot de passe oublié ?</Typography>
                        </Link>
                    </Box>
                    <Button
                        disableElevation
                        variant='contained'
                        color="primary"
                        size='medium'
                        fullWidth
                        type="submit"
                        sx={{
                            minWidth: 300,
                            height: 36.5,
                        }}
                    >
                        {loading ? (
                            <CircularProgress
                                size={12}
                                color="inherit"
                            />
                        ) : (
                            "Connecter"
                        )}
                    </Button>
                </form>
            </StyledContentContainer>
        </StyledContainer>
    )
}
