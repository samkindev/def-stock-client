import React from 'react';
import { Modal } from '@mui/material';
import { minWidth, styled } from '@mui/system';

const StyledContainer = styled('div')(() => ({
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center'
}));

const StyledContentContainer = styled('div')(() => ({
    backgroundColor: '#fff',
    overflowY: 'hidden',
    boxShadow: "-10px 0px 30px 19px #52525257",
    border: "1px solid #b6b6b6",
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minWidth: '700px'
}));

export default function VisualizeProduct({ open, onClose, produit }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            BackdropProps={{
                style: {
                    backgroundColor: "#ffffff05",
                },
            }}
        >
            <StyledContainer>
                <StyledContentContainer>

                </StyledContentContainer>
            </StyledContainer>
        </Modal>
    )
}
