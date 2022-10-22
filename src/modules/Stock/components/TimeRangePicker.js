import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateRangePicker from "@mui/lab/DateRangePicker";
import Box from "@mui/material/Box";

export default function TimeRangePicker({ value, setValue }) {
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<DateRangePicker
				calendars={1}
				value={value}
				onChange={(newValue) => {
					setValue(newValue);
				}}
				renderInput={(startProps, endProps) => (
					<React.Fragment>
						<TextField {...startProps} />
						<Box sx={{ mx: 2 }}> to </Box>
						<TextField {...endProps} />
					</React.Fragment>
				)}
			/>
		</LocalizationProvider>
	);
}
