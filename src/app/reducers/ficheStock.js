import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';
import axios from 'axios';

const ficheStockEntity = createEntityAdapter({
    selectId: item => item.id,
});

const initialState = ficheStockEntity.getInitialState({
    status: 'idle',
    errors: null,
    nombreEntrees: 0,
    nombreSorties: 0
});

export const getFicheStockInitData = createAsyncThunk(
    'fiche-stocks/get-initial-data',
    async () => {
        const res = await axios.get('/api/fiche_stocks');
        return res.data;
    }
);

export const getFicheStockData = createAsyncThunk(
    'fiche-stocks/get-fiche-stocks-data',
    async () => {
        const res = await axios.get('/api/fiche_stocks/mouvement');
        return res.data;
    }
);

export const {reducer, actions} = createSlice({
    name: 'fiche_stock',
    initialState,
    reducers: {
        ajouterMovementSock: (state, action) => {
            const data = action.payload;
            if (data instanceof Array) {
                ficheStockEntity.upsertMany(data);
            }
        }
    },
    extraReducers: {
        [getFicheStockInitData.pending]: (state) => {
            state.status = 'loading';
        },
        [getFicheStockInitData.fulfilled]: (state, action) => {
            const data = action.payload;
            state.status = 'fulfilled';
            state.nombreEntrees = data.entrees;
            state.nombreSorties = data.sorties;
        },
        [getFicheStockInitData.rejected]: (state, action) => {
            state.status = 'failed';
            state.errors = action.payload;
        },
        [getFicheStockData.pending]: (state) => {
            state.status = 'loading';
        },
        [getFicheStockData.fulfilled]: (state, action) => {
            state.status = 'fulfilled';
            ficheStockEntity.upsertMany(state, action.payload);
        },
        [getFicheStockData.rejected]: (state, action) => {
            state.status = 'failed';
            state.errors = action.payload;
        },
    }
})

export const {
    selectAll,
    selectById,
} = ficheStockEntity.getSelectors(state => state.ficheStocks);

export const getReqState = state => state.ficheStocks.status;
export const getErrors = state => state.ficheStocks.errors;
export const getNombreEntrees = state => state.ficheStocks.nombreEntrees;
export const getNombreSorties = state => state.ficheStocks.nombreSorties;