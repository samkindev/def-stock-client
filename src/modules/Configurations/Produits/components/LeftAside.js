import { Button, Typography } from '@mui/material';
import { styled, Box } from '@mui/system';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAll as selectAllDepot } from '../../../../app/reducers/depot';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import { People } from '@mui/icons-material';

const StyledContainer = styled('div')(({ theme }) => ({
    width: 280,
    backgroundColor: "#0D1426",
    color: "#eee",
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    "& .header": {
        width: '100%',
        padding: 10
    },
    "& .body": {
        flex: 1,
        width: '100%',
        borderBottom: '1px solid rgb(204, 204, 204)',
    },
    "& .footer": {
        height: '20%',
        display: 'flex',
        flexDirection: 'column',
        "& .footer-tabs": {
            border: '1px solid #444',
            padding: '7px 10px'
        },
        "& .footer-body": {
            flex: 1
        }
    }
}));

const StyledDepotsList = styled('div')(() => ({
    padding: '10px 10px',
    maxHeight: '100%',
    overflowY: 'auto',
    borderTop: '1px solid #54545487',
}));

const StyledMenuItem = styled(NavLink)(() => ({
    display: 'flex',
    alignItems: 'center',
    padding: "10px",
    "&:hover": {
        textDecoration: 'underline',
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
const ConfigLeftAside = () => {
    const depotsList = useSelector(selectAllDepot);

    return (
        <StyledContainer>
            <div className="header">
                <Box width={"fit-content"} height={"50px"} marginBottom="20px">
                    <img src="/logo_white.svg" alt="logo" />
                </Box>
            </div>
            <div className="body">
                <StyledDepotsList>
                    <StyledMenuItem
                        to={`/configurations/produits`}
                        className={(navData) => navData.isActive ? "active" : ""}
                    >
                        <LocalGroceryStoreIcon
                            fontSize='small'
                            className="icon"
                            color="inherit"
                        />
                        <Typography variant="caption" color="inherit" className="small">
                            Produits / Articles
                        </Typography>
                    </StyledMenuItem>
                    <StyledMenuItem
                        to={`/configurations/depots`}
                        className={(navData) => navData.isActive ? "active" : ""}
                    >
                        <StoreMallDirectoryIcon
                            fontSize='small'
                            className="icon"
                            color="inherit"
                        />
                        <Typography variant="caption" color="inherit" className="small">
                            Configuration des dépôts
                        </Typography>
                    </StyledMenuItem>
                    <StyledMenuItem
                        to={`/configurations/partenaires/clients`}
                        className={(navData) => navData.isActive ? "active" : ""}
                    >
                        <People
                            fontSize='small'
                            className="icon"
                            color="inherit"
                        />
                        <Typography variant="caption" color="inherit" className="small">
                            Clients
                        </Typography>
                    </StyledMenuItem>
                    <StyledMenuItem
                        to={`/configurations/partenaires/fournisseurs`}
                        className={(navData) => navData.isActive ? "active" : ""}
                    >
                        <People
                            fontSize='small'
                            className="icon"
                            color="inherit"
                        />
                        <Typography variant="caption" color="inherit" className="small">
                            Fournisseurs
                        </Typography>
                    </StyledMenuItem>
                </StyledDepotsList>
            </div>
        </StyledContainer>
    );
};

export default ConfigLeftAside;