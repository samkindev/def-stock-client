import React, { useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { FeedbackContext } from "../../App";

export default function Feedback({ autoHideDuration }) {
	const { getFeedback, onClose } = useContext(FeedbackContext);
	const {
		openState: open,
		messageState: message,
		idState: id,
		typeState: type,
	} = getFeedback();
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		onClose();
	};

	const handleExited = () => {
		onClose();
	};

	return (
		<div>
			<Snackbar
				key={id}
				open={open}
				autoHideDuration={autoHideDuration || 6000}
				onClose={handleClose}
				TransitionProps={{ onExited: handleExited }}
			>
				<Alert
					onClose={handleClose}
					severity={type || "info"}
					sx={{ width: "100%" }}
					variant="filled"
					elevation={6}
				>
					{message}
				</Alert>
			</Snackbar>
		</div>
	);
}
