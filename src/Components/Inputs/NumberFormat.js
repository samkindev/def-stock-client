import * as React from "react";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import TextField from "@mui/material/TextField";

export const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
	props,
	ref
) {
	const { onChange, prefix, suffix, ...other } = props;

	return (
		<NumberFormat
			{...other}
			getInputRef={ref}
			onValueChange={(values) => {
				onChange({
					target: {
						name: props.name,
						value: values.value,
					},
				});
			}}
			thousandSeparator
			isNumericString
			prefix={prefix || ""}
			suffix={suffix || ""}
		/>
	);
});

NumberFormatCustom.propTypes = {
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

function FormatedInputs({ prefix, suffix, variant, value, onChange, placeholder, label, maxLength, ...other }) {
	return (
		<TextField
            {...other}
			label={label}
            placeholder={placeholder}
			value={value}
			onChange={onChange}
			name="numberformat"
			id="formatted-numberformat-input"
            inputProps={{maxLength: maxLength}}
			InputProps={{
				inputComponent: NumberFormatCustom
			}}
			variant={variant}
		/>
	);
}

export default React.memo(FormatedInputs);