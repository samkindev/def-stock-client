import React from 'react';
import { styled } from '@mui/system';
import { IconButton, Modal, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StyledContainer = styled('div')(() => ({
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 40,
}));

const StyledContentContainer = styled('div')(() => ({
    backgroundColor: "#fff",
    width: "90vw",
    maxWidth: 950,
    height: "80vh",
    overflowY: 'hidden',
    overflowX: 'auto',
    boxShadow: "-10px 0px 30px 19px #52525257",
    border: "1px solid #b6b6b6",
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    "& .block-title": {
        fontWeight: 'bold',
    },
    "& .header": {
        padding: '6px 10px',
        borderBottom: '1px solid rgb(204, 204, 204)',
        backgroundColor: '#eeeeee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    "& .footer": {
        display: 'flex',
        justifyContent: 'center',
        padding: "10px 0",
        margin: '20px 10px',
        backgroundColor: '#eee',
        borderRadius: 7,
        "& > button": {
            margin: "0 10px"
        }
    }
}));

const StyledForm = styled('form')(() => ({
    padding: '15px 10px',
    "& .form-block": {
        padding: '15px 10px',
        "&.colored-block": {
            backgroundColor: '#eeeeee42',
            marginBottom: '15px'
        },
        "& > div": {
            display: 'flex',
            "& > *": {
                flex: 1
            },
        },
        "& .bordered-block": {
            border: '1px solid #eaeaea',
            borderRadius: 5,
            padding: '5px 15px',
        }
    },

    "& .form-controle": {
        display: 'flex',
        alignItems: 'center',
        "& > *": {
            flex: 1
        },
        "& > .label": {
            display: 'flex'
        },
        "& > div": {
            flex: 1.7,
            backgroundColor: '#fff',
        },
        "& > div.star": {
            backgroundColor: '#e9e9e438',
        },
        "& span.star": {
            color: 'red',
            padding: '0 10px'
        }
    },
}));


export default function AddProduitForm({ open, onClose }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            BackdropProps={{
                style: {
                    backgroundColor: "#00000035",
                },
            }}
        >
            <StyledContainer>
                <StyledContentContainer>
                    <div className="header">
                        <Typography variant="caption">Ajouter produits</Typography>
                        <IconButton onClick={onClose}>
                            <CloseIcon fontSize='small' color='default' />
                        </IconButton>
                    </div>
                </StyledContentContainer>
            </StyledContainer>
        </Modal>
    )
}
