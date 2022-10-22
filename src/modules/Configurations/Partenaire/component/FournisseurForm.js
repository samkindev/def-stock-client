import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, styled } from '@mui/system';
import { StyledBoxContainer } from '../../../../app/theme';
import { Typography, TextField, Button, IconButton, Chip } from '@mui/material';
import Radio from '../../../../Components/Inputs/Radio';
import { Add, ArrowBack, Cancel } from '@mui/icons-material';
import { getNumberFromInput } from '../../../../utilities/helpers';
import { ComboBox, LargeDialog, LoadingModal } from '../../../../Components';
import { selectAll as selectAllDepots } from '../../../../app/reducers/depot';
import { validateFournisseurData } from '../utils/validators';
import { isValidEmail, isValidPhoneNumber } from '../../../../utilities/validators';
import axios from 'axios';
import { FeedbackContext } from '../../../../App';

const StyledContainer = styled('div')(() => ({
    '& > div:first-of-type': {
        backgroundColor: '#fff',
        padding: '10px 2px',
        borderBottom: '1px solid #e9e9e9',
        display: 'flex',
        alignItems: 'center',
        position: 'fixed',
        left: 280,
        top: 56,
        right: 0,
        zIndex: 200
    },
    '& > div:last-child': {
        marginTop: 110,
        padding: 20,
        alignItems: 'baseline',
        display: 'flex',
        '& > div:first-of-type': {
            marginRight: 30,
        }
    },
    '& .chips-container': {
        display: 'flex',
        flexWrap: 'wrap',
        marginBottom: 8,
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
            "& > .label": {
                display: 'flex',
                fontWeight: '400!important',
                fontSize: '15px!important'
            },
            "& > div": {
                flex: 1.5,
                backgroundColor: '#fff',
            },
            "& span.star": {
                color: 'red',
                padding: '0 10px'
            }
        },
        "& .colored-bloc": {
            backgroundColor: '#307ecc14',
            padding: '10px'
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
}));

export default function FournisseurForm() {
    const depots = useSelector(selectAllDepots);
    const [depot, setDepot] = useState(null);
    const [nom, setNom] = useState('');
    const [postnom, setPostnom] = useState('');
    const [denomination, setDenomination] = useState('');
    const [rccm, setRccm] = useState('');
    const [tel, setTel] = useState('');
    const [email, setEmail] = useState('');
    const [compte, setCompte] = useState('default');
    const [address, setAddress] = useState('');
    const [numFournisseur, setNumFournisseur] = useState('');
    const [intitule, setIntitule] = useState('');
    const [allDepots, setAllDepots] = useState(true);
    const [selectedDepots, setSelectedDepots] = useState([]);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const { createFeedback } = useContext(FeedbackContext);

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    }

    const initAll = () => {
        setNom('');
        setPostnom('');
        setDenomination('');
        setRccm('');
        setTel('');
        setEmail('');
        setAddress('');
        setCompte('default');
        setIntitule('');
        setNumFournisseur('');
        setErrors({});
        setAllDepots(true);
        setDepot(null);
        setSelectedDepots([]);
    }

    const handleChangeTel = val => {
        if (val.length > 13) {
            return;
        }
        setTel(val);
        if (isValidPhoneNumber(val)) {
            setErrors(errors => ({ ...errors, tel: null }));
        }
    };

    const handleChangeEmail = val => {
        setEmail(val);
        if (isValidEmail(val)) {
            setErrors(errors => ({ ...errors, email: null }));
        }
    }

    const handleSelectDepot = (value) => {
        setDepot(value);
        setErrors(errors => ({ ...errors, depot: null }));
    }

    const handleAppendDepot = () => {
        if (!depot || (depot && selectedDepots.some(d => d.id === depot.id))) {
            return;
        }
        setSelectedDepots(depots => ([...depots, depot]));
        setErrors({ ...errors, depot: null });
        setDepot(null);
    }

    const handleRemoveDepot = (id) => {
        setSelectedDepots(selectedDepots.filter(d => d.id !== id));
    }

    const handleSubmit = async () => {
        const { valid, errors } = validateFournisseurData(
            tel, email, address, compte, numFournisseur, intitule, allDepots, selectedDepots
        );
        if (!valid) {
            setErrors(errors);
            return;
        }

        const data = {
            nom, postnom, denomination,
            rccm, tel,
            email,
            compte: compte === 'default' ? 40 : numFournisseur,
            intitule, email,
            address,
            depots: selectedDepots.map(d => d.id),
            type: allDepots ? 'global' : 'local'
        }

        console.log(data);

        setSaving(true);
        const res = await axios.post('/api/fournisseur', data);
        const d = res.data;
        setSaving(false);
        if (d.status === 'success') {
            createFeedback(
                "Fournisseur enregistré avec succès !",
                "Fournisseur",
                "success"
            );
            initAll();
        } else if (d.type === 'validation') {
            setErrors(errs => ({ ...errs, server: d.errors }));
        } else {
            setErrors(errs => ({ ...errs, server: d.message }));
        }
    }

    return (
        <StyledContainer >
            {errors.server &&
                <LargeDialog
                    agreeBtnText={"Ok"}
                    open={errors.server ? true : false}
                    title="Erreur"
                    message={errors.server}
                    onAgree={() => setErrors(errors => ({ ...errors, server: null }))}
                />
            }
            {saving &&
                <LoadingModal open={saving} />
            }
            <div>
                <IconButton onClick={handleGoBack} sx={{ borderRadius: 0, mr: 1 }}>
                    <ArrowBack />
                </IconButton>
                <Button
                    disableElevation
                    color='primary'
                    variant="contained"
                    size='medium'
                    sx={{ mr: 1.5 }}
                    onClick={handleSubmit}
                >
                    Enregistrer
                </Button>
                <Button
                    disableElevation
                    color='default'
                    variant="outlined"
                    size='medium'
                    onClick={initAll}
                >
                    Nettoyer
                </Button>
            </div>
            <div>
                <StyledBoxContainer
                    maxWidth={500}
                    minWidth={500}
                >
                    <div className="header">
                        <Typography variant="caption">Informations de base</Typography>
                    </div>
                    <form>
                        <div className="colored-bloc">
                            <Typography variant="caption" sx={{ mb: 1, display: 'block', fontSize: '17px', fontWeight: '500' }}>
                                Indentés de la personne
                            </Typography>
                            <Box
                                display="flex"
                                alignItems={'centre'}
                                mb={1}
                                sx={{
                                    '& > div': {
                                        flex: 1
                                    }
                                }}
                            >
                                <div className="form-controle" style={{ marginRight: 5 }}>
                                    <Typography
                                        sx={{ display: 'block', mr: 1.5 }}
                                        variant='caption'
                                        component={"label"}
                                        htmlFor="nom"
                                        className="label"
                                    >Nom</Typography>
                                    <TextField
                                        name="nom"
                                        id="nom"
                                        type="text"
                                        placeholder='Nom du fournisseur'
                                        fullWidth
                                        size="small"
                                        value={nom}
                                        onChange={e => setNom(e.target.value)}
                                        sx={{ m: "2px 0" }}
                                        className="star"
                                    />
                                </div>
                                <div className="form-controle">
                                    <Typography
                                        sx={{ display: 'block', mr: 1.5 }}
                                        variant='caption'
                                        component={"label"}
                                        htmlFor="postnom"
                                        className="label"
                                    >Postnom</Typography>
                                    <TextField
                                        name="postnom"
                                        id="postnom"
                                        fullWidth
                                        placeholder='Post nom du fournisseur'
                                        type="text"
                                        value={postnom}
                                        onChange={e => setPostnom(e.target.value)}
                                        inputProps={{ min: 0 }}
                                        size="small"
                                        sx={{ m: "2px 0" }}
                                        className="star"
                                    />
                                </div>
                            </Box>
                            <Typography variant="caption" sx={{ mb: 1, display: 'block', fontSize: '17px', fontWeight: '500' }}>
                                Organisation/Entreprise
                            </Typography>
                            <Box
                            >
                                <div className="form-controle">
                                    <Typography
                                        sx={{ display: 'block', mr: 1.5 }}
                                        variant='caption'
                                        component={"label"}
                                        htmlFor="denomination"
                                        className="label"
                                    >Denomination</Typography>
                                    <TextField
                                        name="denomination"
                                        id="denomination"
                                        type="text"
                                        placeholder="Nom de l'entreprise"
                                        fullWidth
                                        value={denomination}
                                        onChange={e => setDenomination(e.target.value)}
                                        size="small"
                                        sx={{ m: "2px 0" }}
                                        className="star"
                                    />
                                </div>
                                <div className="form-controle">
                                    <Typography
                                        sx={{ display: 'block', mr: 1.5 }}
                                        variant='caption'
                                        component={"label"}
                                        htmlFor="rccm"
                                        className="label"
                                    >Numéro RCCM</Typography>
                                    <TextField
                                        name="rccm"
                                        id="rccm"
                                        fullWidth
                                        placeholder="Numéro RCCM de l'entreprise"
                                        type="text"
                                        value={rccm}
                                        onChange={e => setRccm(e.target.value)}
                                        inputProps={{ min: 0 }}
                                        size="small"
                                        sx={{ m: "2px 0" }}
                                        className="star"
                                    />
                                </div>
                            </Box>
                        </div>
                        <Box p={1.5}>
                            <Typography variant="caption" sx={{ mb: 1, display: 'block', fontSize: '17px', fontWeight: '500' }}>
                                Contacts
                            </Typography>
                            <Box
                                display="flex"
                                alignItems={'centre'}
                                sx={{
                                    '& > div': {
                                        flex: 1
                                    }
                                }}
                            >
                                <div className="form-controle" style={{ marginRight: 5 }}>
                                    <Typography
                                        sx={{ display: 'block', mr: 1.5 }}
                                        variant='caption'
                                        component={"label"}
                                        htmlFor="tel"
                                        className="label"
                                    >Numéro de téléphone <span className="star">*</span></Typography>
                                    <TextField
                                        name="tel"
                                        id="tel"
                                        type="tel"
                                        placeholder='Tel du fournisseur'
                                        fullWidth
                                        value={tel}
                                        onChange={e => {
                                            handleChangeTel(getNumberFromInput(e.target.value[e.target.value.length - 1], e.target.value));
                                        }}
                                        size="small"
                                        sx={{ m: "2px 0" }}
                                        className="star"
                                        error={errors.tel ? true : false}
                                        helperText={errors.tel}
                                    />
                                </div>
                                <div className="form-controle">
                                    <Typography
                                        sx={{ display: 'block', mr: 1.5 }}
                                        variant='caption'
                                        component={"label"}
                                        htmlFor="email"
                                        className="label"
                                    >Adresse email <span className="star">*</span></Typography>
                                    <TextField
                                        name="email"
                                        id="email"
                                        fullWidth
                                        value={email}
                                        onChange={e => handleChangeEmail(e.target.value)}
                                        placeholder='Email du fournisseur'
                                        type="email"
                                        inputProps={{ min: 0 }}
                                        size="small"
                                        sx={{ m: "2px 0" }}
                                        error={errors.email ? true : false}
                                        helperText={errors.email}
                                    />
                                </div>
                            </Box>
                            <div className="form-controle">
                                <Typography
                                    sx={{ display: 'block', mr: 1.5 }}
                                    variant='caption'
                                    component={"label"}
                                    htmlFor="address"
                                    className="label"
                                >Adresse physique (ville, Commune, Q., Av., Num)</Typography>
                                <TextField
                                    name="address"
                                    id="address"
                                    type="text"
                                    placeholder='Ville, commune, quartier, avenue, numéro'
                                    fullWidth
                                    value={address}
                                    onChange={e => {
                                        let val = e.target.value;
                                        setAddress(val);
                                        if (val !== '') setErrors(err => ({ ...err, address: null }));
                                    }}
                                    multiline
                                    rows={2}
                                    size="small"
                                    sx={{ m: "2px 0" }}
                                    className="star"
                                    error={errors.address ? true : false}
                                    helperText={errors.address}
                                />
                            </div>
                        </Box>
                    </form>
                </StyledBoxContainer>
                <div>
                    <StyledBoxContainer
                        minWidth={450}
                    >
                        <div className="header">
                            <Typography variant="caption">Comptabilité</Typography>
                        </div>
                        <form>
                            <Box>
                                <Box px={1.5}>
                                    <Typography variant="caption" sx={{ mb: 1, display: 'block', fontSize: '17px', fontWeight: '500' }}>
                                        Compte fournisseur
                                    </Typography>
                                    <Radio
                                        label={'Utiliser le compte par défaut'}
                                        value={compte}
                                        checked={compte === 'default'}
                                        onChange={() => setCompte('default')}
                                    />
                                    <Box
                                        display="flex"
                                        alignItems={'centre'}
                                        sx={{
                                            ml: 4
                                        }}
                                    >
                                        <TextField
                                            name="default_num"
                                            id="default_num"
                                            type="text"
                                            size="small"
                                            InputProps={{ readOnly: true }}
                                            defaultValue='40'
                                            sx={{ my: '2px', mr: '5px', maxWidth: '70px', textAlign: 'center' }}
                                        />
                                        <TextField
                                            name="default_compte"
                                            id="default_compte"
                                            fullWidth
                                            defaultValue='Fournisseur'
                                            type="text"
                                            InputProps={{ readOnly: true }}
                                            inputProps={{ min: 0 }}
                                            size="small"
                                            sx={{ m: "2px 0" }}
                                        />
                                    </Box>
                                </Box>
                                <Box
                                    mt={1}
                                    className="colored-bloc"
                                >
                                    <Radio
                                        label={'Créer un compte divisionnaire'}
                                        value={compte}
                                        checked={compte === 'new'}
                                        onChange={() => setCompte('new')}
                                    />
                                    <Box
                                        sx={{
                                            ml: 4
                                        }}
                                        className="form-controle"
                                    >
                                        <Typography
                                            sx={{ display: 'block', mr: 1.5 }}
                                            variant='caption'
                                            component={"label"}
                                            htmlFor="conpte"
                                            className="label"
                                        >Compte fournisseur {compte === 'new' && <span style={{ color: 'red', marginLeft: 10 }}>*</span>}</Typography>
                                        <Box
                                            display="flex"
                                            alignItems={'centre'}
                                            sx={{ backgroundColor: "inherit!important" }}
                                        >
                                            <div className="form-controle" style={{ marginRight: 5 }}>
                                                <TextField
                                                    name="default_num"
                                                    id="default_num"
                                                    type="text"
                                                    size="small"
                                                    defaultValue='40'
                                                    InputProps={{ readOnly: true }}
                                                    sx={{ m: "2px 0", maxWidth: '70px', textAlign: 'center' }}
                                                    disabled={compte === 'default'}
                                                />
                                            </div>
                                            <div className="form-controle" style={{ flex: 1 }}>
                                                <TextField
                                                    name="conpte"
                                                    id="conpte"
                                                    fullWidth
                                                    value={numFournisseur}
                                                    onChange={e => {
                                                        const val = getNumberFromInput(e.target.value[e.target.value.length - 1], e.target.value);
                                                        setNumFournisseur(val);
                                                        if (val !== numFournisseur) {
                                                            setErrors(errors => ({ ...errors, numFournisseur: null }));
                                                        }
                                                    }}
                                                    inputMode='numeric'
                                                    placeholder='Num fournisseur. Ex. 0001'
                                                    type="email"
                                                    inputProps={{ min: 0 }}
                                                    size="small"
                                                    sx={{ m: "2px 0" }}
                                                    disabled={compte === 'default'}
                                                    error={errors.numFournisseur ? true : false}
                                                    helperText={errors.numFournisseur}
                                                />
                                            </div>
                                        </Box>
                                        <Box className="form-controle" sx={{ backgroundColor: "inherit!important" }}>
                                            <Typography
                                                sx={{ display: 'block' }}
                                                variant='caption'
                                                component={"label"}
                                                htmlFor="intitule"
                                                className="label"
                                            >Intitulé du compte {compte === 'new' && <span style={{ color: 'red', marginLeft: 10 }}>*</span>}</Typography>
                                            <TextField
                                                name="intitule"
                                                id="intitule"
                                                type="text"
                                                size="small"
                                                fullWidth
                                                placeholder='Intitulé du compte fournisseur'
                                                value={intitule}
                                                onChange={e => {
                                                    setErrors(errors => ({ ...errors, intitule: null }));
                                                    setIntitule(e.target.value);
                                                }}
                                                sx={{ m: "2px 0" }}
                                                disabled={compte === 'default'}
                                                error={errors.intitule ? true : false}
                                                helperText={errors.intitule}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </form>
                    </StyledBoxContainer>
                    <StyledBoxContainer
                        minWidth={450}
                        mt={2.5}
                    >
                        <div className="header">
                            <Typography variant="caption">Dépôt/Magasin</Typography>
                        </div>
                        <form>
                            <Box>
                                <Box px={1.5}>
                                    <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: '500' }}>
                                        Dans quel dépôt/magasin fourni-t-il ?
                                    </Typography>
                                    <Box display="flex" alignItems='center'>
                                        <Radio
                                            label={'Tous les magasins'}
                                            value={compte}
                                            checked={allDepots}
                                            onChange={() => {
                                                setAllDepots(true);
                                                setDepot(null);
                                                setErrors({ ...errors, depot: null });
                                                setSelectedDepots([]);
                                            }}
                                            style={{ marginRight: 10 }}
                                        />
                                        <Radio
                                            label={'Magasins spécifique'}
                                            value={allDepots}
                                            checked={!allDepots}
                                            onChange={() => setAllDepots(false)}
                                        />
                                    </Box>
                                    <Box
                                        className="colored-bloc"
                                        sx={{
                                            mt: 1
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ mb: 1, display: 'block', fontSize: '17px!important', fontWeight: '500' }}>
                                            Dépôts/Magasins
                                        </Typography>
                                        <Box py={0.5}>
                                            {selectedDepots.length > 0 &&
                                                <div className="chips-container">
                                                    {selectedDepots.map((depot, i) => (
                                                        <Chip
                                                            key={depot.id}
                                                            label={`${depot.nom_depot}`}
                                                            color={"primary"}
                                                            variant="outlined"
                                                            sx={{
                                                                mr: 0.5,
                                                                mt: '3px'
                                                            }}
                                                            deleteIcon={<Cancel />}
                                                            onDelete={() => handleRemoveDepot(depot.id)}
                                                        />
                                                    ))}
                                                </div>
                                            }
                                            <div className='form-controle' style={{ display: 'flex' }}>
                                                <ComboBox
                                                    id="magasin"
                                                    options={depots}
                                                    value={depot}
                                                    optionLabel="nom_depot"
                                                    setValue={handleSelectDepot}
                                                    placeholder="Séléctionnez le magasin"
                                                    minWidth={100}
                                                    error={errors.depot ? true : false}
                                                    helperText={errors.depot}
                                                    disabled={allDepots}
                                                    sx={{
                                                        '& > div': {
                                                            margin: 0
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    color="default"
                                                    variant="outlined"
                                                    onClick={handleAppendDepot}
                                                    startIcon={<Add />}
                                                    sx={{
                                                        marginLeft: 0.5,
                                                        maxHeight: 37
                                                    }}
                                                >Ajouter</Button>
                                            </div>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </form>
                    </StyledBoxContainer>
                </div>
            </div>
        </StyledContainer >
    )
}
