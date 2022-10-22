import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

const stockEntity = createEntityAdapter({
    selectId: item => item.id,
})

const initialState = stockEntity.getInitialState({
    status: 'idle',
    errors: null,
    currentStock: null,
});

export const getStocks = createAsyncThunk(
    'stocks/get-for-entreprise',
    async (eseId) => {
        const res = await axios.get('/api/stock/' + eseId);
        return res.data;
    }
);

export const getOneStock = createAsyncThunk(
    'stocks/get-one',
    async (eseId, stockId) => {
        const res = await axios.get('/api/stock/' + eseId + '/' + stockId);
        return res.data;
    }
);

export const creerStock = createAsyncThunk(
    'stocks/creer',
    async ({ eseId, data }) => {
        const res = await axios.post('/api/stock/' + eseId, data);
        return res.data;
    }
);


export const { reducer, actions } = createSlice({
    name: 'stock',
    initialState,
    reducers: {
        ajouterProduit: (state, action) => {
            const produit = action.payload;
            state.produits = [...state.produits, { id: state.produits.length + 1, ...produit }];
        }
    },
    extraReducers: {
        [getStocks.pending]: (state) => {
            state.status = 'loading';
        },
        [getStocks.fulfilled]: (state, action) => {
            state.status = 'fulfilled';
            stockEntity.upsertMany(state, action.payload);
            const sP = action.payload.find(stock => stock.num_stock === '1');
            state.stockPrincipal = sP;
        },
        [getStocks.rejected]: (state, action) => {
            state.status = 'failed';
            state.errors = action.payload;
        },

        [getOneStock.pending]: (state, action) => {
            state.status = 'loading';
        },
        [getOneStock.fulfilled]: (state, action) => {
            state.status = 'fulfilled';
            state.currentStock = action.payload;
        },
        [getOneStock.rejected]: (state, action) => {
            state.status = 'failed';
            state.errors = action.payload;
        },
        [creerStock.pending]: (state) => {
            state.status = 'loading';
        },

        [creerStock.fulfilled]: (state, action) => {
            if (action.payload.state === "success") {
                state.status = 'fulfilled';
                stockEntity.upsertOne(state, action.payload.stock);
            } else {
                state.status = 'fulfilled';
                state.errors = action.payload;
            }
        },
        [creerStock.rejected]: (state, action) => {
            state.status = 'failed';
            state.errors = action.payload;
        },
    }
})

export const {
    selectAll,
    selectById,
} = stockEntity.getSelectors(state => state.stocks);

export const getReqState = state => state.stocks.status;
export const getErrors = state => state.stocks.errors;
export const getStockPrincipal = state => state.stocks.stockPrincipal;