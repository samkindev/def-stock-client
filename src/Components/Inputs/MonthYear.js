import * as React from "react";
import TextField from "@mui/material/TextField";
import frLocale from "date-fns/locale/fr";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function ViewsDatePicker() {
	const [value, setValue] = React.useState(new Date());

	return (
		<LocalizationProvider locale={frLocale} dateAdapter={AdapterDateFns}>
			<DatePicker
				inputFormat="MMMM-yyyy"
				mask="__/__/____"
				views={["year", "month"]}
				minDate={new Date("2012-03-01")}
				maxDate={new Date("2023-06-01")}
				value={value}
				onChange={setValue}
				components={{
					OpenPickerIcon: ArrowDropDownIcon,
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						helperText={null}
						sx={{ 
                            m: 0,
                            border: "none",
                            "& fieldset": {
                                border: 'none'
                            }
                        }}
					/>
				)}
			/>
		</LocalizationProvider>
	);
}
