import React, { useState } from 'react';
import { Button, IconButton, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import GridViewIcon from '@mui/icons-material/GridView';
import SearchIcon from '@mui/icons-material/Search';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { Box } from '@mui/system';

const StyledContainer = styled('div')(() => ({
    minHeight: 'calc(100vh - 56px)',
    display: 'flex',
    flexDirection: 'column',
    '& .header': {
        padding: '0 15px',
        display: 'flex',
        flexDirection: 'column',
        borderBottom: '1px solid #eaeaea',
        backgroundColor: '#fff',
        '& > div:first-of-type': {
            padding: '15px 0',
        },
        '& > div': {
            paddingBottom: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }
    },
    '& .body': {
        flex: 1,
        padding: 15
    }
}));

const StyledBox = styled(Box)(({ theme }) => ({
    border: "1px solid #eaeaea",
    borderRadius: 5,
    padding: "6.5px 14px",
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.palette.common.white,
}));

const StyledInput = styled("input")(() => ({
    border: "none",
    outline: 0,
    fontSize: 15,
    flex: 1,
    backgroundColor: "inherit",
}));


export default function Fournisseurs() {
    const [query, setQuery] = useState('');

    return (
        <StyledContainer>
            <div className='header'>
                <div>
                    <Link to="nouveau">
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            startIcon={<AddIcon />}
                        >
                            Ajouter un client
                        </Button>
                    </Link>
                    <StyledBox>
                        <StyledInput
                            placeholder="Rechercher..."
                            className="search-input"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <SearchIcon fontSize="small" color="disabled" />
                    </StyledBox>
                </div>
                <div>
                    <Box display='flex' alignItems="center">
                        <Button
                            variant="text"
                            color="default"
                            size="small"
                            endIcon={<EditIcon />}
                            sx={{ mr: 1 }}
                        >
                            Modifier
                        </Button>
                        <Button
                            variant="text"
                            color="default"
                            size="small"
                            endIcon={<DeleteOutlineIcon />}
                            sx={{ mr: 1 }}
                        >
                            Supprimer
                        </Button>
                        <Button
                            variant="text"
                            color="default"
                            size="small"
                            endIcon={<VisibilityOffOutlinedIcon />}
                            sx={{ mr: 1 }}
                        >
                            Desactiver
                        </Button>
                        <Button
                            variant="text"
                            color="default"
                            size="small"
                            endIcon={<VisibilityOutlinedIcon />}
                        >
                            Activer
                        </Button>
                    </Box>
                    <Box display='flex' alignItems="center">
                        <IconButton sx={{ mr: 1, p: 0.25, borderRadius: 0.5 }}>
                            <GridViewIcon />
                        </IconButton>
                        <IconButton sx={{ p: 0.25, borderRadius: 0.5 }}>
                            <FormatListBulletedIcon />
                        </IconButton>
                    </Box>
                </div>
            </div>
            <div className='body'>

            </div>
        </StyledContainer>
    )
}
