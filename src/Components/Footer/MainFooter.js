import React from 'react';
import {Box, Typography} from '@mui/material';

export default function MainFooter() {
    return (
        <Box className="footer" p={3}>
            <Box className="footer" display="flex" justifyContent="center" textAlign="center">
                <Typography variant="caption" color="GrayText">&copy; DGI tous droits reservés.</Typography>
            </Box>
        </Box>
    )
}
