import { Button, Typography } from '@mui/material';
import { styled, Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAll as selectAllDepot } from '../../../../app/reducers/depot';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import { dateCompare } from '../../../../utilities/helpers';
import { Search as SearchIcon } from "@mui/icons-material";

const StyledContainer = styled('div')(() => ({
    width: 280,
    backgroundColor: '#eeeeee',
    position: 'fixed',
    left: 0,
    top: 54,
    bottom: 0,
    overflowY: 'auto',
    borderRight: '1px solid rgb(204, 204, 204)',
    display: 'flex',
    flexDirection: 'column',
    "& .header": {
        width: '100%',
        borderBottom: '1px solid rgb(204, 204, 204)',
        padding: 10
    },
    "& .body": {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
        borderBottom: '1px solid rgb(204, 204, 204)',
    },
    "& .footer": {
        height: '20%',
        display: 'flex',
        flexDirection: 'column',
        "& .footer-tabs": {
            border: '1px solid rgb(232 227 227)',
            padding: '7px 10px'
        },
        "& .footer-body": {
            backgroundColor: '#ffffff69',
            flex: 1
        }
    }
}));

const StyledDepotsList = styled('div')(() => ({
    padding: '10px 10px',
    maxHeight: '100%',
    overflowY: 'auto'
}));

const StyledDepotItem = styled(NavLink)(() => ({
    display: 'flex',
    alignItems: 'center',
    color: '#333',
    // marginBottom: 10,
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

const StyledActionBar = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    "& .action": {
        marginRight: 5,
        padding: 4,
        border: '1px solid #d4d3d3',
        borderRadius: 3,
        display: 'flex',
        maxWidth: 'fit-content',
        maxHeight: 'fit-content',
        color: '#111',
        cursor: 'pointer',
        "&:hover": {
            backgroundColor: '#e0dede',

        },
        "&.active": {
            color: theme.palette.primary.main,
            backgroundColor: '#e0dede',

        }
    },
}));

const StyledBox = styled(Box)(({ theme }) => ({
    border: "1px solid #eaeaea",
    borderRadius: 5,
    padding: "6.5px 14px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    backgroundColor: theme.palette.common.white,
}));

const StyledInput = styled("input")(() => ({
    border: "none",
    outline: 0,
    fontSize: 15,
    flex: 1,
    backgroundColor: "inherit",
}));

const ConfigLeftAside = () => {
    const depotsList = useSelector(selectAllDepot);
    const [depots, setDepots] = useState([]);
    const [sorted, setSorted] = useState(true);
    const [query, setQuery] = useState('');

    const toggleSort = () => {
        setSorted(!sorted);
    }

    useEffect(() => {
        let dpts = [...depotsList];
        if (sorted) {
            dpts.sort((a, b) => {
                if (a.nom_depot < b.nom_depot) {
                    return -1;
                } else if (a.nom_depot > b.nom_depot) {
                    return 1;
                } else {
                    return 0;
                }
            });
        } else {
            dpts.sort((a, b) => dateCompare(a.createdAt, b.createdAt));
        }

        setDepots(dpts);
    }, [sorted]);

    useEffect(() => {
        let dpts = [];
        if (query !== "") {
            dpts = depotsList.filter((depot) => depot.nom_depot.toLowerCase().includes(query.toLocaleLowerCase()));
        } else {
            dpts = [...depotsList];
        }

        setDepots(dpts);
    }, [query]);
    return (
        <StyledContainer>
            <div className="header">
                <Typography variant="h2" sx={{ fontWeight: "bold" }}>
                    Dépots/Magasins
                </Typography>
                <Link to="">
                    <Button
                        disableElevation
                        variant='outlined'
                        color="primary"
                        size='medium'
                        type="submit"
                        sx={{
                            mb: 1.5
                        }}
                    >Créer nouveaux depots</Button>
                </Link>
                <StyledBox mb={2}>
                    <StyledInput
                        placeholder="Rechercher..."
                        className="search-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <SearchIcon fontSize="small" color="disabled" />
                </StyledBox>
                <StyledActionBar>
                    <span className={`action ${sorted && "active"}`} onClick={toggleSort}>
                        <SortByAlphaIcon color="inherit" fontSize="small" sx={{ fontSize: '1.15rem' }} />
                    </span>
                </StyledActionBar>
            </div>
            <div className="body">
                <StyledDepotsList>
                    {depots.map(depot => (
                        <StyledDepotItem
                            to={`/configurations/depots/${depot.id}`}
                            key={depot.id}
                            className={(navData) => navData.isActive ? "active" : ""}
                        >
                            <StoreMallDirectoryIcon
                                fontSize='small'
                                className="icon"
                                color="inherit"
                            />
                            <Typography variant="caption" color="inherit" className="small">
                                {depot.nom_depot}
                            </Typography>
                        </StyledDepotItem>
                    ))}
                </StyledDepotsList>
            </div>
            <div className="footer">
                <div className="footer-tabs">
                    <Typography variant="caption">Informations</Typography>
                </div>
                <div className="footer-body"></div>
            </div>
        </StyledContainer>
    );
};

export default ConfigLeftAside;