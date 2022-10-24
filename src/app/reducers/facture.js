import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';
import axios from 'axios';

const factureEntity = createEntityAdapter({
    selectId: item => item.id
});

const initialState = factureEntity.getInitialState({
    error: null,
    status: 'idle',
    currentFacture: null,
    printFacture: null
});

export const getFactures = createAsyncThunk(
    'facture/get all',
    async () => {}
);

export const getCurrentFacture = createAsyncThunk(
    'facture/get current',
    async () => {
        const res = await axios.get(`https://def-api.herokuapp.com/api/ventes/facture_recente`);
        return res.data;
    }
);

export const {actions, reducer} = createSlice({
    name: 'facture',
    initialState,
    reducers: {
        setCurrentFacture: (state, action) => {
            const facture = action.payload;
            state.currentFacture = facture;
        },
        setPrintFacture: (state, action) => {
            const facture = action.payload;
            state.printFacture = facture;
        }
    },
    extraReducers: {
        [getCurrentFacture.pending]: (state, action) => {
            state.status = 'idle';
        },
        [getCurrentFacture.fulfilled]: (state, action) => {
            const res = action.payload;
            if (res && res.facture) {
                state.currentFacture = action.payload.facture;
            }
            state.status = 'fulfilled';
        },
        [getCurrentFacture.rejected]: (state, action) => {
            state.status = 'failed';
        },
    }
});

export const getTodayFactureRecente = state => state.factures.currentFacture;
export const getPrintFacture = state => state.factures.printFacture;
export const getError = state => state.factures.error;
export const getReqStatus = state => state.factures.status;