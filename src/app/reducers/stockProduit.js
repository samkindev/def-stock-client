import {
	createSlice,
	createAsyncThunk,
	createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";

const stockProduitEntity = createEntityAdapter({
	selectId: (item) => item.id,
});

const initialState = stockProduitEntity.getInitialState({
	status: "idle",
	venteRequestStatus: "idle",
	errors: null,
	categories: [],
});

export const getProduits = createAsyncThunk(
	"produits/get-for-entreprise",
	async (stockId) => {
		const res = await axios.get("https://def-api.herokuapp.com/api/produits?stock=" + stockId);
		return res.data;
	}
);

export const { reducer, actions } = createSlice({
	name: "produit",
	initialState,
	reducers: {},
	extraReducers: {
		[getProduits.pending]: (state) => {
			state.status = "loading";
		},
		[getProduits.fulfilled]: (state, action) => {
			state.status = "fulfilled";
			stockProduitEntity.upsertMany(state, action.payload);
		},
		[getProduits.rejected]: (state, action) => {
			state.status = "failed";
			state.errors = action.payload;
		},
	},
});

export const { selectAll: selectAllProducts, selectById: selectProduitById } = stockProduitEntity.getSelectors(
	(state) => state.stockProduits
);

export const getReqState = (state) => state.stockProduits.status;
export const getErrors = (state) => state.stockProduits.errors;