import React, { useState, useEffect, useRef } from 'react';
import { styled, Box } from '@mui/system';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, IconButton, Typography, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ComboBox, Select } from '../../../Components';
import axios from 'axios';
import { selectAll as selectAllData, getMagasin, actions, getProductRow } from '../../../app/reducers/venteData';
import { fifo } from '../utilities/helpers';
import { convertQuantity, formatNumber } from "../../../utilities/helpers";

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

const StyledProduitContainer = styled('div')(() => ({
    margin: '0 10px',
    "& .block-header": {
        padding: '3px 10px',
        "& .actions": {
            margin: '5px 0'
        }
    }
}));


export default function SelectProduits({ open = true, onClose }) {
    const produits = useSelector(selectAllData);
    const [units, setUnits] = useState([]);
    const [entrees, setEntrees] = useState([]);
    const [produit, setProduit] = useState(null);
    const [quantite, setQuantite] = useState('');
    const [unit, setUnit] = useState('');
    const [pvUnitaire, setPvUnitaire] = useState(0);
    const [loadingData, setLoadingData] = useState(false);
    const [total, setTotal] = useState(0);
    const [totalMin, setTotalMin] = useState(0);
    const [errors, setErrors] = useState({});
    const [qDispo, setQDispo] = useState(0);
    const [entreesSortie, setEntreesSorties] = useState([]);
    const depot = useSelector(getMagasin);
    const rows = useSelector(getProductRow);
    const quantiteRef = useRef();
    const dispatch = useDispatch();

    const handleSelectUnit = (value) => {
        setUnit(value);
        const qD = convertQuantity(value, unit, qDispo);
        setQDispo(qD);
        const { prixTotal, prixTotalMin, entreeSortie, newEntrees } = fifo(entrees, quantite, value, unit);
        setTotal(formatNumber(prixTotal, 2, '.'));
        setTotalMin(prixTotalMin);
        setPvUnitaire(quantite && quantite !== '' ? formatNumber(prixTotal / quantite) : 0);
        setEntreesSorties(entreeSortie);
        if (quantite <= qD) {
            setErrors(err => ({ ...err, quantite: null }))
        } else {
            setErrors(err => ({ ...err, quantite: 'Vous ne pouvez vendre une quantité supérieur au stock disponible' }))
        }
    }

    const handleSelectProduit = value => {
        setProduit(value);
        handleErrorChange('produit', value);
        if (quantiteRef.current) {
            quantiteRef.current.focus();
        }
    }

    const handleQuantiteChange = (value) => {
        setQuantite(value);
        handleErrorChange('quantite', value);
        if (value > qDispo) {
            setErrors(err => ({ ...err, quantite: 'Vous ne pouvez vendre une quantité supérieur au stock disponible' }))
        }
        if (produit) {
            const { prixTotal, prixTotalMin, entreeSortie, newEntrees } = fifo(entrees, value, unit, unit);
            setTotal(formatNumber(prixTotal, 2, '.'));
            setTotalMin(prixTotalMin);
            setPvUnitaire(value && value !== '' ? formatNumber(prixTotal / value) : 0);
            setEntreesSorties(entreeSortie);
        }
    }

    const handleErrorChange = (label, val) => {
        if (val && val !== '') {
            if (label === 'quantite' && val > qDispo) {
                return;
            }
            setErrors(errors => ({ ...errors, [label]: '' }))
        }
    }

    const initAll = () => {
        setProduit(null);
        setPvUnitaire(0);
        setUnits([]);
        setUnit(null);
        setQuantite(0);
        setTotal(0);
        setTotalMin(0);
    }

    const handleConfirmData = () => {
        const errors = {};
        let valid = true;
        let rowP = {};
        if (!produit) {
            errors.produit = 'Séléctionnez un article';
            valid = false;
        }

        if (quantite > qDispo) {
            errors.quantite = 'Vous ne pouvez vendre une quantité supérieur au stock disponible';
            valid = false;
        } else if (quantite === '' || !quantite || parseFloat(quantite) === 0 || isNaN(parseFloat(quantite))) {
            errors.quantite = 'Veuillez inserer la quantité';
            valid = false;
        }

        if (valid) {
            rowP = {
                idProduit: produit.id,
                code: produit.code_produit,
                designation: produit.designation,
                pu: pvUnitaire,
                quantite,
                unit,
                tva: { taux: produit.tva, montant: parseFloat(formatNumber(total * produit.tva / 100, 2, '.')) },
                total,
                totalMin,
                entreesSorties: entreesSortie,
            }
        }
        return { valid, errors, rowP };
    }

    const handleAppendProduct = (e) => {
        e.preventDefault();
        const { valid, errors, rowP } = handleConfirmData();
        if (!valid) {
            setErrors(err => ({ ...err, ...errors }));
            return;
        }

        dispatch(actions.setProductRow(rowP));

        initAll();
    }

    const handleAppendProductAndClose = () => {
        const { valid, errors, rowP } = handleConfirmData();
        if (!valid) {
            setErrors(err => ({ ...err, ...errors }));
            return;
        }
        dispatch(actions.setProductRow(rowP));
        onClose();
    }

    useEffect(() => {
        if (produit && depot) {
            const qVendue = rows.reduce((prev, r) => {
                if (r.idProduit === produit.id) {
                    if (r.unit.type_unite === 'extra') {
                        console.log(r.unit);
                        return prev + parseFloat(r.quantite) / r.unit.equivalent;
                    }
                    return prev + parseFloat(r.quantite);
                }
                return prev;
            }, 0);
            setLoadingData(true);
            setQuantite('');
            setPvUnitaire(0);
            setTotal(0);
            axios
                .get(`https://def-api.herokuapp.com/api/depot/${depot.id}/vente/produits/${produit.id}`)
                .then(res => {
                    const d = res.data;
                    setUnits(d.units);
                    setUnit(d.units.find(u => u.type_unite === 'default'));
                    setEntrees(d.entrees);
                    setQDispo(d.entrees.reduce((a, b) => a + b.solde, 0) - qVendue);
                })
                .catch(err => console.log(err))
                .finally(() => { setLoadingData(false) });
        }
    }, [produit, depot]);

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
                        <Typography variant="caption">Ajout des articles achetés</Typography>
                        <div>
                            <IconButton sx={{ float: 'right' }} onClick={onClose}>
                                <CloseIcon fontSize='small' color='default' />
                            </IconButton>
                        </div>
                    </div>
                    <StyledForm onSubmit={handleAppendProduct}>
                        <Box mb={0.7} className="form-controle">
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="produit"
                                className="label"
                            >Article vendu<span className="star">*</span></Typography>
                            <ComboBox
                                id="produit"
                                options={produits}
                                value={produit}
                                optionLabel="designation"
                                setValue={handleSelectProduit}
                                placeholder="Séléctionnez l'article"
                                minWidth={100}
                                error={errors.produit ? true : false}
                                helperText={errors.produit}
                            />
                        </Box>
                        <Box mb={0.7} className="form-controle">
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="code"
                                className="label"
                                color="GrayText"
                            >Code Article</Typography>
                            <TextField
                                name="code"
                                id="code"
                                type="text"
                                value={produit ? produit.code_produit : ''}
                                onChange={e => setProduit(p => ({ ...p, code_produit: e.target.value }))}
                                placeholder="Désignation de l'article"
                                size="small"
                                sx={{ m: "5px 0" }}
                                className="star"
                                disabled
                                error={errors.code ? true : false}
                                helperText={errors.code}
                            />
                        </Box>
                        <Box mb={0.7} className="form-controle">
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="nom"
                                className="label"
                                color="GrayText"
                            >Designation</Typography>
                            <TextField
                                name="nom"
                                id="nom"
                                type="text"
                                value={produit ? produit.designation : ''}
                                onChange={e => setProduit(p => ({ ...p, desigantion: e.target.value }))}
                                placeholder="Désignation de l'article"
                                size="small"
                                sx={{ m: "5px 0" }}
                                className="star"
                                disabled
                                error={errors.designation ? true : false}
                                helperText={errors.designation}
                            />
                        </Box>
                        <Box mb={0.7} className="form-controle">
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="pu"
                                className="label"
                                color="GrayText"
                            >Prix unitaire</Typography>
                            <TextField
                                name="pu"
                                id="pu"
                                type="text"
                                value={pvUnitaire}
                                onChange={e => setPvUnitaire(e.target.value)}
                                placeholder="Prix unitaire"
                                size="small"
                                sx={{ m: "5px 0" }}
                                className="star"
                                disabled
                                error={errors.pu ? true : false}
                                helperText={errors.pu}
                            />
                        </Box>
                        <Box mb={0.7} className="form-controle">
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="unite"
                                className="label"
                            >Unité mésure<span className="star">*</span></Typography>
                            <Select
                                options={units}
                                value={unit}
                                optionLabel="nom_unite"
                                style={{ margin: 0 }}
                                onChange={
                                    handleSelectUnit
                                }
                            />
                        </Box>
                        <Box mb={0.7} className="form-controle">
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="quantite"
                                className="label"
                            >Quantité vendue<span className="star">*</span></Typography>
                            <TextField
                                name="quantite"
                                id="quantite"
                                type="number"
                                value={quantite}
                                onChange={e => {
                                    handleQuantiteChange(e.target.value);
                                    handleErrorChange('quantite', e.target.value);
                                }}
                                inputRef={quantiteRef}
                                size="small"
                                sx={{ m: "5px 0" }}
                                className="star"
                                error={errors.quantite ? true : false}
                                helperText={errors.quantite}
                            />
                        </Box>
                        <Box mb={0.7} className="form-controle">
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="tva"
                                className="label"
                                color="GrayText"
                            >Taux TVA</Typography>
                            <TextField
                                name="tva"
                                id="tva"
                                type="text"
                                value={produit ? produit.tva : ''}
                                onChange={e => setProduit(p => ({ ...p, tva: e.target.value }))}
                                size="small"
                                sx={{ m: "5px 0" }}
                                className="star"
                                disabled
                                error={errors.tva ? true : false}
                                helperText={errors.tva}
                            />
                        </Box>
                        <Box mb={0.7} className="form-controle">
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="prix_ttc"
                                className="label"
                                color="GrayText"
                            >Montant TTC</Typography>
                            <TextField
                                name="prix_ttc"
                                id="prix_ttc"
                                type="text"
                                value={total}
                                onChange={e => {
                                    setTotal(e.target.value);
                                }}
                                size="small"
                                sx={{ m: "5px 0" }}
                                className="star"
                                disabled
                                error={errors.pttc ? true : false}
                                helperText={errors.pttc}
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
                                type="submit"
                            >
                                Suivant
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                size="medium"
                                disableElevation
                                onClick={handleAppendProductAndClose}
                            >
                                Ajouter et fermer
                            </Button>
                        </div>
                    </StyledForm>
                </StyledContentContainer>
            </StyledContainer >
        </Modal >
    )
}
