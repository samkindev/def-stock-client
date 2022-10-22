import React, { useEffect } from 'react';
import { styled } from '@mui/system';
import { useSelector, useDispatch } from 'react-redux';
import ProduitFilters from './ProduitFilters';
import ProduitList from './ProduitList';
import { getProducts, getLoadingStatus, getErrors, getFiltering } from '../../../../app/reducers/myProduct';
import { CircularProgress } from '@mui/material';
import { LoadingModal } from '../../../../Components';

const StyledContainer = styled('div')(() => ({
    marginRight: 10,
    height: "calc(100vh - 54px)",
    borderLeft: '1px solid rgb(204, 204, 204)',
    borderRight: '1px solid rgb(204, 204, 204)',
    backgroundColor: '#fff',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    "& .loading": {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
}));

export default function Produits() {
    const loading = useSelector(getLoadingStatus) === "loading";
    const filtering = useSelector(getFiltering);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProducts());
    }, []);
    return (
        <StyledContainer>
            {loading ?
                <div className="loading">
                    <CircularProgress size={25} />
                </div> :
                <>
                    {filtering && <LoadingModal open={filtering} />}
                    <ProduitFilters />
                    <ProduitList />
                </>
            }
        </StyledContainer>
    )
}
