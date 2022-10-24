import React, { createContext, useEffect, useState } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectById as selectDepotById } from '../../../app/reducers/depot';
import SingleDepotAside from './Aside';
import { styled } from '@mui/system';
import axios from 'axios';

export const SubdivisionContext = createContext();

const StyledContainer = styled('div')(() => ({
    marginLeft: 280,
    height: 'calc(100vh - 56px)'
}));

export default function SingleDepot() {
    const { id } = useParams();
    const depot = useSelector((state) => selectDepotById(state, id));
    const [subdivisions, setSubdivisions] = useState([]);
    const [loading, setLoading] = useState(false);

    const getSubdivision = () => {
        setLoading(true);
        axios.get(`https://def-api.herokuapp.com/api/depot/${id}/subdivision`).then(res => {
            const d = res.data;
            setSubdivisions(d);
        }).catch(error => {
            console.log(error);
        }).finally(() => setLoading(false));
    }

    useEffect(() => {
        getSubdivision();
    }, [id]);
    return (
        <SubdivisionContext.Provider value={{ loading, subdivisions, refresh: getSubdivision }}>
            <StyledContainer>
                <SingleDepotAside depot={depot} />
                <Outlet />
            </StyledContainer>
        </SubdivisionContext.Provider>
    )
}
