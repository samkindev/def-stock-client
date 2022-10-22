import React, { useState } from 'react';
import { styled, Box } from '@mui/system';
import { Link, NavLink } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText, Typography, Avatar } from '@mui/material';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import StoreIcon from '@mui/icons-material/Store';

const StyledContainer = styled('div')(() => ({
    backgroundColor: '#eeeeee',
    position: 'fixed',
    left: 0,
    top: 54,
    bottom: 0,
    width: 280,
    overflowY: 'auto',
    borderRight: '1px solid rgb(204, 204, 204)',
    display: 'flex',
    flexDirection: 'column',
    "& .header": {
        width: '100%',
        borderBottom: '1px solid rgb(204, 204, 204)',
        padding: '15px',
        "& > div": {
            display: 'flex',
            alignItems: 'top',
            color: "#444",
            "& > div:last-child": {
                display: 'flex',
                flexDirection: 'column',
                marginLeft: 10,
            }
        }
    },
    "& a:hover": {
        textDecoration: 'underline',
        maxWidth: 'fit-content'
    },
    "& > menu": {
        flex: 1,
        backgroundColor: '#fafafa',
        "& .navlink": {
            borderRadius: 5,
            marginRight: 10,
            overflow: 'hidden',
            display: 'block',
            maxWidth: 'fit-content',
            marginBottom: 5
        },
        "& .active-navlink > div": {
            backgroundColor: '#d7d7d7',
        }
    }
}));


export default function SingleDepotAside({ depot }) {
    const [openProduit, setOpenProduit] = useState(true);
    return (
        <StyledContainer>
            <div className='header'>
                <div>
                    <Avatar>
                        <StoreIcon fontSize="large" color="inherit" />
                    </Avatar>
                    <div>
                        <Typography variant='caption' sx={{ my: 0 }}>
                            {`(${depot.code_depot})${depot.nom_depot}`}
                        </Typography>
                        <Typography variant='caption' className='small' sx={{ my: 0 }}>
                            Stock {depot.type_stock}
                        </Typography>
                        <Link to={`/configurations/depots/${depot.id}`}>
                            <Typography variant='caption' className="small" color="primary" sx={{ my: 0, textDecoration: 'inherit' }}>
                                Détails
                            </Typography>
                        </Link>
                    </div>
                </div>
            </div>
            <menu>
                <ListItemButton
                    alignItems='center'
                    onClick={() => setOpenProduit(!openProduit)}
                    color="#333"
                >
                    <ListItemIcon
                        sx={{
                            minWidth: "fit-content",
                            marginRight: 1.5,
                            marginTop: 0,
                        }}
                    >
                        <Inventory2Icon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText
                        primary="Stocks des produits"
                        primaryTypographyProps={{
                            noWrap: true,
                            variant: 'caption',
                            fontSize: 17,
                        }}
                        secondaryTypographyProps={{
                            noWrap: true,
                            variant: 'caption',
                            fontSize: 12,
                        }}
                        sx={{
                            my: 0,
                        }}
                    />
                    <KeyboardArrowDown
                        sx={{
                            // opacity: openProduit ? 1 : 0,
                            transform: openProduit
                                ? "rotate(-180deg)"
                                : "rotate(0)",
                            transition: "0.2s",
                        }}
                    />
                </ListItemButton>
                {openProduit && (
                    <Box pl={4.5}>
                        <NavLink
                            to="produits"
                            className={({ isActive }) =>
                                isActive ? "navlink active-navlink" : "navlink"
                            }
                        >
                            <ListItemButton >
                                <ListItemText
                                    primary="En stock"
                                    primaryTypographyProps={{
                                        fontSize: 13,
                                        fontWeight: "medium",
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis'
                                    }}
                                    sx={{
                                        my: 0,
                                        maxWidth: 'fit-content'
                                    }}
                                />
                            </ListItemButton>
                        </NavLink>
                        <NavLink
                            to="entrees"
                            className={({ isActive }) =>
                                isActive ? "navlink active-navlink" : "navlink"
                            }
                        >
                            <ListItemButton>
                                <ListItemText
                                    primary="Entrées en stock"
                                    primaryTypographyProps={{
                                        fontSize: 13,
                                        fontWeight: "medium",
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                    }}
                                    sx={{
                                        my: 0,
                                        maxWidth: 'fit-content'
                                    }}
                                />
                            </ListItemButton>
                        </NavLink>
                        <NavLink
                            to="sorties"
                            className={({ isActive }) =>
                                isActive ? "navlink active-navlink" : "navlink"
                            }
                        >
                            <ListItemButton>
                                <ListItemText
                                    primary="Sorties de stock"
                                    primaryTypographyProps={{
                                        fontSize: 13,
                                        fontWeight: "medium",
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                    }}
                                    sx={{
                                        my: 0,
                                        maxWidth: 'fit-content'
                                    }}
                                />
                            </ListItemButton>
                        </NavLink>
                    </Box>
                )}
            </menu>
        </StyledContainer>
    )
}
