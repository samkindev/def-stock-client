import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

const depotEntity = createEntityAdapter({
    selectId: item => item.id,
})
const initialState = depotEntity.getInitialState({
    status: 'idle',
    saving: false,
    error: null,
    validationErrors: [],
    currentDepot: null,
    subCreating: false,
    subRemoving: false,
});

export const getDepots = createAsyncThunk(
    'get all depots',
    async () => {
        const response = await axios.get('/api/depot');
        return response.data;
    }
);

export const creerDepot = createAsyncThunk(
    'create a depot',
    async (data) => {
        const response = await axios.post('/api/depot', data);
        return response.data;
    }
);

export const creerMultipleDepot = createAsyncThunk(
    'create multiple new depots',
    async (data) => {
        const response = await axios.post('/api/depot/multiple', data);
        return response.data;
    }
);

export const createDepotSubdivision = createAsyncThunk(
    'create depot subdivision',
    async (data) => {
        const response = await axios.post('/api/subdivision', data);
        return response.data;
    }
);

export const updateGeneralDepotData = createAsyncThunk(
    'update one depot',
    async ({ id, data }) => {
        const response = await axios.patch(`/api/depot/${id}/general`, data);
        return response.data;
    }
);

export const configureAllDepots = createAsyncThunk(
    'send new configs for all depots',
    async (data) => {
        const response = await axios.post('/api/depot/configurations');
        return response.data;
    }
)

export const deleteDepotSubdivision = createAsyncThunk(
    'delete depot subdivision',
    async (depotId) => {
        const response = await axios.delete('/api/subdivision/' + depotId);
        return response.data;
    }
);

export const { actions, reducer } = createSlice({
    name: 'depot',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearValidationErrors: (state) => {
            state.validationErrors = [];
        }
    },
    extraReducers: {
        [creerMultipleDepot.pending]: (state) => {
            state.saving = true;
        },
        [creerMultipleDepot.fulfilled]: (state, action) => {
            const res = action.payload;
            if (res.status === 'success') {
                depotEntity.upsertMany(state, res.depots);
            } else {
                if (res.type === 'validation') {
                    state.validationErrors = res.errors;
                } else {
                    state.error = res.message || "Erreur lors de la création des dépôts.";
                }
            }
            state.saving = false;
        },
        [creerMultipleDepot.rejected]: (state, action) => {
            state.saving = false;
            state.error = action.message || "Une erreur s'est produite.";
        },
        [creerDepot.pending]: (state) => {
            state.saving = true;
        },
        [creerDepot.fulfilled]: (state, action) => {
            const res = action.payload;
            if (res.status === 'success') {
                depotEntity.upsertOne(state, res.depot);
            } else {
                state.error = res.message || "Erreur lors de la création d'un dépôt.";
            }
            state.saving = false;
        },
        [creerDepot.rejected]: (state, action) => {
            state.saving = false;
            state.error = action.message || "Une erreur s'est produite.";
        },
        [updateGeneralDepotData.pending]: (state) => {
            state.saving = true;
        },
        [updateGeneralDepotData.fulfilled]: (state, action) => {
            const res = action.payload;
            if (res.status === 'success') {
                depotEntity.updateOne(state, res.depot);
            } else {
                state.error = res.message || "Erreur lors de la mise à jour d'un dépôt.";
            }
            state.saving = false;
        },
        [updateGeneralDepotData.rejected]: (state, action) => {
            state.saving = false;
            state.error = action.message || "Une erreur s'est produite.";
        },
        [getDepots.pending]: (state) => {
            state.status = 'loading';
        },
        [getDepots.fulfilled]: (state, action) => {
            const res = action.payload;
            depotEntity.upsertMany(state, res);
            state.status = 'fullfiled';
        },
        [getDepots.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.message || "Une erreur s'est produite.";
        },
        [configureAllDepots.pending]: (state) => {
            state.saving = true;
        },
        [configureAllDepots.fulfilled]: (state, action) => {
            const res = action.payload;
            if (res.status === 'sucess') {
                depotEntity.updateMany(state, res.depots);
            } else {
                state.error = res.message || "Une erreur s'est produite."
            }
            state.saving = true;
        },
        [configureAllDepots.rejected]: (state, action) => {
            state.saving = false;
            state.error = action.message || "Une erreur s'est produite."
        },
        [createDepotSubdivision.pending]: (state) => {
            state.subCreating = true;
        },
        [createDepotSubdivision.fulfilled]: (state, action) => {
            const res = action.payload;
            if (res.status === 'success') {
                depotEntity.updateOne(state, res.depot);
            } else {
                if (res.type) {
                    state.error = res.errors;
                } else {
                    state.error = res.message || "Erreur lors de la création d'un emplacement du dépôt.";
                }
            }
            state.subCreating = false;
        },
        [createDepotSubdivision.rejected]: (state, action) => {
            state.subCreating = false;
            state.error = action.message || "Une erreur s'est produite.";
        },
        [deleteDepotSubdivision.pending]: (state) => {
            state.subRemoving = true;
        },
        [deleteDepotSubdivision.fulfilled]: (state, action) => {
            const res = action.payload;
            if (res.status === 'success') {
                depotEntity.updateOne(state, res.depot);
            } else {
                state.error = res.message || "Erreur lors de la suppression d'un emplacement du dépôt.";
            }
            state.subRemoving = false;
        },
        [deleteDepotSubdivision.rejected]: (state, action) => {
            state.subRemoving = false;
            state.error = action.message || "Une erreur s'est produite.";
        },
    }
});

export const {
    selectAll,
    selectById
} = depotEntity.getSelectors(state => state.depots);

export const getReqStatus = state => state.depots.status;
export const getError = state => state.depots.error;
export const getCurrentDepot = state => state.depots.currentDepot;
export const getSaveState = state => state.depots.saving;
export const getValidationErrors = state => state.depots.validationErrors;
export const getSubCreating = state => state.depots.subCreating;
export const getSubDeleting = state => state.depots.subRemoving;