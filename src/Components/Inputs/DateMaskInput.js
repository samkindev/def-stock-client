import * as React from 'react';
import PropTypes from 'prop-types';
import { IMaskInput } from 'react-imask';
import TextField from '@mui/material/TextField';

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="00/00/0000"
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

function DateMaskInput({label, value, onChange, name, id, variant, ...other}) {
  return (
      <TextField
        {...other}
        label={label}
        value={value}
        onChange={onChange}
        name={name || "numberformat"}
        id={id}
        InputProps={{
          inputComponent: TextMaskCustom,
        }}
        variant={variant || "standard"}
      />
  );
}

export default React.memo(DateMaskInput);