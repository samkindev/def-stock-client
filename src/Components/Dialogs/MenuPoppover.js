import * as React from "react";
import Popover from "@mui/material/Popover";

export default function MenuPopover({ open, handleClose, anchorEl, children, anchorOrigin, ...other }) {
	const id = open ? "menu-popover" : undefined;
	return (
		<Popover
			{...other}
			id={id}
			open={open}
			anchorEl={anchorEl}
			onClose={handleClose}
			anchorOrigin={anchorOrigin || {
				vertical: "bottom",
				horizontal: "left",
			}}
			BackdropProps={{ sx: { backgroundColor: 'rgba(0,0,0,0)' } }}
		>
			{children}
		</Popover>
	);
}
