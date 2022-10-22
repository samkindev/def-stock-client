import React from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/system';
import { selectAll as selectAllDepots } from '../../app/reducers/depot';
import { selectAll as selectAllProduit } from '../../app/reducers/myProduct';
import { Typography } from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import { Link } from 'react-router-dom';

const StyledContainer = styled('div')(() => ({
    width: '100%',
    minHeight: 'calc(100vh - 56px)',
    display: 'flex',
    flexDirection: 'column',
    padding: '50px 0',
    alignItems: 'center',
    "& .depot-list": {
        display: 'flex',
        alignItems: 'center',
        maxWidth: 800,
        "& > *": {
            flex: 1
        }
    }
}));

const StyledBloc = styled('div')(() => ({

}));

const StyledDepotCard = styled(Link)(() => ({
    padding: 15,
    borderRadius: 5,
    border: '1px solid rgb(204, 204, 204)',
    backgroundColor: '#fff',
    boxShadow: '0px 0px 13px 0px #37373754',
    width: 200,
    transition: 'all .1s',
    "&:not(:first-of-type)": {
        marginLeft: 15
    },
    "& .card-header": {

    },
    "& .card-body": {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 10,
        "& .nom": {
            fontWeight: '700!important',
        }
    },
    "&:hover": {
        boxShadow: '0px 0px 0px 0px #cccccc01',
        backgroundColor: '#efefef'
    }
}));

export default function DepotsModuleHome() {
    const depots = useSelector(selectAllDepots);
    const products = useSelector(selectAllProduit);

    return (
        <StyledContainer>
            <StyledBloc>
                <Typography variant="h2">Liste des dépôts</Typography>
                <div className="depot-list">
                    {depots.map(depot => (
                        <StyledDepotCard key={depot.id} to={depot.id}>
                            <div className="card-header">
                                <StoreIcon color='default' />
                            </div>
                            <div className="card-body">
                                <Typography variant="caption" className='small'>
                                    {depot.code_depot}
                                </Typography>
                                <Typography variant="caption" className="nom">
                                    {depot.nom_depot}
                                </Typography>
                            </div>
                        </StyledDepotCard>
                    ))}
                </div>
            </StyledBloc>
        </StyledContainer>
    )
}
