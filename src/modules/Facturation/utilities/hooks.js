import {useEffect, useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getVenteDataProduits, selectAll as selectAllProduits} from '../../../app/reducers/produit';
import { getCount, getVenteCount } from '../../../app/reducers/vente';
// import {getAssujetti} from '../../../app/reducers/assujetti';

export const useGetVenteData = () => {
    const data = useSelector(selectAllProduits);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const getData = useCallback(async () => {
        setLoading(true);
        await dispatch(getVenteDataProduits());
        await dispatch(getVenteCount());
        setLoading(false);
    }, [dispatch]);

    useEffect(() => {
        getData();
    }, [getData]);

    return {data, loading}
};

export const useGetNumFacture = () => {
    const count = useSelector(getCount);

    return count + 1;
}