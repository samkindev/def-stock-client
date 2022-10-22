import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/system';
import { Button } from '@mui/material';
import EntreesFilters from './EntreesFiltres';
import EntreesTable from './EntreeTable';
import AddIcon from '@mui/icons-material/Add';
import { getDepotEntree, getReqState } from '../../../app/reducers/entree';
import { Chargement } from '../../../Components';

const StyledContainer = styled('div')(() => ({
  marginLeft: 10,
  marginRight: 10,
  marginTop: 10,
  borderRight: '1px solid rgb(204, 204, 204)',
  borderLeft: '1px solid rgb(204, 204, 204)',
  height: 'calc(100vh - 56px)',
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


export default function EntreeStock() {
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const loadState = useSelector(getReqState);

  useEffect(() => {
    dispatch(getDepotEntree(id));
  }, []);
  useEffect(() => {
    setLoading(loadState === 'loading');
  }, [loadState]);
  return (
    <StyledContainer>
      {loading ?
        <Chargement message="Chargement..." sx={{ height: '100%' }} size={20} /> :
        <>
          <EntreesFilters />
          <StyledActions>
            <Link to="nouveau" state={{ backgroundLocation: location }}>
              <Button
                endIcon={<AddIcon />}
                disableElevation
                variant='outlined'
                color="primary"
                size='small'
                type="submit"
              >Nouvelle entrée en stock</Button>
            </Link>
          </StyledActions>
          <EntreesTable selected={selected} setSelected={setSelected} />
        </>
      }
    </StyledContainer>
  )
}
