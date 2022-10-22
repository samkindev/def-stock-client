import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

const sortieEntity = createEntityAdapter({
    selectId: item => item.id,
    sortComparer: (a, b) => {
        if (a.date_transaction > b.date_transaction) {
            return -1
        } else {
            return 1
        }
    }
});

const initialState = sortieEntity.getInitialState({
    status: 'idle',
    errors: null,
    count: null,
    creating: false,
    isGettingMotif: false,
    motifs: []
});

// New sortie from stock
export const createSortie = createAsyncThunk(
    'sortie/creer',
    async ({ depotId, data }) => {
        const res = await axios.post(`/api/depot/${depotId}/sorties`, data);
        return res.data;
    });


export const getSorties = createAsyncThunk(
    'sortie/get all',
    async (depotId) => {
        const res = await axios.get(`/api/depot/${depotId}/sorties`);
        return res.data;
    }
);

export const getMotifsSortie = createAsyncThunk(
    'sortie/get motifs',
    async () => {
        const res = await axios.get('/api/motif_sortie');
        return res.data;
    }
);


export const { reducer, actions } = createSlice({
    name: 'sortie',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.errors = null;
        }
    },
    extraReducers: {
        [createSortie.pending]: (state) => {
            state.creating = true;
        },
        [createSortie.fulfilled]: (state, action) => {
            const d = action.payload
            if (d.status === "success") {
                sortieEntity.addOne(state, d.sorties);
            } else if (d.type === 'validation') {
                state.errors = d.errors;
            }
            state.creating = false;
        },
        [createSortie.rejected]: (state, action) => {
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
        [getSorties.pending]: (state) => {
            state.status = 'loading';
        },
        [getSorties.fulfilled]: (state, action) => {
            const d = action.payload
            sortieEntity.upsertMany(state, d.sorties);
            state.count = d.count;
            state.status = 'fulfilled';
        },
        [getSorties.rejected]: (state, action) => {
            state.status = 'failed';
            state.errors = [action.payload ? action.payload.message : "Une erreur s'est produite lors de la connection au serveur."];
        },
        [getMotifsSortie.pending]: (state) => {
            state.gettingMotif = true;
        },
        [getMotifsSortie.fulfilled]: (state, action) => {
            const d = action.payload
            if (d instanceof Array) {
                state.motifs = d;
            }
            state.gettingMotif = false;
        },
        [getMotifsSortie.rejected]: (state, action) => {
            state.gettingMotif = false;
            state.errors = [action.payload ? action.payload.message : "Une erreur s'est produite lors de la connection au serveur."];
        },
    }
})

export const {
    selectAll,
    selectById,
} = sortieEntity.getSelectors(state => state.sorties);

export const getReqState = state => state.sorties.status;
export const getErrors = state => state.sorties.errors;
export const getCreating = state => state.sorties.creating;
export const getCount = state => state.sorties.count;
export const getMotifs = state => state.sorties.motifs;
export const getIsGettingMotif = state => state.sorties.isGettingMotif;