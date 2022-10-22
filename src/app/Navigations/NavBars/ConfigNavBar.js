import React from 'react';
import { Topbar } from '../../../Components';
import { styled } from '@mui/system';
import { NavLink } from 'react-router-dom';
import GroupsIcon from '@mui/icons-material/Groups';
import GrainIcon from '@mui/icons-material/Grain';
import StoreIcon from '@mui/icons-material/Store';
import WorkspacesIcon from '@mui/icons-material/Workspaces';

const StyledMenu = styled('menu')(() => ({
    display: 'flex',
    alignItems: 'center',
    flex: 1
}));

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(','),
    padding: '7px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#555',
    "& .text": {
        fontSize: 9
    },
    "& .line": {
        height: 3,
        marginTop: 2,
        width: '100%',
        backgroundColor: '#inherit',
    },
    "&:hover .line, &.active .line": {
        width: '100%',
        backgroundColor: theme.palette.primary.main
    },
    "&.active": {
        color: '#000'
    }
}));

export default function ConfigNavBar() {
    return (
        <Topbar title="Intranet et admin" paddingVertical={0}>
        </Topbar>
    )
}
