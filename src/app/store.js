import { configureStore } from '@reduxjs/toolkit';
import { reducer as entreeReducer } from './reducers/entree';
import { reducer as depotStore } from './reducers/depot';
import { reducer as venteDataReducer } from './reducers/venteData';
// --------
import { reducer as assujettiReducer } from './reducers/assujetti';
// --------
import { reducer as factureReducer } from './reducers/facture';
import { reducer as ConfigReducer } from './reducers/config';
import { reducer as factureAchatReducer } from './reducers/factureAchat';
import { reducer as ficheStockReducer } from './reducers/ficheStock';
import { reducer as authReducer } from './reducers/auth';
import { reducer as produitReducer } from './reducers/myProduct';
import { reducer as stockProduitReducer } from './reducers/stockProduit';
import { reducer as sortieReducer } from './reducers/sortie';

export const store = configureStore({
  reducer: {
    produits: produitReducer,
    entrees: entreeReducer,
    depots: depotStore,
    ventes: venteDataReducer,
    assujetti: assujettiReducer,
    factures: factureReducer,
    facturesAchat: factureAchatReducer,
    configs: ConfigReducer,
    ficheStocks: ficheStockReducer,
    auth: authReducer,
    stockProduits: stockProduitReducer,
    sorties: sortieReducer
  },
});
