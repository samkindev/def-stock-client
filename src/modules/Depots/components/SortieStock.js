import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/system';
import { Button } from '@mui/material';
import { getSorties, getReqState } from '../../../app/reducers/sortie';
import { Chargement } from '../../../Components';
import SortieTable from './SortieTable';
import SortieFilters from './SortieFilter';

const StyledContainer = styled('div')(() => ({
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderRight: '1px solid rgb(204, 204, 204)',
    borderLeft: '1px solid rgb(204, 204, 204)',
    height: 'calc(100vh - 110px)',
}));

const StyledActions = styled("div")(() => ({
    display: 'flex',
    alignItems: 'center',
    padding: "5px 10px",
    backgroundColor: '#fff',
    "& > *:not(:first-of-type)": {
        marginLeft: 10
    }
}));


export default function SortieStock() {
    const location = useLocation();
    const { id } = useParams();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState([]);
    const loadState = useSelector(getReqState);

    useEffect(() => {
        dispatch(getSorties(id));
    }, []);
    useEffect(() => {
        setLoading(loadState === 'loading');
    }, [loadState]);
    return (
        <StyledContainer>
            {loading ?
                <Chargement message="Chargement..." sx={{ height: '100%' }} size={20} /> :
                <>
                    <SortieFilters />
                    <StyledActions>
                        <Link to="nouveau" state={{ backgroundLocation: location }}>
                            <Button
                                disableElevation
                                variant='outlined'
                                color="primary"
                                size='small'
                                type="submit"
                            >Effectuer une sortie</Button>
                        </Link>
                    </StyledActions>
                    <SortieTable selected={selected} setSelected={setSelected} />
                </>
            }
        </StyledContainer>
    )
}
