import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

function ComboBox({
	options,
	label,
	minWidth,
	value,
	setValue,
	placeholder,
	textFieldXs = {},
	error,
	helperText,
	sx,
	disabled,
	id,
	optionLabel = "label"
}) {
	return (
		<Autocomplete
			id={id || "combo-box"}
			sx={{
				minWidth: minWidth ? minWidth : 300, ...sx,
			}}
			disabled={disabled}
			value={value}
			disableClearable
			ListboxProps={{
				style: { fontSize: 13 },
			}}
			onChange={(event, newValue) => {
				setValue(newValue);
			}}
			options={options || []}
			isOptionEqualToValue={(option, value) => option.id === value.id}
			autoHighlight
			getOptionLabel={(option) => option[optionLabel]}
			renderInput={(params) => (
				<TextField
					placeholder={placeholder || ""}
					{...params}
					label={label}
					sx={{
						...textFieldXs,
						"& .MuiOutlinedInput-root.MuiInputBase-sizeSmall": {
							p: textFieldXs.p
						}
					}}
					error={error}
					helperText={helperText}
				/>
			)}
		/>
	);
}

export default React.memo(ComboBox);
