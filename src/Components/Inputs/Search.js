import React from "react";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { Search } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const SearchInput = ({ mb, value, onChange }) => {
	const StyledBox = styled(Box)(({ theme }) => ({
		border: "1px solid #eaeaea",
		borderRadius: 5,
		padding: "6.5px 14px",
		display: "flex",
		alignItems: "center",
		width: "100%",
		backgroundColor: theme.palette.common.white,
	}));

	const StyledInput = styled("input")(() => ({
		border: "none",
		outline: 0,
		fontSize: 15,
		flex: 1,
		backgroundColor: "inherit",
	}));
	return (
		<StyledBox mb={mb !== null || mb !== undefined ? mb : 2}>
			<StyledInput
				placeholder="Rechercher..."
				className="search-input"
				value={value}
				onChange={onChange}
			/>
			<Search fontSize="small" color="disabled" />
		</StyledBox>
	);
};

export const SearchAuctoComplete = ({
	minWidth,
	sx,
	value,
	setValue,
	options,
	placeholder,
	label,
	textFieldXs,
	error,
	helperText,
}) => {
	return (
		<Autocomplete
			id="combo-box"
			sx={{ minWidth: minWidth ? minWidth : 300, ...sx }}
			value={value}
			onChange={(event, newValue) => {
				setValue(newValue);
			}}
            popupIcon={<Search />}
			options={options || []}
			isOptionEqualToValue={(option, value) => option.id === value.id}
			autoHighlight
			getOptionLabel={(option) => option.label}
			renderInput={(params) => (
				<TextField
                    placeholder={placeholder || ""}
					{...params}
					label={label}
					sx={textFieldXs}
					error={error}
					helperText={helperText}
				/>
			)}
		/>
	);
};

export default React.memo(SearchInput);
