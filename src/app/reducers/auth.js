import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk(
    'user/login',
    async ({ username, password }) => {
        const res = await axios.post('/api/user/login', { username, password });
        return res.data;
    }
)

export const logout = createAsyncThunk(
    "user/logout",
    async () => {
        const res = await axios.post('/api/user/logout');
        return res.data;
    }
);

export const getConnectedUser = createAsyncThunk(
    'user/get connected user',
    async () => {
        const res = await axios.get('/api/user');
        return res.data;
    }
);

export const { reducer, actions } = createSlice({
    name: "Auth",
    initialState: {
        user: null,
        isAuth: false,
        taux: 2000,
        devise: 'USD',
        error: null,
        reqState: 'idle',
        loggingIn: false
    },
    extraReducers: {
        [login.pending]: (state) => {
            state.loggingIn = true;
        },
        [login.fulfilled]: (state, action) => {
            const data = action.payload;
            console.log(data);
            if (data && data.status === "connected") {
                state.isAuth = true;
                state.user = data.user;
            } else {
                state.isAuth = false;
                state.user = null;
                state.error = "Echec d'authentification. Verifiez votre identifiant et mot de passe !"
            }

            state.loggingIn = false;
        },
        [login.rejected]: (state, action) => {
            state.loggingIn = false;
            state.error = action.payload ? action.payload.message : "Une erreur s'est produite lors de la connexion au serveur.";
        },
        [getConnectedUser.pending]: (state) => {
            state.reqState = 'loading'
        },
        [getConnectedUser.fulfilled]: (state, action) => {
            const data = action.payload;
            if (data && data.status === "unauthenticated") {
                state.isAuth = false;
                state.user = null;
                state.error = "User not authenticated.";
            } else {
                state.isAuth = true;
                state.user = data.user;
            }

            state.reqState = 'idle';
        },
        [getConnectedUser.rejected]: (state, action) => {
            state.reqState = 'failed';
        },
        [logout.pending]: (state) => {
            state.reqState = 'loading'
        },
        [logout.fulfilled]: (state, action) => {
            const data = action.payload;
            if (data && data.status === "disconnected") {
                state.isAuth = false;
                state.user = null;
            }

            state.reqState = 'idle';
        },
        [logout.rejected]: (state, action) => {
            state.reqState = 'failed';
            state.error = action.payload || "Une erreur s'est produite lors de la connexion au serveur.";
        },
    }
});

export const getAuthState = state => state.auth.isAuth;
export const getCurrentUser = state => state.auth.user;
export const getError = state => state.auth.error;
export const getReqStatus = state => state.auth.reqState;
export const getLoggingIn = state => state.auth.loggingIn;
export const getTaux = state => state.auth.taux;
export const getDevise = state => state.auth.devise;