import React from "react";
import { Typography, Box, CircularProgress } from "@mui/material";

export default function Chargement({ message, sx, size }) {
	return (
		<Box
			textAlign="center"
			display="flex"
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
            sx={sx}
		>
			<Typography variant="body1" color="GrayText" sx={{ mb: 2 }}>
				{message}
			</Typography>
			<CircularProgress size={size || 40} color="primary" />
		</Box>
	);
}
