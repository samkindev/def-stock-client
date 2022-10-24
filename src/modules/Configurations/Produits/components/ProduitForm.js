import React, { useState, useContext, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Button, TextField, Checkbox, Fade, Chip, CircularProgress } from '@mui/material';
import { styled, Box } from '@mui/system';
import ComboBox from '../../../../Components/Inputs/ComboBox';
import AddIcon from '@mui/icons-material/Add';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import { actions, createProduct, getCreatingState, getErrors } from '../../../../app/reducers/myProduct';
import LargeDialog from '../../../../Components/Dialogs/LargeDialog';
import { FeedbackContext } from '../../../../App';
import axios from 'axios';

const StyledContainer = styled("div")(({ theme }) => ({
    padding: 20,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    "& .container": {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        "&.loading": {
            justifyContent: 'center',
            alignItems: 'center'
        }
    },
    "& form": {
        flex: 1,
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
            }
        },
        "& .check-controle": {
            display: 'flex',
            alignItems: 'center',
            padding: '5px 20px',
            "& > .label": {
                flex: 1,
                display: 'flex',
                marginLeft: 5,
                cursor: 'pointer'
            },
        },
        "& .more-units": {
            padding: "10px",
            margin: '10px 25px',
            maxWidth: 420,
            border: '1px solid rgb(204, 204, 204)',
            borderRadius: 5,
            backgroundColor: '#bfd8fb17',
            "& *": {
                // backgroundColor: 'inherit',
                // color: '#fff',
                // borderColor: '#fff'
            },
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

const productUnits = [
    {
        id: 0,
        label: 'Carton',
        nom_unite: 'carton',
    },
    {
        id: 1,
        label: 'Pièce',
        nom_unite: 'pièce',
    },
    {
        id: 2,
        label: 'Bouteil',
        nom_unite: 'bouteil',
    },
    {
        id: 3,
        label: 'Bidon',
        nom_unite: 'bidon',
    },
    {
        id: 4,
        label: 'Tas',
        nom_unite: 'tas',
    },
]

export default function ProduitForm({ produitType, onClose }) {
    const [loading, setLoading] = useState(false);
    const [unites, setUnites] = useState([]);
    const [availableUnites, setAvailableUnites] = useState([]);
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
    const saving = useSelector(getCreatingState);
    const serverErrors = useSelector(getErrors);
    const { createFeedback } = useContext(FeedbackContext);
    const containerRef = useRef();

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
    }

    const toggleMoreUnits = () => {
        setOtherUnits([]);
        setOtherUnit(null);
        setMoreUnits(!moreUnits);
    }

    const appendOtherUnits = () => {
        if (otherUnit &&
            otherUnit.id !== unit.id &&
            amount > 0
        ) {
            let u = [...otherUnits];
            u.push({
                nom_unite: otherUnit.nom_unite,
                equivalent: amount,
                specification: otherUnitVariant,
                id: otherUnit.id
            });
            setAvailableUnites(unites.filter(u => u.id !== unit.id));
            setOtherUnits(u);
            setOtherUnit(null);
            setAmount(0);
            setOtherUnitVariant('');
        }
    }

    const handleSetUnit = (unit) => {
        if (unit) {
            setUnit(unit);
            setAvailableUnites(unites.filter(u => u.id !== unit.id));
        } else {
            setMoreUnits(false);
            setOtherUnits([]);
            setOtherUnit(null);

        }
    }

    const handleSetMoreUnit = (unit) => {
        if (unit) {
            setOtherUnit(unit);
        }
    }

    const handleRemoveUnit = (unitId) => {
        if (unitId || unitId === 0) {
            let u = otherUnits.filter(u => u.id !== unitId);
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
                }
            ]));
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
                    valeur_attribut: v
                }
            }
            return a;
        });

        setOtherAttributes(att);
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
        if (valid) {
            const data = {
                designation: nom,
                code,
                unite: {
                    id: unit.id,
                    specification: unitVariant
                },
                quantite_min: minQ,
                quantite_max: maxQ > minQ ? maxQ : null,
                marge,
                description,
                fabricant,
                emballage,
                produit_type: produitType.id,
            }

            if (otherAttributes.length > 0) {
                data.other_attributes = otherAttributes;
            }

            if (otherUnits.length > 0) {
                data.other_units = otherUnits.map(u => ({
                    equivalent: u.equivalent,
                    specification: u.specification,
                    id: u.id
                }));
            }

            dispatch(createProduct(data)).then(res => {
                const d = res.payload;
                if (d.status === 'success') {
                    createFeedback(
                        "Création effectuée avec succès !",
                        "creation d'un produit",
                        "success"
                    );
                    initAll();
                }
            });
        } else {
            if (containerRef.current) {
                containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }

    const onFormClick = () => {
        if (!produitType) {
            setErrors(err => ({ ...err, type: "Vous devez sélectionner une catégorie dans la barre gauche." }));
        }
    }

    const handleCancel = () => {
        initAll();
        onClose();
    }

    useEffect(() => {
        if (moreAttributes && containerRef.current) {
            containerRef.current.scrollTo({ top: '100%', behavior: 'smooth' });
        }
    }, [moreAttributes]);

    useEffect(() => {
        setLoading(true);
        axios.get('https://def-api.herokuapp.com/api/unite_produit').then(res => {
            const data = res.data;
            if (data instanceof Array && data.length > 0) {
                setUnites(data);
                setAvailableUnites(data);
            }
        }).catch(err => {
            console.log(err);
        }).finally(() => setLoading(false));
    }, []);

    return (
        <StyledContainer ref={containerRef}>
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
            {loading ?
                <div className='container loading'>
                    <CircularProgress size={20} color="default" />
                </div> :
                <div className="container">
                    <Typography variant="h2" className="title">Le produit / l'article</Typography>
                    <form>
                        <div className="flex-bloc colored-bloc" onClick={onFormClick}>
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
                                            handleErrorChange("code", code);
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
                                            handleErrorChange("minQ", minQ)
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
                        <div className="flex-bloc" onClick={onFormClick}>
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
                                        options={availableUnites}
                                        value={unit}
                                        optionLabel="nom_unite"
                                        setValue={(value) => {
                                            handleSetUnit(value);
                                            handleErrorChange("unit", unit);
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
                        <div onClick={onFormClick}>
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
                                                {otherUnits.map(otherUnit => (
                                                    <Chip
                                                        key={otherUnit.id}
                                                        label={`${otherUnit.specification !== '' ? otherUnit.specification : otherUnit.nom_unite}`}
                                                        color="primary"
                                                        variant="outlined"
                                                        sx={{
                                                            mr: 1
                                                        }}
                                                        onDelete={() => handleRemoveUnit(otherUnit.id)}
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
                                                options={availableUnites}
                                                id={"o_unit2"}
                                                value={otherUnit}
                                                optionLabel="nom_unite"
                                                setValue={handleSetMoreUnit}
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
                        </div>
                        <div className="flex-bloc description" onClick={onFormClick}>
                            <Box mr={4}>
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
                                        onChange={e => setDescription(e.target.value)}
                                        size="small"
                                        sx={{ m: "5px 0" }}
                                        className="star"
                                    />
                                </div>
                            </Box>
                            <div />
                        </div>
                        <div className='more-attributes colored-bloc' onClick={onFormClick}>
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
                                                    onChange={e => setFabricant(e.target.value)}
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
                                                    onChange={e => setEmballage(e.target.value)}
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
                                                    <Typography
                                                        sx={{ display: 'block', mr: 1.5 }}
                                                        variant='caption'
                                                        component={"label"}
                                                        htmlFor={"" + attribute.id}
                                                        className="label"
                                                    >{attribute.nom_attribut}</Typography>
                                                    <TextField
                                                        name={attribute.nom_attribut}
                                                        id={"" + attribute.id}
                                                        type="text"
                                                        fullWidth
                                                        value={attribute.valeur_attribut}
                                                        onChange={e => handleChangeAttributeValue(e, attribute.nom_attribut)}
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
                                            >Créer des attributs</Typography>
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
                    </form>
                    <div className="footer">
                        <Button
                            variant="text"
                            color="default"
                            onClick={handleCancel}
                        >Fermer</Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{
                                minWidth: 105.19,
                                minHeight: 36.5
                            }}
                        >
                            {saving ?
                                <CircularProgress size={10} /> :
                                "Enregistrer"
                            }
                        </Button>
                    </div>
                </div>
            }
        </StyledContainer>
    )
}
