import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { stringsSortCb } from '../../utilities/helpers';

const productAdapter = createEntityAdapter({
    selectId: item => item.id,
    sortComparer: (a, b) => stringsSortCb(a.code_produit, b.code_produit)
});

const initialState = productAdapter.getInitialState({
    loadingStatus: 'idle',
    filtering: false,
    errors: null,
    creating: false,
    deleting: false,
    updating: false,
});

export const getProducts = createAsyncThunk(
    "produits/get all",
    async () => {
        const response = await axios.get('/api/produit');
        return response.data;
    }
);

export const filteredProduct = createAsyncThunk(
    "produits/get filtered data",
    async (query) => {
        const response = await axios.get('/api/produit/filter?' + query);
        return response.data;
    }
);

export const createProduct = createAsyncThunk(
    "produits/create one",
    async (data) => {
        const res = await axios.post('/api/produit', data);
        return res.data;
    }
);

export const deleteProduct = createAsyncThunk(
    "produits/delete one",
    async (productId) => {
        const res = await axios.delete('/api/produit/' + productId);
        return res.data;
    }
);

export const updateProduct = createAsyncThunk(
    "produits/update one",
    async ({ productId, data }) => {
        const res = await axios.patch('/api/produit/' + productId, data);
        return res.data;
    }
);

export const changeProductsEtat = createAsyncThunk(
    "produits/change etat",
    async ({ ids, status }) => {
        const response = await axios.patch('/api/produit/change_status?etat=' + status, ids);
        return response.data;
    }
);

export const { actions, reducer } = createSlice({
    name: "produit",
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.errors = null;
        }
    },
    extraReducers: {
        [getProducts.pending]: (state) => {
            state.loadingStatus = 'loading';
        },
        [getProducts.fulfilled]: (state, action) => {
            const products = action.payload;
            productAdapter.upsertMany(state, products);
            state.loadingStatus = 'fulfilled';
        },
        [getProducts.rejected]: (state) => {
            state.errors = {
                server: "Une erreur s'est produites lors de la connexion au serveur."
            }
            state.loadingStatus = 'failed';
        },
        [filteredProduct.pending]: (state) => {
            state.filtering = true;
        },
        [filteredProduct.fulfilled]: (state, action) => {
            const prods = action.payload;
            productAdapter.removeAll(state);
            productAdapter.upsertMany(state, prods);
            state.filtering = false;
        },
        [filteredProduct.rejected]: (state) => {
            state.errors = {
                server: "Une erreur s'est produites lors de la connexion au serveur."
            }
            state.filtering = false;
        },
        [createProduct.pending]: (state) => {
            state.creating = true;
        },
        [createProduct.fulfilled]: (state, action) => {
            const d = action.payload;
            if (d.status === 'success') {
                productAdapter.upsertOne(state, d.produit);
            } else if (d.type === 'validation') {
                state.errors = d.errors;
            } else {
                state.errors = [{
                    message: d.message || "Une erreur s'est produite."
                }];
            }
            state.creating = false;
        },
        [createProduct.rejected]: (state, actions) => {
            state.errors = [
                { message: "Une erreur s'est produites lors de la connexion au serveur." }
            ]
            state.creating = false;
        },
        [deleteProduct.pending]: (state) => {
            state.deleting = true;
        },
        [deleteProduct.fulfilled]: (state, action) => {
            const d = action.payload;
            if (d.status === 'success') {
                productAdapter.removeOne(state, d.id);
            } else {
                state.errors = [{
                    msg: d.message || "Une erreur s'est produite."
                }];
            }
            state.deleting = false;
        },
        [deleteProduct.rejected]: (state, actions) => {
            state.errors = [
                { msg: "Une erreur s'est produites lors de la connexion au serveur." }
            ];
            state.deleting = false;
        },
        [changeProductsEtat.pending]: (state) => {
            state.updating = true;
        },
        [changeProductsEtat.fulfilled]: (state, action) => {
            const d = action.payload;
            if (d.status === 'success') {
                productAdapter.removeMany(state, d.produits.map(p => p.id));
                productAdapter.upsertMany(state, d.produits);
            } else if (d.type === 'validation') {
                state.errors = d.errors;
            } else {
                state.errors = [{
                    msg: d.message || "Une erreur s'est produite."
                }];
            }
            state.updating = false;
        },
        [changeProductsEtat.rejected]: (state, actions) => {
            state.errors = [
                { msg: "Une erreur s'est produites lors de la connexion au serveur." }
            ];
            state.updating = false;
        },
        [updateProduct.pending]: (state) => {
            state.updating = true;
        },
        [updateProduct.fulfilled]: (state, action) => {
            const d = action.payload;
            if (d && d.status === 'success') {
                productAdapter.removeOne(state, d.produit.id);
                productAdapter.addOne(state, d.produit);
            } else if (d && d.type === 'validation') {
                state.errors = d.errors;
            } else if (d && d.type !== 'no-update') {
                state.errors = [{
                    msg: d.message || "Une erreur s'est produite."
                }];
            }
            state.updating = false;
        },
        [updateProduct.rejected]: (state, actions) => {
            state.errors = [
                { msg: "Une erreur s'est produites lors de la connexion au serveur." }
            ];
            state.updating = false;
        },
    }
});

export const {
    selectAll,
    selectById
} = productAdapter.getSelectors(state => state.produits);

export const getLoadingStatus = state => state.produits.loadingStatus;
export const getCreatingState = state => state.produits.creating;
export const getErrors = state => state.produits.errors;
export const getDeletingState = state => state.produits.deleting;
export const getFiltering = state => state.produits.filtering;
export const getUpdating = state => state.produits.updating;
