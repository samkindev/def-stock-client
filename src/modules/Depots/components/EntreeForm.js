import React, { useState, useEffect, useContext } from 'react';
import { styled, Box } from '@mui/system';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, IconButton, Typography, TextField, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProduitEntreeTable from './ProduitEntreeTable';
import Radio from '../../../Components/Inputs/Radio';
import { selectById } from '../../../app/reducers/depot';
import { LargeDialog, Select } from '../../../Components';
import { actions, createEntreeDepot, getCreating, getErrors, getCount } from '../../../app/reducers/entree';
import { FeedbackContext } from '../../../App';
import { getDevise, getTaux } from '../../../app/reducers/auth'

const StyledContainer = styled('div')(() => ({
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 20,
}));

const StyledContentContainer = styled('div')(() => ({
    backgroundColor: "#fff",
    width: "97vw",
    maxWidth: 1500,
    height: "95vh",
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

const typesEntree = [
    {
        id: 1,
        label: 'Stock de début',
        value: 'stock de début'
    },
    {
        id: 2,
        label: 'Achat',
        value: 'achat'
    },
    {
        id: 3,
        label: 'Production/Manufacture',
        value: 'production'
    },
]

export default function EntreeForm({ open, onClose }) {
    const { id } = useParams();
    const monnaie = useSelector(getDevise);
    const taux = useSelector(getTaux);
    const depot = useSelector(state => selectById(state, id));
    const [numEntree, setNumEntree] = useState();
    const [refFacture, setRefFacture] = useState('');
    const [date, setDate] = useState(Date.now());
    const [fournisseur, setFournisseur] = useState({
        nom: '',
        adresse: ''
    });
    const [selectFourniseur, setSelectFournisseur] = useState(false);
    const [errors, setErrors] = useState({});
    const [entrees, setEntrees] = useState([]);
    const [typeEntree, setTypeEntree] = useState(typesEntree[1]);
    const [refBonCommande, setRefBonCommande] = useState('');
    const [refBonEntree, setRefBonEntree] = useState('');
    const [production, setProduction] = useState({
        lot: '',
        date: ''
    })
    const dispatch = useDispatch();
    const { createFeedback } = useContext(FeedbackContext);
    const saving = useSelector(getCreating);
    const serverErrors = useSelector(getErrors);
    const count = useSelector(getCount);

    const toggleSelectFournisseur = () => {
        setSelectFournisseur(!selectFourniseur);
    }

    const handleErrorChange = (label, val) => {
        if (val && val !== '') {
            setErrors(errors => ({ ...errors, [label]: '' }))
        }
    }

    const handleSelectTypeEntree = (value) => {
        setTypeEntree(value);
        setErrors(errors => ({ ...errors, refFacture: null }))
    }

    const validate = () => {
        let valid = true;
        let errors = {};

        if (typeEntree.id === 2 && refFacture === '') {
            valid = false;
            errors = { ...errors, refFacture: "La référence de la facture est réquise." }
        }
        if (typeEntree.id === 3 && production.lot === '') {
            valid = false;
            errors = ({ ...errors, lotProduction: "Le num du lot produit est réquis." });
        }
        if (typeEntree.id === 3 && production.date === '') {
            valid = false;
            errors = ({ ...errors, dateProduction: "La date de production est réquise." });
        }
        if (!date || date === '') {
            valid = false;
            errors = { ...errors, date: 'Mauvaise date d\'entrée.' }
        }
        if (entrees.length === 0) {
            valid = false;
            errors = { ...errors, table: "Insérer au moins une ligne dans le tableau." }
        }

        return [valid, errors];
    }

    const initAll = () => {
        setEntrees([]);
        setFournisseur({ nom: '', adresse: '' });
        setDate(new Date());
        setRefFacture('');
        setProduction({ lot: '', date: '' })
    }

    const handleSubmit = () => {
        const [valid, errors] = validate();
        setErrors(errors);
        if (!valid) {
            return;
        }


        const data = {
            type_entree: typeEntree.value,
            ref_facture: refFacture,
            ref_bon_entree: numEntree,
            date_transaction: date,
            nom_fournisseur: fournisseur.nom,
            adresse_fournisseur: fournisseur.adresse,
            taux_echange: taux,
            devise: monnaie,
            ref_bon_commande: refBonCommande,
            ref_bon_entree: refBonEntree,
            num_lot_produit: production.lot,
            date_production: production.date,
            produits: entrees.map(e => ({
                produitId: e.produit.id,
                marge: e.produit.marge,
                quantite: parseFloat(e.quantite),
                unite: {
                    id: e.unite.produit_unite.id,
                    equivalent: e.unite.produit_unite.equivalent,
                    type_unite: e.unite.produit_unite.type_unite,
                    defaultUnitId: e.produit.units.find(u => u.produit_unite.type_unite === 'default').id
                },
                pu: parseFloat(e.pu),
                pv_minim: parseFloat(e.pv_minimal),
                pv_unitaire: parseFloat(e.pv_unitaire),
                expiration: e.expiration,
                emplacement: e.emplacement.id,
                tva: e.tva
            }))
        }

        dispatch(createEntreeDepot({ depotId: id, data })).then(res => {
            const d = res.payload;
            if (d && d.status === 'success') {
                createFeedback(
                    "Enregistrement effectué avec succès !",
                    "nouvelle entrée en stock",
                    "success"
                );
                initAll();
            }
        });
    }

    useEffect(() => {
        setDate((new Date()).toLocaleDateString());
    }, []);

    useEffect(() => {
        if (count || count === 0) {
            setRefBonEntree(`BE${count + 1}/${depot.code_depot}`);
        }
    }, [count]);

    return (
        <Modal
            open={open}
            BackdropProps={{
                style: {
                    backgroundColor: "#00000005",
                },
            }}
        >
            <StyledContainer>
                {errors.table &&
                    <LargeDialog
                        agreeBtnText={"Ok"}
                        open={errors.table ? true : false}
                        title="Erreur"
                        message={errors.table}
                        onAgree={() => setErrors(errors => ({ ...errors, table: null }))}
                    />
                }
                {serverErrors &&
                    <LargeDialog
                        message={serverErrors}
                        agreeBtnText={"Ok"}
                        onAgree={() => {
                            dispatch(actions.clearErrors());
                        }}
                        open={serverErrors ? true : false}
                        title="Erreurs"
                    />
                }
                <StyledContentContainer>
                    <div className="header">
                        <Typography variant="caption">Fiche d'entrée produit</Typography>
                        <Typography variant="caption" sx={{ textAlign: 'center' }}>{refBonEntree}</Typography>
                        <div>
                            <IconButton sx={{ float: 'right' }} onClick={onClose}>
                                <CloseIcon fontSize='small' color='default' />
                            </IconButton>
                        </div>
                    </div>
                    <div className="body">
                        <StyledForm>
                            <div className="form-block colored-block">
                                <div>
                                    <Box mr={8} mb={0.7} className="form-controle">
                                        <Typography
                                            sx={{ display: 'block', mr: 1.5 }}
                                            variant='caption'
                                            component={"label"}
                                            htmlFor="fact"
                                            className="label"
                                        >Type d'entrée<span className="star">*</span></Typography>
                                        <Select
                                            options={typesEntree}
                                            value={typeEntree}
                                            style={{ margin: 0 }}
                                            onChange={
                                                handleSelectTypeEntree
                                            }
                                        />
                                    </Box>
                                    <div className='form-contole' />
                                </div>
                                <div style={{ alignItems: 'center' }}>
                                    <div>
                                        <Box mr={4} className="form-controle">
                                            <Typography
                                                sx={{ display: 'block', mr: 1.5 }}
                                                variant='caption'
                                                component={"label"}
                                                htmlFor="fact"
                                                className="label"
                                                color={typeEntree.id !== 2 ? "GrayText" : "CaptionText"}
                                            >Référence facture <span className="star" style={{ color: typeEntree.id !== 2 ? '#ff000021' : 'red' }}>*</span></Typography>
                                            <TextField
                                                name="fact"
                                                id="fact"
                                                type="text"
                                                value={refFacture}
                                                placeholder="Référence de la facture d'achat"
                                                onChange={e => {
                                                    setRefFacture(e.target.value);
                                                    handleErrorChange("refFacture", e.target.value);
                                                }}
                                                size="small"
                                                sx={{ m: "5px 0" }}
                                                className="star"
                                                disabled={typeEntree.id !== 2}
                                                error={errors.refFacture ? true : false}
                                                helperText={errors.refFacture}
                                            />
                                        </Box>
                                        <Box mr={4} className="form-controle">
                                            <Typography
                                                sx={{ display: 'block', mr: 1.5 }}
                                                variant='caption'
                                                component={"label"}
                                                htmlFor="date"
                                                className="label"
                                            >Date d'entrée <span className="star">*</span></Typography>
                                            <TextField
                                                name="date"
                                                id="date"
                                                type="date"
                                                value={date}
                                                onChange={e => {
                                                    setDate(e.target.value);
                                                    handleErrorChange("date", date);
                                                }}
                                                size="small"
                                                sx={{ m: "5px 0" }}
                                                className="star"
                                                error={errors.date ? true : false}
                                                helperText={errors.date}
                                            />
                                        </Box>
                                    </div>
                                    <div>
                                        <Box
                                            display="flex"
                                            border="none"
                                            py={1}
                                        >
                                            <Typography variant="caption">Monaie</Typography>
                                            <Box
                                                component="fieldset"
                                                display="flex"
                                                border="none"
                                                ml={2}
                                            >
                                                <Radio
                                                    label="USD"
                                                    value="usd"
                                                    checked={monnaie.toLowerCase() === 'usd'}
                                                    disabled={monnaie.toLowerCase() !== 'usd'}
                                                    sx={{ width: 'fit-content', mr: 2 }}
                                                />
                                                <Radio
                                                    label="CDF"
                                                    value="cdf"
                                                    checked={monnaie.toLowerCase() === 'cdf'}
                                                    disabled={monnaie.toLowerCase() !== 'cdf'}
                                                    sx={{ width: 'fit-content' }}
                                                />
                                            </Box>
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                            <Typography
                                                sx={{ display: 'block', mr: 1.5 }}
                                                variant='caption'
                                                component={"label"}
                                                htmlFor="taux"
                                                className="label"
                                            >Taux d'échange</Typography>
                                            <TextField
                                                name="taux"
                                                id="taux"
                                                inputMode='numeric'
                                                defaultValue={`${taux}Fc`}
                                                InputProps={{ readOnly: true }}
                                                size="small"
                                                sx={{ my: "5px", maxWidth: 105 }}
                                                error={errors.taux ? true : false}
                                                helperText={errors.taux}
                                            />
                                        </Box>
                                    </div>
                                </div>
                            </div>
                            {typeEntree.id !== 3 ?
                                <div className="form-block">
                                    <Typography variant="h2" className="block-title">
                                        Fournisseur
                                    </Typography>
                                    <div className="bordered-block">
                                        <Box mr={4} className="form-controle">
                                            <Typography
                                                sx={{ display: 'block', mr: 1.5, maxWidth: 'fit-content' }}
                                                variant='caption'
                                                component={"label"}
                                                htmlFor="nomfournisseur"
                                                className="label"
                                            >Nom fournisseur</Typography>
                                            <div className={`fournisseur ${errors.nomFournisseur && 'error'}`}>
                                                <TextField
                                                    name="nomfournisseur"
                                                    id="nomfournisseur"
                                                    type="text"
                                                    value={fournisseur.nom}
                                                    placeholder="Nom du fournisseur"
                                                    onChange={e => {
                                                        setFournisseur(f => ({ ...f, nom: e.target.value }));
                                                        handleErrorChange("nomFournisseur", fournisseur.nom);
                                                    }}
                                                    size="small"
                                                    sx={{ m: "5px 0" }}
                                                    className="star"
                                                    error={errors.nomFournisseur ? true : false}
                                                    helperText={errors.nomFournisseur}
                                                />
                                                <Button
                                                    variant="outlined"
                                                    color="default"
                                                    size="medium"
                                                    onClick={toggleSelectFournisseur}
                                                    sx={{ ml: 1 }}
                                                >Sélect. fournisseur</Button>
                                            </div>
                                        </Box>
                                        <div className="form-controle">
                                            <Typography
                                                sx={{ display: 'block', mr: 1.5, maxWidth: 'fit-content' }}
                                                variant='caption'
                                                component={"label"}
                                                htmlFor="address"
                                                className="label"
                                            >Adresse fournisseur</Typography>
                                            <TextField
                                                name="address"
                                                id="address"
                                                type="text"
                                                value={fournisseur.adresse}
                                                placeholder="adresse du fournisseur"
                                                onChange={e => {
                                                    setFournisseur(f => ({ ...f, adresse: e.target.value }));
                                                    handleErrorChange("adressFournisseur", fournisseur.addresse);
                                                }}
                                                size="small"
                                                sx={{ m: "5px 0" }}
                                                className="star"
                                                error={errors.adressFournisseur ? true : false}
                                                helperText={errors.adressFournisseur}
                                            />
                                        </div>
                                    </div>
                                </div> :
                                <div className="form-block">
                                    <Typography variant="h2" className="block-title">
                                        Données de production
                                    </Typography>
                                    <div className="bordered-block">
                                        <Box mr={4} className="form-controle">
                                            <Typography
                                                sx={{ display: 'block', mr: 1.5, maxWidth: 'fit-content' }}
                                                variant='caption'
                                                component={"label"}
                                                htmlFor="lotProduction"
                                                className="label"
                                            >Num. lot Produit<span className="star">*</span></Typography>
                                            <TextField
                                                name="lotProduction"
                                                id="lotProduction"
                                                type="text"
                                                value={production.lot}
                                                placeholder="Le numéro du lot des produits fabriqués"
                                                onChange={e => {
                                                    setProduction(p => ({ ...p, lot: e.target.value }));
                                                    handleErrorChange("lotProduction", production.lot);
                                                }}
                                                size="small"
                                                sx={{ m: "5px 0" }}
                                                className="star"
                                                error={errors.lotProduction ? true : false}
                                                helperText={errors.lotProduction}
                                            />
                                        </Box>
                                        <div className="form-controle">
                                            <Typography
                                                sx={{ display: 'block', mr: 1.5, maxWidth: 'fit-content' }}
                                                variant='caption'
                                                component={"label"}
                                                htmlFor="dateProd"
                                                className="label"
                                            >Date de production<span className="star">*</span></Typography>
                                            <TextField
                                                name="dateProd"
                                                id="dateProd"
                                                type="date"
                                                value={production.date}
                                                onChange={e => {
                                                    setProduction(p => ({ ...p, date: e.target.value }));
                                                    handleErrorChange("dateProduction", production.date);
                                                }}
                                                size="small"
                                                sx={{ m: "5px 0" }}
                                                className="star"
                                                error={errors.dateProduction ? true : false}
                                                helperText={errors.dateProduction}
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                        </StyledForm>
                        <StyledProduitContainer>
                            <div className="block-header">
                                <Typography variant="h2" className="block-title">
                                    Produits / Articles approvisionnés
                                </Typography>
                            </div>
                            <ProduitEntreeTable rows={entrees} setRows={setEntrees} monnaie={monnaie} />
                        </StyledProduitContainer>
                    </div>
                    <div className="footer">
                        <Button
                            variant="outlined"
                            color="default"
                            onClick={onClose}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disableElevation
                            onClick={handleSubmit}
                            sx={{
                                minWidth: 192,
                                minHeight: 36.5
                            }}
                        >
                            {saving ?
                                <CircularProgress size={10} /> :
                                "Confirmer et enregistrer"
                            }
                        </Button>
                    </div>
                </StyledContentContainer>
            </StyledContainer >
        </Modal >
    )
}
