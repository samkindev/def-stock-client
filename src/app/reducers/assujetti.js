import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    assujetti: null,
    user: null,
    auth: false,
    status: 'idle',
}

// Thunc de recuperation des données de l'utilisateur
export const getUserData = createAsyncThunk(
    "assujetti/entreprise-data",
    async () => {
        const res = await axios.get('https://def-api.herokuapp.com/api/user');
        return res.data;
    }
);

// Redux Slice pour l'assujetti
export const { actions, reducer } = createSlice({
    name: 'assujetti',
    initialState,
    extraReducers: {
        [getUserData.pending]: (state) => {
            state.status = 'loading'
        },
        [getUserData.fulfilled]: (state, action) => {
            state.status = 'fulfilled'; // Reponse de succes
            const data = action.payload; // Recuperation de la reponse du serveur
            if (data && data.connected) {
                state.user = data.user;
                state.assujetti = data.assujetti;
                state.auth = true;
            }
        },
        [getUserData.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.payload;
            state.user = null;
            state.assujetti = null;
            state.auth = false;
        },
    }
});

export const getAssujetti = state => state.assujetti.assujetti;
export const getUser = state => state.assujetti.user;
export const getAuth = state => state.assujetti.auth;
export const getreqState = state => state.assujetti.status;
export const getErrors = state => state.assujetti.errors 