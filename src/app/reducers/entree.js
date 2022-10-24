import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

const entreeEntity = createEntityAdapter({
    selectId: item => item.ref_bon_entree,
    sortComparer: (a, b) => {
        if (a.date_transaction > b.date_transaction) {
            return -1
        } else {
            return 1
        }
    }
});

const initialState = entreeEntity.getInitialState({
    status: 'idle',
    errors: null,
    count: null,
    creating: false
});

// Effectue une entrée en stock pour un seul produit
export const createEntreeDepot = createAsyncThunk(
    'entree/creer',
    async ({ depotId, data }) => {
        const res = await axios.post(`https://def-api.herokuapp.com/api/depot/${depotId}/entree/`, data);
        return res.data;
    });


export const getDepotEntree = createAsyncThunk(
    'entree/count',
    async (depotId) => {
        const res = await axios.get(`https://def-api.herokuapp.com/api/depot/${depotId}/entree`);
        return res.data;
    }
);


export const { reducer, actions } = createSlice({
    name: 'entrees',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.errors = null;
        }
    },
    extraReducers: {
        [createEntreeDepot.pending]: (state) => {
            state.creating = true;
        },
        [createEntreeDepot.fulfilled]: (state, action) => {
            const d = action.payload
            if (d.status === "success") {
                entreeEntity.addOne(state, d.entree);
            } else if (d.type === 'validation') {
                state.errors = d.errors;
            }
            state.creating = false;
        },
        [createEntreeDepot.rejected]: (state, action) => {
            state.creating = false;
            const errors = action.payload;
            if (errors && errors.errors) {
                state.errors = errors.errors;
            } else {
                state.errors = [{
                    msg: errors ? errors.message : "Une erreur s'est produite lors de la connection au serveur."
                }]
            }
        },
        [getDepotEntree.pending]: (state) => {
            state.status = 'loading';
        },
        [getDepotEntree.fulfilled]: (state, action) => {
            const d = action.payload
            entreeEntity.upsertMany(state, d.entrees);
            state.count = d.count;
            state.status = 'fulfilled';
        },
        [getDepotEntree.rejected]: (state, action) => {
            state.status = 'failed';
            state.errors = [action.payload ? action.payload.message : "Une erreur s'est produite lors de la connection au serveur."];
        },
    }
})

export const {
    selectAll,
    selectById,
} = entreeEntity.getSelectors(state => state.entrees);

export const getReqState = state => state.entrees.status;
export const getErrors = state => state.entrees.errors;
export const getCreating = state => state.entrees.creating;
export const getCount = state => state.entrees.count;