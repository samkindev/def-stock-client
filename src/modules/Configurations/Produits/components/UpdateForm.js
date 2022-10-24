import React, { useState, useContext, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Typography, Button, TextField, Checkbox, Fade, Chip, CircularProgress, Modal, IconButton } from '@mui/material';
import { styled, Box } from '@mui/system';
import ComboBox from '../../../../Components/Inputs/ComboBox';
import AddIcon from '@mui/icons-material/Add';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import { actions, updateProduct, getUpdating, getErrors, selectById } from '../../../../app/reducers/myProduct';
import LargeDialog from '../../../../Components/Dialogs/LargeDialog';
import { FeedbackContext } from '../../../../App';
import { Cancel, SettingsBackupRestore } from '@mui/icons-material';
import axios from 'axios';

const StyledContentContainer = styled("div")(() => ({
    backgroundColor: "#fff",
    width: "90vw",
    maxWidth: 1061,
    height: "90vh",
    overflowY: 'hidden',
    overflowX: 'auto',
    boxShadow: "0px 6px 20px 13px #52525257",
    border: "1px solid #b6b6b6",
    display: 'flex',
    flexDirection: 'column',
    "& .header": {
        padding: '6px 10px',
        borderBottom: '1px solid rgb(204, 204, 204)',
        backgroundColor: '#eeeeee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    "& .container": {
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        "&.loading": {
            justifyContent: 'center',
            alignItems: 'center'
        }
    }
}));
const StyledForm = styled('form')(() => ({
    flex: 1,
    padding: 10,
    minWidth: 900,
    "& .percent": {
        display: 'inline - flex',
        verticalAlign: 'center',
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
        padding: '5px 8px',
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderLeft: 'none',
        backgroundColor: '#eee',
        marginLeft: -2,
    },
    "& .flex-bloc": {
        display: 'flex',
        padding: '5px 20px',
        "& > *": {
            flex: 1,
        },
    },
    "& .produit-type": {
        display: 'flex',
        alignItems: 'center',
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: 3,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        paddingLeft: '8px',
        width: 300,
        "& > span": {
            flex: 1,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            width: 159,
            fontSize: '14px!important'
        },
        "& > button": {
            border: 'none',
            borderLeft: '1px solid rgba(0, 0, 0, 0.23)',
            backgroundColor: '#f5f5f5',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
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
            flex: 1.5,
            backgroundColor: '#fff',
        },
        "& > div.star": {
            backgroundColor: '#e9e9e438',
        },
        "& span.star": {
            color: 'red',
            padding: '0 10px'
        },
    },
    "& .check-controle": {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 5,
        "& > .label": {
            flex: 1,
            display: 'flex',
            marginLeft: 5,
            cursor: 'pointer'
        },
    },
    "& .more-units": {
        padding: "10px",
        marginLeft: '25px',
        border: '1px solid rgb(204, 204, 204)',
        borderRadius: 3,
        backgroundColor: '#eee',
        "& .chips-container": {
            marginBottom: 10
        }
    },
    "& .form-controle-vertical": {
        width: '100%',
        padding: '5px 0',
    },
    "& .colored-bloc": {
        backgroundColor: '#307ecc14',
        margin: '15px 0'
    },
    "& .more-attributes": {
        padding: '5px 20px',
        "& .other-attributes": {
            borderLeft: '4px solid #eaeaea',
            borderRight: '4px solid #eaeaea',
            padding: '20px',
        },
        "& .row": {
            display: 'grid',
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
            "& .form-controle": {
                flexDirection: 'column',
                alignItems: 'flex-start',
                "& .attr-nom": {
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'inherit',
                    "& button": {
                        padding: 0,
                        visibility: 'hidden'
                    },
                },
                "&:hover button": {
                    visibility: 'visible'
                },
            },
            "&.vertical": {
                display: "flex",
                flexDirection: 'column',
                "& > *": {
                    maxWidth: 350
                }
            }
        },
    },
    "& .footer": {
        display: 'flex',
        justifyContent: 'center',
        padding: "10px 0",
        margin: '20px 0',
        backgroundColor: '#eee',
        borderRadius: 7,
        "& > button": {
            margin: "0 10px"
        }
    }
}));

const StyledContainer = styled("div")(() => ({
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: "center",
    padding: '15px 0'
}));

export default function ProduitUpdateForm({ open, onClose }) {
    const { id } = useParams();
    const [units, setUnits] = useState([]);
    const [availableUnits, setAvailableUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    const produit = useSelector(state => selectById(state, id));
    const [produitType, setProduitType] = useState("");
    const [codebarre, setCodebarre] = useState("");
    const [nom, setNom] = useState("");
    const [code, setCode] = useState("");
    const [unit, setUnit] = useState(null);
    const [unitVariant, setUnitVariant] = useState('');
    const [marge, setMarge] = useState(0);
    const [minQ, setMinQ] = useState(0);
    const [emballage, setEmballage] = useState("");
    const [fabricant, setFabricant] = useState("");
    const [moreUnits, setMoreUnits] = useState(false);
    const [otherUnit, setOtherUnit] = useState(null);
    const [otherUnitVariant, setOtherUnitVariant] = useState('');
    const [otherUnits, setOtherUnits] = useState([]);
    const [description, setDescription] = useState("");
    const [moreAttributes, setMoreAttributes] = useState(false);
    const [otherAttributes, setOtherAttributes] = useState([]);
    const [maxQ, setMaxQ] = useState(0);
    const [nomAttribut, setNomAttribut] = useState("");
    const [valAttribut, setValAttribut] = useState("");
    const [amount, setAmount] = useState(0);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const saving = useSelector(getUpdating);
    const serverErrors = useSelector(getErrors);
    const { createFeedback } = useContext(FeedbackContext);
    const containerRef = useRef();
    const [hasModify, setHasModify] = useState(false);
    const [updateData, setUpdateData] = useState({});
    const [openUpdate, setOpenUpdate] = useState(false);

    const initAll = () => {
        setOtherAttributes([]);
        setMaxQ(0);
        setNomAttribut("");
        setValAttribut("");
        setAmount(0);
        setErrors({});
        setMoreUnits(false);
        setOtherUnit(null);
        setOtherUnits([]);
        setDescription("");
        setMoreAttributes(false);
        setNom("");
        setCode("");
        setUnit(null);
        setMarge(0);
        setMinQ(0);
        setEmballage("");
        setFabricant("");
        setHasModify(false);
    }

    const resetUnits = (unit, expand) => {
        let units;
        let status;
        if (unit.nom_unite === produit.unite) {
            if (moreUnits) {
                status = 'removed';
                if (produit.autre_unite_produits.length > 0) {
                    setHasModify(true);
                }
            } else {
                status = 'idle'
            };
        } else {
            status = 'removed';
        }
        setMoreUnits(expand);
        units =
            otherUnits
                .filter(u => u.status !== 'new')
                .map(u => ({
                    ...u,
                    status
                }));
        setOtherUnits(units);
        setOtherUnit(null);
    }

    const toggleMoreUnits = () => {
        resetUnits(unit, !moreUnits);
    }

    const toggleOpenUpdate = () => {
        setOpenUpdate(!openUpdate);
    }

    const recoverUnit = (id) => {
        if (otherUnits.some(u => u.id === id && (u.status === 'removed'))) {
            const u = otherUnits.map(u => {
                if (u.id === id) {
                    return {
                        ...u,
                        status: 'idle'
                    }
                }
                return u;
            });

            setOtherUnits(u);
        }
    }

    const appendOtherUnits = () => {
        if (otherUnit && otherUnit.id !== unit.id &&
            amount > 0
        ) {
            let u = [...otherUnits];
            u.push({
                ...otherUnit,
                equivalent: amount,
                status: 'new',
                specification: otherUnitVariant
            });
            setAvailableUnits(units.filter(u => u.id !== unit.id));
            setHasModify(true);
            setOtherUnits(u);
            setOtherUnit(null);
            setAmount(0);
        }
    }

    const handleSetUnit = (u) => {
        if ((u && !unit) || (u && unit && u.id !== unit.id)) {
            setUnit(u);
            resetUnits(u, u.nom_unite === produit.unite);
        } else {
            setMoreUnits(false);
            setOtherUnits([]);
            setOtherUnit(null);

        }
    }

    const handleSetOtherUnit = (u) => {
        if (u.id !== unit.id) {
            setOtherUnit(u);
        } else {
            setOtherUnit(null);
        }
    }

    const handleRemoveUnit = (unitId) => {
        if (unitId || unitId === 0) {
            let u = [];
            if (otherUnits.some(u => u.id === unitId && (u.status === 'idle' || u.status === 'changed'))) {
                u = otherUnits.map(u => {
                    if (u.id === unitId) {
                        return {
                            ...u,
                            status: 'removed'
                        }
                    }
                    return u;
                })
            } else {
                u = otherUnits.filter(u => u.id !== unitId);
            }
            setHasModify(true);
            setOtherUnits(u);
        }
    }

    const toggleMoreAttributes = () => {
        setMoreAttributes(!moreAttributes);
    }

    const handleAppendAttribute = () => {
        if (
            !otherAttributes
                .some(a => a.nom_attribut.toLowerCase() === nomAttribut.toLowerCase()) &&
            nomAttribut !== "" && valAttribut !== ""
        ) {
            setOtherAttributes(attr => ([
                ...attr, {
                    nom_attribut: nomAttribut,
                    valeur_attribut: valAttribut,
                    status: 'new'
                }
            ]));
            setHasModify(true);
            setNomAttribut("");
            setValAttribut("");
        }
    }

    const handleChangeAttributeValue = (e, nom_attribut) => {
        const v = e.target.value;
        let att = [...otherAttributes];
        att = att.map(a => {
            if (a.nom_attribut === nom_attribut) {
                return {
                    ...a,
                    valeur_attribut: v,
                    status: a.status === 'idle' ? 'changed' : a.status
                }
            }
            return a;
        });
        setHasModify(true);
        setOtherAttributes(att);
    }

    const removeAttribute = (nom) => {
        let attr = [];
        if (otherAttributes.some(a => a.nom_attribut === nom && (a.status === 'idle' || a.status === 'changed'))) {
            attr = otherAttributes.map(a => {
                if (a.nom_attribut === nom) {
                    const defaultData = produit.attribut_produits.find(da => da.id === a.id);
                    return {
                        ...defaultData,
                        status: "removed"
                    }
                }
                return a;
            })
        } else {
            attr = otherAttributes.filter(a => a.nom_attribut !== nom);
        }
        setHasModify(true);
        setOtherAttributes(attr);
    }
    const recoverAttribute = (nom) => {
        let attr = [];
        if (otherAttributes.some(a => a.nom_attribut === nom && (a.status === 'removed'))) {
            attr = otherAttributes.map(a => {
                if (a.nom_attribut === nom) {
                    return {
                        ...a,
                        status: 'idle'
                    }
                }
                return a;
            });
        }
        setOtherAttributes(attr);
    }

    const handleErrorChange = (label, val) => {
        if (val || val !== "" || (label === 'maxQ' && (val === 0 || val > minQ))) {
            setErrors(err => ({ ...err, [label]: null }));
        }
    }

    const validateData = () => {
        let valid = true;
        if (!produitType) {
            setErrors(err => ({ ...err, type: "Vous devez sélectionner une catégorie." }));
            return false;
        }
        if (nom === "") {
            setErrors(err => ({ ...err, nom: "Ce champs est réquis" }));
            valid = false;
        }
        if (code === "") {
            setErrors(err => ({ ...err, code: "Ce champs est réquis" }));
            valid = false;
        }
        if (!minQ || minQ < 1) {
            setErrors(err => ({ ...err, minQ: "Doit être > 0" }));
            valid = false;
        }
        if (maxQ > 0 && maxQ < minQ) {
            setErrors(err => ({ ...err, maxQ: "Doit être > Qté d'alerte." }));
            valid = false;
        } else {
            setErrors(err => ({ ...err, maxQ: null }));
        }
        if (!marge) {
            setErrors(err => ({ ...err, marge: "Doit être > 0" }));
            valid = false;
        }
        if (unit === "" || !unit) {
            setErrors(err => ({ ...err, unit: "Ce champs est réquis" }));
            valid = false;
        }

        return valid;
    }

    const handleSubmit = async () => {
        const valid = validateData();
        if (valid && hasModify) {
            const data = updateData;
            if (otherAttributes.length > 0) {
                let n = [], r = [], c = [];
                otherAttributes.forEach(a => {
                    if (a.status === 'new') {
                        n.push(a);
                    } else if (a.status === 'changed') {
                        c.push(a);
                    } else if (a.status === 'removed') {
                        r.push(a.id);
                    }
                });
                data.other_attributes = {
                    created: n,
                    removed: r,
                    changed: c
                }
            }

            if (otherUnits.length > 0) {
                let n = [], r = [];
                otherUnits.forEach(u => {
                    if (u.status === 'new') {
                        n.push({
                            equivalent: u.equivalent,
                            specification: u.specification,
                            id: u.id
                        });
                    } else if (u.status === 'removed') {
                        r.push(u.id);
                    }
                });

                data.other_units = {
                    created: n,
                    removed: r
                }
            }
            dispatch(updateProduct({ productId: produit.id, data })).then(res => {
                const d = res.payload;
                if (d && (d.status === 'success' || d.type === 'no-update')) {
                    toggleOpenUpdate();
                    onClose()
                    createFeedback(
                        d.type === 'no-update' ? "Toute les données sont déjà à jour." : "Mise à jour effectuée avec succès !",
                        "mise à jour d'un produit",
                        "success"
                    );
                }
            });
        } else {
            if (containerRef.current) {
                containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }

    const handleCancel = () => {
        initAll();
        onClose();
    }

    const toggleModify = (label, value) => {
        if (produit[label] !== value) {
            setHasModify(true);
            setUpdateData(d => ({
                ...d,
                [label]: value
            }));
        }
    }

    const initFormData = () => {
        if (produit) {
            setNom(produit.designation || "");
            setCode(produit.code_produit || "");
            setMinQ(produit.quantite_min || "");
            setMarge(produit.marge || "");
            setMaxQ(produit.quantite_max || 0);
            setUnit(produit.units.find(u => u.produit_unite.type_unite === 'default'));
            setDescription(produit.description_produit || "");
            setProduitType(produit.produit_type || "");
            setCodebarre(produit.codebarre_produit || "");
            setUnitVariant(produit.units.find(u => u.produit_unite.type_unite === 'default').specification)
            if (produit.attribut_produits.length > 0) {
                setMoreAttributes(true);
                setOtherAttributes(
                    produit.attribut_produits.map(a => ({
                        ...a,
                        status: 'idle'
                    }))
                )
            }
            if (produit.units.length > 0) {
                setMoreUnits(true);
                setOtherUnits(
                    produit.units.filter(u => u.produit_unite.type_unite !== 'default').map(u => ({
                        ...u,
                        status: 'idle'
                    }))
                );
            }
        }
        if (containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setOtherUnit(null);
        setAmount(0);
    }

    useEffect(() => {
        initFormData()
    }, [produit]);

    useEffect(() => {
        setLoading(true);
        axios.get('https://def-api.herokuapp.com/api/unite_produit').then(res => {
            const data = res.data;
            if (data instanceof Array && data.length > 0) {
                setUnits(data);
            }
        }).catch(err => {
            console.log(err);
        }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const avU = units.filter(u => otherUnits.every(oU => oU.id !== u.id));
        setAvailableUnits(avU);
    }, [units, otherUnits]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            BackdropProps={{
                style: {
                    backgroundColor: "#00000005",
                },
            }}
        >
            <StyledContainer>
                <StyledContentContainer>
                    {errors.type &&
                        <LargeDialog
                            message={errors.type}
                            agreeBtnText={"Ok"}
                            onAgree={() => {
                                setErrors(err => ({
                                    ...err,
                                    type: null
                                }))
                            }}
                            open={errors.type ? true : false}
                            title="Erreur de catégorie"
                        />}
                    {serverErrors &&
                        <LargeDialog
                            message={serverErrors}
                            agreeBtnText={"Ok"}
                            onAgree={() => {
                                dispatch(actions.clearErrors());
                            }}
                            open={serverErrors ? true : false}
                            title="Erreur"
                        />}
                    {openUpdate &&
                        <LargeDialog
                            message="Confirmez la mise à jour de ce produit."
                            agreeBtnText={"Confirmer"}
                            disagreeBtnText="Annuler"
                            onAgree={handleSubmit}
                            onDisagree={toggleOpenUpdate}
                            open={openUpdate}
                            title="Mise à jour"
                            loading={saving}
                        />}
                    <div className="header">
                        <Typography variant="caption" className="title">Mise à jour produit/Article</Typography>
                        <Button
                            variant="outlined"
                            color="default"
                            size="small"
                            onClick={handleCancel}
                        >Annuler</Button>
                    </div>
                    {loading ?
                        <div className='container loading'>
                            <CircularProgress size={20} color="default" />
                        </div> :
                        <div className="container">
                            <StyledForm ref={containerRef}>
                                <div className="flex-bloc">
                                    <Box className="form-controle" mr={4}>
                                        <Typography
                                            sx={{ display: 'block', mr: 1.5 }}
                                            variant='caption'
                                            component={"label"}
                                            htmlFor="unit"
                                            className="label"
                                        >Produit type<span className="star">*</span></Typography>
                                        <div className="produit-type">
                                            <Typography variant='caption'>{produitType}</Typography>
                                            <Button
                                                variant="outlined"
                                                color="default"
                                                size="medium"
                                                onClick={handleCancel}
                                                sx={{ ml: 1 }}
                                                disabled
                                            >Modifier</Button>
                                        </div>
                                    </Box>
                                    <div className="form-controle">
                                        <Typography
                                            sx={{ display: 'block', mr: 1.5 }}
                                            variant='caption'
                                            component={"label"}
                                            htmlFor="barre"
                                            className="label"
                                        >Code-barre produit</Typography>
                                        <TextField
                                            name="barre"
                                            id="barre"
                                            type="text"
                                            value={codebarre}
                                            onChange={e => {
                                                setCodebarre(e.target.value);
                                                handleErrorChange("codebarre", codebarre);
                                                toggleModify('codebarre', codebarre);
                                            }}
                                            size="small"
                                            sx={{ m: "5px 0" }}
                                            error={errors.codebarre ? true : false}
                                            helperText={errors.codebarre}
                                        />
                                    </div>
                                </div>
                                <div className="flex-bloc colored-bloc">
                                    <Box mr={4}>
                                        <div className="form-controle">
                                            <Typography
                                                sx={{ display: 'block', mr: 1.5 }}
                                                variant='caption'
                                                component={"label"}
                                                htmlFor="code"
                                                className="label"
                                            >Code produit <span className="star">*</span></Typography>
                                            <TextField
                                                name="code"
                                                id="code"
                                                type="text"
                                                value={code}
                                                onChange={e => {
                                                    setCode(e.target.value);
                                                    handleErrorChange("code", e.target.value);
                                                    toggleModify('code_produit', e.target.value)
                                                }}
                                                size="small"
                                                sx={{ m: "5px 0" }}
                                                className="star"
                                                error={errors.code ? true : false}
                                                helperText={errors.code}
                                            />
                                        </div>
                                        <div className="form-controle">
                                            <Typography
                                                sx={{ display: 'block', mr: 1.5 }}
                                                variant='caption'
                                                component={"label"}
                                                htmlFor="qmin"
                                                className="label"
                                            >Stock min. d'alerte <span className="star">*</span></Typography>
                                            <TextField
                                                name="minQ"
                                                id="qmin"
                                                type="number"
                                                value={minQ}
                                                inputProps={{ min: 0 }}
                                                onChange={e => {
                                                    setMinQ(e.target.value);
                                                    handleErrorChange("minQ", minQ);
                                                    toggleModify('quantite_min', e.target.value)
                                                }}
                                                size="small"
                                                sx={{ m: "5px 0" }}
                                                className="star"
                                                error={errors.minQ ? true : false}
                                                helperText={errors.minQ}
                                            />
                                        </div>
                                    </Box>
                                    <Box>
                                        <div className="form-controle">
                                            <Typography
                                                sx={{ display: 'block', mr: 1.5 }}
                                                variant='caption'
                                                component={"label"}
                                                htmlFor="nom"
                                                className="label"
                                            >Désignation produit <span className="star">*</span></Typography>
                                            <TextField
                                                name="nom"
                                                id="nom"
                                                type="text"
                                                value={nom}
                                                onChange={e => {
                                                    setNom(e.target.value);
                                                    handleErrorChange("nom", nom);
                                                    toggleModify('designation', e.target.value);
                                                }}
                                                size="small"
                                                sx={{ m: "5px 0" }}
                                                className="star"
                                                error={errors.nom ? true : false}
                                                helperText={errors.nom}
                                            />
                                        </div>
                                        <div className="form-controle">
                                            <Typography
                                                sx={{ display: 'block', mr: 1.5 }}
                                                variant='caption'
                                                component={"label"}
                                                htmlFor="marge"
                                                className="label"
                                            >Marge Bénéfice/unité <span className="star">*</span></Typography>
                                            <Box display="flex" alignItems="baseline" className="star">
                                                <TextField
                                                    name="marge"
                                                    id="marge"
                                                    type="number"
                                                    value={marge}
                                                    inputProps={{ min: 0, max: 100 }}
                                                    onChange={e => {
                                                        let v = e.target.value;
                                                        if (v > 100) v = 100;
                                                        setMarge(v);
                                                        handleErrorChange("marge", v);
                                                        toggleModify('marge', e.target.value)
                                                    }}
                                                    size="small"
                                                    sx={{ m: 0, flex: 1 }}
                                                    className="star"
                                                    error={errors.marge ? true : false}
                                                    helperText={errors.marge}
                                                />
                                                <Typography variant='caption' className="percent">
                                                    %
                                                </Typography>
                                            </Box>
                                        </div>
                                    </Box>
                                </div>
                                <div className="flex-bloc">
                                    <Box mr={4}>
                                        <div className="form-controle">
                                            <Typography
                                                sx={{ display: 'block', mr: 1.5 }}
                                                variant='caption'
                                                component={"label"}
                                                htmlFor="unit"
                                                className="label"
                                            >Unité de mésure<span className="star">*</span></Typography>
                                            <ComboBox
                                                id="unit"
                                                options={availableUnits}
                                                optionLabel="nom_unite"
                                                value={unit}
                                                setValue={(value) => {
                                                    handleSetUnit(value);
                                                    handleErrorChange("unit", unit);
                                                    toggleModify('unite', value ? value.nom_unite : null)
                                                }}
                                                minWidth={100}
                                                error={errors.unit ? true : false}
                                                helperText={errors.unit}
                                            />
                                        </div>
                                    </Box>
                                    <div className="form-controle">
                                        <Typography
                                            sx={{ display: 'block', mr: 1.5 }}
                                            variant='caption'
                                            component={"label"}
                                            htmlFor="unit_variante"
                                            className="label"
                                            color={unit === null ? "GrayText" : "CaptionText"}
                                        >Variante de l'unité</Typography>
                                        <TextField
                                            name="unit_variante"
                                            id="unit_variante"
                                            type="text"
                                            placeholder={`Ex. Bidon 20 litres`}
                                            value={unitVariant}
                                            disabled={unit === null ? true : false}
                                            onChange={e => {
                                                setUnitVariant(e.target.value);
                                            }}
                                            size="small"
                                            sx={{ m: "5px 0 0 0" }}
                                        />
                                    </div>
                                </div>
                                <div className="flex-bloc">
                                    <Box mr={4}>
                                        <div className="check-controle" style={{ maxWidth: 'fit-content' }}>
                                            <Checkbox
                                                id="o_units"
                                                color="default"
                                                checked={moreUnits}
                                                onChange={toggleMoreUnits}
                                                disabled={unit === null || unit === undefined}
                                                inputProps={{
                                                    "aria-label": "more units",
                                                }}
                                            />
                                            <Typography
                                                sx={{ display: 'block', mr: 1.5 }}
                                                variant='caption'
                                                color={unit === null ? "GrayText" : "CaptionText"}
                                                component={"label"}
                                                htmlFor="o_units"
                                                className="label"
                                            >Autres unités de mésure</Typography>
                                        </div>
                                        {moreUnits &&
                                            <Fade in={moreUnits}>
                                                <div className="more-units">
                                                    {otherUnits.length > 0 &&
                                                        <div className="chips-container">
                                                            {otherUnits.map((otherUnit, i) => (
                                                                <Chip
                                                                    key={"" + otherUnit.id + i.toString()}
                                                                    label={`${(otherUnit.produit_unite && otherUnit.produit_unite.specification !== '') ? otherUnit.produit_unite.specification : otherUnit.specification ? otherUnit.specification : otherUnit.nom_unite} => ${otherUnit.produit_unite.equivalent}`}
                                                                    color={otherUnit.status === 'removed' ? "default" : "primary"}
                                                                    variant="outlined"
                                                                    sx={{
                                                                        mr: 1
                                                                    }}
                                                                    deleteIcon={otherUnit.status === 'removed' ? <SettingsBackupRestore /> : <Cancel />}
                                                                    onDelete={
                                                                        otherUnit.status === 'removed' ?
                                                                            () => recoverUnit(otherUnit.id) :
                                                                            () => handleRemoveUnit(otherUnit.id)
                                                                    }
                                                                />
                                                            ))}
                                                        </div>
                                                    }
                                                    <div className="form-controle">
                                                        <Typography
                                                            sx={{ display: 'block', mr: 1.5 }}
                                                            variant='caption'
                                                            component={"label"}
                                                            htmlFor="o_unit2"
                                                            className="label"
                                                        >Mésure</Typography>
                                                        <ComboBox
                                                            options={availableUnits}
                                                            optionLabel="nom_unite"
                                                            id={"o_unit2"}
                                                            value={otherUnit}
                                                            setValue={handleSetOtherUnit}
                                                            minWidth={100}
                                                            textFieldXs={{
                                                                mt: 0,
                                                                mb: 0
                                                            }}
                                                        />
                                                        <Button
                                                            variant="outlined"
                                                            color="default"
                                                            size="medium"
                                                            endIcon={<AddIcon />}
                                                            onClick={appendOtherUnits}
                                                            sx={{ ml: 1, maxWidth: 'fit-content' }}
                                                        >Ajouter</Button>
                                                    </div>
                                                    {otherUnit &&
                                                        <Fade in={otherUnit ? true : false}>
                                                            <div>
                                                                <Box mt={1.5} alignItems="center" display="flex">
                                                                    <Typography variant="caption" component="label" htmlFor="amount">
                                                                        {unit && "1 " + unit.nom_unite + " = "}
                                                                    </Typography>
                                                                    <TextField
                                                                        name="amount"
                                                                        id="amount"
                                                                        type="number"
                                                                        value={amount}
                                                                        inputProps={{ min: 0 }}
                                                                        onChange={e => setAmount(e.target.value)}
                                                                        size="small"
                                                                        sx={{ mx: 1, maxWidth: 100, backgroundColor: '#fff' }}
                                                                    />
                                                                    <Typography variant="caption" component="label" htmlFor="amount">{otherUnit && otherUnit.nom_unite}</Typography>
                                                                </Box>
                                                                <div className="form-controle">
                                                                    <Typography
                                                                        sx={{ display: 'block', mr: 1.5 }}
                                                                        variant='caption'
                                                                        component={"label"}
                                                                        htmlFor="other_unit_variante"
                                                                        className="label"
                                                                    >Variante de l'unité</Typography>
                                                                    <TextField
                                                                        name="other_unit_variante"
                                                                        id="other_unit_variante"
                                                                        type="text"
                                                                        placeholder={`Ex. Bidon 20 litres`}
                                                                        value={otherUnitVariant}
                                                                        onChange={e => {
                                                                            setOtherUnitVariant(e.target.value);
                                                                        }}
                                                                        size="small"
                                                                        sx={{ m: "5px 0 0 0" }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Fade>
                                                    }
                                                </div>
                                            </Fade>
                                        }
                                    </Box>
                                    <div className="form-controle-vertical">
                                        <Typography
                                            sx={{ display: 'block' }}
                                            variant='caption'
                                            component={"label"}
                                            htmlFor="desc"
                                            className="label"
                                        >Commentaire</Typography>
                                        <TextField
                                            name="description"
                                            id="desc"
                                            type="text"
                                            placeholder="Une petite description du produit ou de l'article"
                                            multiline
                                            rows={2}
                                            fullWidth
                                            value={description}
                                            onChange={e => {
                                                setDescription(e.target.value);
                                                toggleModify('description_produit', e.target.value)
                                            }}
                                            size="small"
                                            sx={{ m: "5px 0" }}
                                            className="star"
                                        />
                                    </div>
                                </div>
                                <div className='more-attributes colored-bloc'>
                                    <Box display="flex" justifyContent='center' color="#222">
                                        <Button
                                            variant='text'
                                            color="inherit"
                                            endIcon={moreAttributes ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}
                                            onClick={toggleMoreAttributes}
                                            sx={{ minWidth: 210.7 }}
                                        >{moreAttributes ? "Moins" : "Plus"} de caractéristiques</Button>
                                    </Box>
                                    {moreAttributes &&
                                        <Fade in={moreAttributes}>
                                            <div className="other-attributes colored-bloc">
                                                <Typography
                                                    variant='h2'
                                                    className="title"
                                                    sx={{ mb: "20px!important" }}
                                                >Autres Atributs du produit / de l'article</Typography>
                                                <Box className="row">
                                                    <div className="form-controle">
                                                        <Typography
                                                            sx={{ display: 'block', mr: 1.5 }}
                                                            variant='caption'
                                                            component={"label"}
                                                            htmlFor="fab"
                                                            className="label"
                                                        >Fabricant</Typography>
                                                        <TextField
                                                            name="fabricant"
                                                            id="fab"
                                                            type="text"
                                                            fullWidth
                                                            value={fabricant}
                                                            onChange={e => {
                                                                setFabricant(e.target.value);
                                                                toggleModify('fabricant', e.target.value);
                                                            }}
                                                            size="small"
                                                            sx={{ m: "5px 0" }}
                                                        />
                                                    </div>
                                                    <div className="form-controle">
                                                        <Typography
                                                            sx={{ display: 'block', mr: 1.5 }}
                                                            variant='caption'
                                                            component={"label"}
                                                            htmlFor="emballage"
                                                            className="label"
                                                        >Emballage</Typography>
                                                        <TextField
                                                            name="emballage"
                                                            id="emballage"
                                                            type="text"
                                                            fullWidth
                                                            value={emballage}
                                                            onChange={e => {
                                                                setEmballage(e.target.value);
                                                                toggleModify('emballage', e.target.value);
                                                            }}
                                                            size="small"
                                                            sx={{ m: "5px 0" }}
                                                        />
                                                    </div>
                                                    <div className="form-controle">
                                                        <Typography
                                                            sx={{ display: 'block', mr: 1.5 }}
                                                            variant='caption'
                                                            component={"label"}
                                                            htmlFor="maxQ"
                                                            className="label"
                                                        >Quantité max.</Typography>
                                                        <TextField
                                                            name="maxQ"
                                                            id="maxQ"
                                                            type="number"
                                                            fullWidth
                                                            value={maxQ}
                                                            inputProps={{ min: minQ + 1 }}
                                                            onChange={e => {
                                                                setMaxQ(e.target.value);
                                                                handleErrorChange('maxQ', e.target.value);
                                                                toggleModify('quantite_max', e.target.value);
                                                            }}
                                                            size="small"
                                                            sx={{ m: "5px 0" }}
                                                            error={errors.maxQ ? true : false}
                                                            helperText={errors.maxQ}
                                                        />
                                                    </div>
                                                </Box>
                                                <Box className="row">
                                                    {otherAttributes.map(attribute => (
                                                        <div key={attribute.nom_attribut} className="form-controle">
                                                            <div className='attr-nom'>
                                                                <Typography
                                                                    sx={{ display: 'block', mr: 1.5 }}
                                                                    variant='caption'
                                                                    component={"label"}
                                                                    htmlFor={"" + attribute.id}
                                                                    className="label"
                                                                    color={attribute.status === "removed" ? "GrayText" : "inherit"}
                                                                >{attribute.nom_attribut}</Typography>
                                                                <IconButton onClick={() => attribute.status === "removed" ? recoverAttribute(attribute.nom_attribut) : removeAttribute(attribute.nom_attribut)}>
                                                                    {attribute.status === "removed" ?
                                                                        <SettingsBackupRestore fontSize='small' color="primary" /> :
                                                                        <Cancel fontSize='small' color="error" />
                                                                    }
                                                                </IconButton>
                                                            </div>
                                                            <TextField
                                                                name={attribute.nom_attribut}
                                                                id={"" + attribute.id}
                                                                type="text"
                                                                fullWidth
                                                                value={attribute.valeur_attribut}
                                                                disabled={attribute.status === "removed"}
                                                                onChange={e => {
                                                                    handleChangeAttributeValue(e, attribute.nom_attribut);
                                                                }}
                                                                size="small"
                                                                sx={{ m: "5px 0" }}
                                                            />
                                                        </div>
                                                    ))}
                                                </Box>
                                                <Box mt={2}>
                                                    <Typography
                                                        variant='h2'
                                                        className="title"
                                                        sx={{ mb: "20px!important" }}
                                                    >Ajouter des attributs</Typography>
                                                    <div className="row">
                                                        <div className="form-controle">
                                                            <Typography
                                                                sx={{ display: 'block', mr: 1.5 }}
                                                                variant='caption'
                                                                component={"label"}
                                                                htmlFor="nomAttribut"
                                                                className="label"
                                                            >Nom attribut</Typography>
                                                            <TextField
                                                                name="nomAttricut"
                                                                id="nomAttribut"
                                                                type="text"
                                                                fullWidth
                                                                value={nomAttribut}
                                                                onChange={e => setNomAttribut(e.target.value)}
                                                                size="small"
                                                                sx={{ m: "5px 0" }}
                                                            />
                                                        </div>
                                                        <div className="form-controle">
                                                            <Typography
                                                                sx={{ display: 'block', mr: 1.5 }}
                                                                variant='caption'
                                                                component={"label"}
                                                                htmlFor="valAttribut"
                                                                className="label"
                                                            >Valeur de l'attribut</Typography>
                                                            <TextField
                                                                name="valAttibut"
                                                                id="valAttribut"
                                                                type="text"
                                                                fullWidth
                                                                value={valAttribut}
                                                                onChange={e => setValAttribut(e.target.value)}
                                                                size="small"
                                                                sx={{ m: "5px 0" }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="outlined"
                                                        color="default"
                                                        size="medium"
                                                        endIcon={<AddIcon />}
                                                        onClick={handleAppendAttribute}
                                                        sx={{ mt: 1, maxWidth: 'fit-content' }}
                                                    >Ajouter</Button>
                                                </Box>
                                            </div>
                                        </Fade>
                                    }
                                </div>
                                <div className="footer">
                                    <Button
                                        variant="outlined"
                                        color="default"
                                        onClick={initFormData}
                                    >Réinitialiser le formulaire</Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={toggleOpenUpdate}
                                        disabled={!hasModify}
                                    >
                                        Enregistrer les modifications
                                    </Button>
                                </div>
                            </StyledForm>
                        </div>
                    }
                </StyledContentContainer>
            </StyledContainer>
        </Modal>
    )
}
