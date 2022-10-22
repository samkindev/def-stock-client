import React from 'react';
import { CircularProgress, Modal } from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled("div")(() => ({
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: "center",
    alignItems: 'center',
    padding: '15px 0',
    "& .content": {
        backgroundColor: "#fff",
        width: "200px",
        height: "80px",
        overflowY: "hidden",
        padding: "0px 0",
        boxShadow: "-10px 0px 30px 19px #52525257",
        border: "3px solid #b6b6b6",
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

export default function LoadingModal({ open }) {
    return (
        <Modal
            open={open}
            BackdropProps={{
                style: {
                    backgroundColor: "#00000010",
                },
            }}
        >
            <StyledContainer>
                <div className='content'>
                    <CircularProgress size={35} color="default" />
                </div>
            </StyledContainer>
        </Modal>
    )
}
