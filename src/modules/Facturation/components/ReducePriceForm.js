import React, { useState, useRef, useEffect } from 'react';
import { styled, Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, IconButton, Typography, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { actions, getProductRow, selectReductions } from '../../../app/reducers/venteData';
import { formatNumber, getNumberFromInput } from '../../../utilities/helpers';
import Radio from '../../../Components/Inputs/Radio';

const StyledContainer = styled('div')(() => ({
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 20,
    '& input.Mui-disabled': {
        color: '#000000a8!important',
        textFillColor: '#000000a8!important'
    }
}));

const StyledContentContainer = styled('div')(() => ({
    backgroundColor: "#fff",
    width: "90vw",
    maxWidth: 700,
    height: "fit-content",
    overflowY: 'hidden',
    overflowX: 'auto',
    boxShadow: "0px 6px 20px 13px #52525257",
    border: "1px solid #b6b6b6",
    display: 'flex',
    flexDirection: 'column',
    "& .block-title": {
        fontWeight: 'bold',
    },
    "& .header": {
        padding: '6px 10px',
        borderBottom: '1px solid rgb(204, 204, 204)',
        backgroundColor: '#eeeeee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        "& > *": {
            flex: 1
        }
    },
    "& .body": {
        flex: 1,
        overflowY: 'auto',
    },
    "& .footer": {
        display: 'flex',
        justifyContent: 'center',
        padding: "10px 0",
        margin: '20px 10px',
        backgroundColor: '#eee',
        borderRadius: 7,
        "& > button": {
            margin: "0 10px"
        }
    }
}));

const StyledForm = styled('form')(() => ({
    padding: '15px 10px',
    width: 500,
    margin: 'auto',
    "& .form-block": {
        padding: '15px 10px',
        "&.colored-block": {
            backgroundColor: '#307ecc14',
            marginBottom: '15px'
        },
        "& > div": {
            display: 'flex',
            "& > *": {
                flex: 1
            },
        },
        "& .bordered-block": {
            border: '1px solid #eaeaea',
            borderRadius: 5,
            padding: '5px 15px',
        }
    },

    "& .form-controle": {
        display: 'flex',
        alignItems: 'center',
        "& > *": {
            flex: 1
        },
        "& > .label": {
            display: 'flex'
        },
        "& > div": {
            flex: 1.7,
            backgroundColor: '#fff',
        },
        "& .fournisseur": {
            display: 'flex',
            alignItems: 'center',
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: 3,
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
            "& > div": {
                flex: 1,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                margin: 0,
                fontSize: '14px!important',
                "& *": {
                    border: 'none'
                }
            },
            "& > button": {
                border: 'none',
                borderLeft: '1px solid rgba(0, 0, 0, 0.23)',
                backgroundColor: '#f5f5f5',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                padding: '7px 5px',
            },
            "&.error": {
                borderColor: 'red'
            }
        }
    },
    "& > div.star": {
        backgroundColor: '#e9e9e438',
    },
    "& span.star": {
        color: 'red',
        padding: '0 10px'
    }
}));

// const reductionTypes = [
//     {
//         id: 1,
//         label: 'Marchandage',
//         value: 'marchandage'
//     },
//     {
//         id: 2,
//         label: 'Rabais',
//         value: 'rabais'
//     },
//     {
//         id: 3,
//         label: 'Remise',
//         value: 'remise'
//     },
// ]


export default function ReducePriceForm({ open, onClose, rowData }) {
    const reductionTypes = useSelector(selectReductions);
    const [tauxReduction, setTauxReduction] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState(reductionTypes[0] ? reductionTypes[0] : null);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const rateInputRef = useRef();
    const [row, setRow] = useState({});
    const rows = useSelector(getProductRow);

    const handleErrorChange = (label, val) => {
        if (val && val !== '') {
            setErrors(errors => ({ ...errors, [label]: '' }))
        }
    }

    const handleRateChange = (val) => {
        const v = getNumberFromInput(val[val.length - 1], val).replace(',', '.');
        setTauxReduction(v);
        const taux = parseFloat(v === '' ? 0 : v);
        const amount = parseFloat(row.total) * taux / 100;
        setAmount(formatNumber(amount));
    }

    const handleAmountChange = (val) => {
        const a = getNumberFromInput(val[val.length - 1], val).replace(',', '.')
        setAmount(a);
        const amount = parseFloat(a === '' ? 0 : a);
        const taux = (amount / parseFloat(row.total)) * 100;
        setTauxReduction(formatNumber(taux));
    }

    const handleAppendProduct = (e) => {
        e.preventDefault();
        let valid = true;
        const errs = {};
        if (tauxReduction === '' || tauxReduction === 0) {
            valid = false;
            errs.taux = 'Ce champs est réquis et doit être > 0';
        }
        if (amount === '' || amount === 0) {
            valid = false;
            errs.amount = 'Ce champs est réquis et doit être > 0';
        }

        if (!valid) {
            setErrors(errs);
            return;
        }

        const rowP = {
            ...row,
            total: amount,
            reduction: {
                id: type.id,
                montant: amount,
                taux: tauxReduction
            }
        }
        dispatch(actions.addReduction(rowP));
        onClose();
    }

    useEffect(() => {
        const diff = row.total - row.totalMin;
        if (parseFloat(amount) > diff) {
            setErrors(errs => ({ ...errs, amount: 'La réduction doit être inférieure à ' + formatNumber(diff) }));
        } else {
            handleErrorChange('amount', amount);
        }
        if (parseFloat(tauxReduction) > 100) {
            setErrors(errs => ({ ...errs, taux: 'Le taux doit être inférieur à 100' }));
        } else {
            handleErrorChange('taux', tauxReduction);
        }
    }, [tauxReduction, amount]);

    useEffect(() => {
        let t = parseFloat(rowData.total);
        rows.forEach(r => {
            if (r.rowId === rowData.id) {
                t -= parseFloat(r.total);
            }
        });
        setRow({ ...rowData, total: t });
    }, []);

    return (
        <Modal
            open={open}
            BackdropProps={{
                style: {
                    backgroundColor: "#00000045",
                },
            }}
        >
            <StyledContainer>
                <StyledContentContainer>
                    <div className="header">
                        <Typography variant="caption">Réduction de prix sur produit vendu</Typography>
                        <div>
                            <IconButton sx={{ float: 'right' }} onClick={onClose}>
                                <CloseIcon fontSize='small' color='default' />
                            </IconButton>
                        </div>
                    </div>
                    <StyledForm onSubmit={handleAppendProduct}>
                        <Box px={1.5} py={1} mb={1} backgroundColor="#307ecc1f" borderRadius='5px' component="fieldset" border="1px solid #eaeaea">
                            <Typography
                                variant='caption'
                                component={"label"}
                                className="label"
                            >Type de réduction</Typography>
                            <Box display='flex' mt={1}>
                                {reductionTypes.map(t => (
                                    <Radio
                                        key={t.id}
                                        checked={t.id === type.id}
                                        onChange={() => setType(t)}
                                        label={t.type_reduction}
                                        value={t}
                                    />
                                ))}
                            </Box>
                        </Box>
                        <Box mb={0.7} className="form-controle">
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="nom"
                                className="label"
                                color="GrayText"
                            >Designation article</Typography>
                            <TextField
                                name="nom"
                                id="nom"
                                type="text"
                                defaultValue={row.designation}
                                size="small"
                                sx={{ m: "5px 0" }}
                                disabled
                            />
                        </Box>
                        <Box mb={0.7} className="form-controle">
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="pt"
                                className="label"
                                color="GrayText"
                            >Prix total</Typography>
                            <TextField
                                name="pt"
                                id="pt"
                                type="text"
                                defaultValue={row.total}
                                size="small"
                                sx={{ m: "5px 0" }}
                                disabled
                            />
                        </Box>
                        <Box mb={0.7} className="form-controle">
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="ptMin"
                                className="label"
                                color="GrayText"
                            >Prix total minimal</Typography>
                            <TextField
                                name="ptMin"
                                id="ptMin"
                                type="text"
                                defaultValue={row.totalMin}
                                size="small"
                                sx={{ m: "5px 0" }}
                                disabled
                            />
                        </Box>
                        <Box mb={0.7} className="form-controle">
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="tr"
                                className="label"
                            >Taux Réduction</Typography>
                            <TextField
                                inputRef={rateInputRef}
                                focused
                                name="tr"
                                id="tr"
                                type="text"
                                inputMode='decimal'
                                placeholder='Taux de la réduction en %ge'
                                value={tauxReduction}
                                onChange={e => handleRateChange(e.target.value)}
                                size="small"
                                sx={{ m: "5px 0" }}
                                className="star"
                                error={errors.taux ? true : false}
                                helperText={errors.taux}
                            />
                        </Box>
                        <Box mb={0.7} className="form-controle">
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="montantR"
                                className="label"
                            >Montant Réduction</Typography>
                            <TextField
                                name="montantR"
                                id="montantR"
                                type="text"
                                inputMode='decimal'
                                placeholder='Montant de la réduction'
                                value={amount}
                                onChange={e => {
                                    handleAmountChange(e.target.value);
                                }}
                                size="small"
                                sx={{ m: "5px 0" }}
                                className="star"
                                error={errors.amount ? true : false}
                                helperText={errors.amount}
                            />
                        </Box>
                        <div className="footer">
                            <Button
                                variant="outlined"
                                color="default"
                                size="medium"
                                onClick={onClose}
                            >
                                Annuler
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                size="medium"
                                disableElevation
                                type='submit'
                            >
                                Confirmer
                            </Button>
                        </div>
                    </StyledForm>
                </StyledContentContainer>
            </StyledContainer >
        </Modal >
    )
}
