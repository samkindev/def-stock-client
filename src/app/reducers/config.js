import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    taux: 2000,
    devise: 'CDF',
    status: 'idle',
}

// Redux Slice pour l'assujetti
export const {actions, reducer} = createSlice({
    name: 'configs',
    initialState,
    reducers: {
        setTaux: (state, action) => {
            state.taux = action.taux;
        },
        setDevise: (state, action) => {
            state.devise = action.devise;
        }
    }
});

export const getTaux = state => state.configs.taux;
export const getDevise = state => state.configs.devise;