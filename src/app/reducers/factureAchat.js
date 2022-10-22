import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';
import axios from 'axios';
import {dateCompare} from '../../utilities/helpers';

const factureAchatEntity = createEntityAdapter({
    selectId: item => item.id,
    sortComparer: (a, b) => dateCompare(a.date_emission, b.date_emission)
});

const initialState = factureAchatEntity.getInitialState({
    error: null,
    status: 'idle',
});

export const getFacturesAchat = createAsyncThunk(
    'facture/get all',
    async () => {
        const {data} = await axios.get('/api/entrees/factures');
        return data;
    }
);

export const {actions, reducer} = createSlice({
    name: 'facture_achat',
    initialState,
    reducers: {
        updateteOne: (state, action) => {
            const {id, attribute, value} = action.payload;
            if (id) {
                const found = state.entities[id];
                if (!found) return;
                found[attribute] = value;
            }
        }
    },
    extraReducers: {
        [getFacturesAchat.pending]: (state, action) => {
            state.status = 'loading';
        },
        [getFacturesAchat.fulfilled]: (state, action) => {
            const res = action.payload;
            if (res) {
                factureAchatEntity.upsertMany(state, res);
            }
            state.status = 'fulfilled';
        },
        [getFacturesAchat.rejected]: (state, action) => {
            state.status = 'failed';
        },
    }
});

export const {
    selectAll,
    selectById
} = factureAchatEntity.getSelectors(state => state.facturesAchat);

export const getError = state => state.facturesAchat.error;
export const getReqStatus = state => state.facturesAchat.status;