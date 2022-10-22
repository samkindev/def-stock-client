import {
	createSlice,
	createAsyncThunk,
	createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";

const venteProduitsEntity = createEntityAdapter({
	selectId: (item) => item.id,
});

const initialState = venteProduitsEntity.getInitialState({
	status: "idle",
	gettingPaymentMode: false,
	gettingReduction: false,
	saving: false,
	errors: null,
	magasin: {},
	guichet: {},
	vendeur: {},
	productRow: [],
	paymentModes: [],
	reductions: []
});

export const getProduitsDisponibles = createAsyncThunk(
	"ventes/produit disponible",
	async (depotId) => {
		const res = await axios.get(`/api/depot/${depotId}/vente/produits`);
		return res.data;
	}
);

export const getPaymentModes = createAsyncThunk(
	"ventes/mode payment",
	async () => {
		const res = await axios.get('/api/mode_payement');
		return res.data;
	}
);

export const getReductions = createAsyncThunk(
	"ventes/reductions",
	async () => {
		const res = await axios.get('/api/reduction');
		return res.data;
	}
);

export const saveVente = createAsyncThunk(
	"vente/save",
	async ({ depotId, data }) => {
		const res = await axios.post(`/api/depot/${depotId}/vente`, data);
		return res.data;
	}
);

export const { reducer, actions } = createSlice({
	name: "vente",
	initialState,
	reducers: {
		addFactureCourante: (state, action) => {
			state.factureRecente = action.payload;
		},
		setMagasin: (state, action) => {
			state.magasin = action.payload;
		},
		setProductRow: (state, action) => {
			const d = action.payload;
			let r = [];
			if (d.id || d.id === 0) {
				r = state.productRow.map(row => {
					if (row.id === d.id) {
						return d;
					}
					return row;
				});
			} else {
				r = [...state.productRow, { id: state.productRow.length, ...d }];
			}
			state.productRow = r;
		},
		addReduction: (state, action) => {
			const reduction = action.payload;
			const rows = state.productRow;
			const newR = [];
			rows.forEach(row => {
				newR.push(row);
				if (row.id === reduction.id) {
					newR.push({ ...reduction, id: "reduction" + reduction.id + "" + rows.length, rowId: row.id })
				}
			});

			state.productRow = newR;
		},
		clearProductRow: (state) => {
			state.productRow = [];
		},
		removeProductRow: (state, action) => {
			const ids = action.payload;
			state.productRow = state.productRow.filter(pR => ids.every(id => id !== pR.id && pR.rowId !== id));
		}
	},
	extraReducers: {
		[getProduitsDisponibles.pending]: (state) => {
			state.status = "loading";
		},
		[getProduitsDisponibles.fulfilled]: (state, action) => {
			const d = action.payload;
			if (d) {
				venteProduitsEntity.upsertMany(state, d);
			}
			state.status = "fulfilled";
		},
		[getProduitsDisponibles.rejected]: (state, action) => {
			state.status = "failed";
			state.errors = action.payload;
		},
		[getReductions.pending]: (state) => {
			state.gettingReduction = true;
		},
		[getReductions.fulfilled]: (state, action) => {
			const d = action.payload;
			if (d) {
				state.reductions = d;
			}
			state.gettingReduction = false;
		},
		[getReductions.rejected]: (state, action) => {
			state.gettingReduction = false;
			state.errors = action.payload;
		},
		[getPaymentModes.pending]: (state) => {
			state.gettingPaymentMode = true;
		},
		[getPaymentModes.fulfilled]: (state, action) => {
			const d = action.payload;
			if (d) {
				state.paymentModes = d;
			}
			state.gettingPaymentMode = false;
		},
		[getPaymentModes.rejected]: (state, action) => {
			state.gettingPaymentMode = false;
			state.errors = action.payload;
		},
		[saveVente.pending]: (state) => {
			state.saving = true;
		},
		[saveVente.fulfilled]: (state, action) => {
			const d = action.payload;
			if (d && d.status === 'success') {
				// state.paymentModes = d;
			} else {
				state.errors = d.errors;
			}
			state.saving = false;
		},
		[saveVente.rejected]: (state, action) => {
			state.saving = false;
			state.errors = action.payload;
		},
	},
});

export const { selectAll, selectById } = venteProduitsEntity.getSelectors(
	(state) => state.ventes
);

export const getReqState = (state) => state.ventes.status;
export const getErrors = (state) => state.ventes.errors;
export const getMagasin = (state) => state.ventes.magasin;
export const getProductRow = (state) => state.ventes.productRow;
export const selectPaymentModes = state => state.ventes.paymentModes;
export const selectReductions = state => state.ventes.reductions;
export const getGettingReduction = state => state.ventes.gettingReduction;
export const getGettingPaymentMode = state => state.ventes.gettingPaymentMode;
export const getSaving = state => state.ventes.saving;