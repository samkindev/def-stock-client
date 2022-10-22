import React from 'react';
import { Button, Typography } from '@mui/material';
import { styled, Box } from '@mui/system';
import { NavLink } from 'react-router-dom';
import GroupsIcon from '@mui/icons-material/Groups';

const StyledContainer = styled('div')(() => ({
    width: 280,
    backgroundColor: '#eeeeee',
    position: 'fixed',
    left: 0,
    top: 54,
    bottom: 0,
    zIndex: 20,
    overflowY: 'auto',
    borderRight: '1px solid rgb(204, 204, 204)',
    display: 'flex',
    flexDirection: 'column',
    "& .header": {
        width: '100%',
        borderBottom: '1px solid rgb(204, 204, 204)',
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        height: 63,
    },
    "& .body": {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
        borderBottom: '1px solid rgb(204, 204, 204)',
    },
}));

const StyledMenuList = styled('menu')(() => ({
    padding: '10px 10px',
    maxHeight: '100%',
    overflowY: 'auto'
}));

const StyledMenuItem = styled(NavLink)(() => ({
    display: 'flex',
    alignItems: 'center',
    color: '#333',
    marginBottom: 3,
    padding: "5px",
    "&:hover": {
        textDecoration: 'underline',
        color: '#000'
    },
    "&.active": {
        backgroundColor: '#eaeaea',
        color: '#000',
        borderRadius: 5,
    },
    "& .icon": {
        marginRight: 10,
    }
}));

const PartenaireAside = () => {
    return (
        <StyledContainer>
            <div className="header">
                <Typography variant="h2" sx={{ fontWeight: "bold", mb: '0!important' }}>
                    Partenaires de commerce
                </Typography>
            </div>
            <div className="body">
                <StyledMenuList>
                    <StyledMenuItem to="fournisseurs">
                        <GroupsIcon fontSize='small' className="icon" />
                        <Typography variant='caption'>
                            Fournisseurs
                        </Typography>
                    </StyledMenuItem>
                    <StyledMenuItem to="clients">
                        <GroupsIcon fontSize='small' className="icon" />
                        <Typography variant='caption'>
                            Clients
                        </Typography>
                    </StyledMenuItem>
                </StyledMenuList>
            </div>
            {/* <div className="footer">
                <div className="footer-tabs">
                    <Typography variant="caption">Informations</Typography>
                </div>
                <div className="footer-body"></div>
            </div> */}
        </StyledContainer>
    );
};

export default PartenaireAside;