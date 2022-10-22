import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectById } from '../../../../app/reducers/depot';
import { styled } from '@mui/system';
import BasicInfos from './BasicInfos';
import ConfigGestionStocksDepot from './ConfigGestionStocksDepot';

const StyledContainer = styled('div')(() => ({
    padding: 20,
    "& .align-flex": {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    }
}));

export default function SingleDepotConfig() {
    const { id } = useParams();
    const depot = useSelector(state => selectById(state, id));
    return (
        <StyledContainer>
            <div className="align-flex">
                <BasicInfos depot={depot || {}} />
                <div style={{ flex: 1 }}>
                    <ConfigGestionStocksDepot depot={depot || {}} />
                </div>
            </div>
        </StyledContainer>
    )
}
