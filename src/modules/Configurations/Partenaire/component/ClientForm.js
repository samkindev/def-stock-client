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
        left: 275,
        top: 65,
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

export default function ClientForm() {
    const [numDef, setNumDef] = useState("");
    const [nom, setNom] = useState('');
    const [postnom, setPostnom] = useState('');
    const [denomination, setDenomination] = useState('');
    const [rccm, setRccm] = useState('');
    const [tel, setTel] = useState('');
    const [email, setEmail] = useState('');
    const [compte, setCompte] = useState('default');
    const [address, setAddress] = useState('');
    const [numClient, setNumClient] = useState('');
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
        setNumClient('');
        setErrors({});
        setAllDepots(true);
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

    const handleSubmit = async () => {
        const { valid, errors } = validateFournisseurData(
            tel, email, address, compte, numClient, intitule, allDepots, selectedDepots
        );
        if (!valid) {
            setErrors(errors);
            return;
        }

        const data = {
            nom, postnom, denomination,
            rccm, tel,
            email,
            compte: compte === 'default' ? 40 : numClient,
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
                        <div className="form-controle" style={{ marginBottom: 10 }}>
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="def"
                                className="label"
                            >Numéro DEF</Typography>
                            <TextField
                                name="def"
                                id="def"
                                type="text"
                                placeholder='Numéro DEF du client'
                                fullWidth
                                size="small"
                                value={numDef}
                                onChange={e => setNumDef(e.target.value)}
                                sx={{ m: "2px 0" }}
                                className="star"
                            />
                        </div>
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
                                        placeholder='Nom du client'
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
                                        placeholder='Post nom du client'
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
                                        placeholder='Tel du client'
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
                                        placeholder='Email du client'
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
                                        Compte client
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
                                            defaultValue='41'
                                            sx={{ my: '2px', mr: '5px', maxWidth: '70px', textAlign: 'center' }}
                                        />
                                        <TextField
                                            name="default_compte"
                                            id="default_compte"
                                            fullWidth
                                            defaultValue='Client'
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
                                        >Compte client {compte === 'new' && <span style={{ color: 'red', marginLeft: 10 }}>*</span>}</Typography>
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
                                                    defaultValue='41'
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
                                                    value={numClient}
                                                    onChange={e => {
                                                        const val = getNumberFromInput(e.target.value[e.target.value.length - 1], e.target.value);
                                                        setNumClient(val);
                                                        if (val !== numClient) {
                                                            setErrors(errors => ({ ...errors, numClient: null }));
                                                        }
                                                    }}
                                                    inputMode='numeric'
                                                    placeholder='Num client. Ex. 0001'
                                                    type="email"
                                                    inputProps={{ min: 0 }}
                                                    size="small"
                                                    sx={{ m: "2px 0" }}
                                                    disabled={compte === 'default'}
                                                    error={errors.numClient ? true : false}
                                                    helperText={errors.numClient}
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
                                                placeholder='Intitulé du compte client'
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
                </div>
            </div>
        </StyledContainer >
    )
}
