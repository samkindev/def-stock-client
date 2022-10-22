import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, styled } from '@mui/system';
import { StyledBoxContainer } from '../../../app/theme';
import { Typography, TextField, Button, IconButton } from '@mui/material';
import Radio from '../../../Components/Inputs/Radio';
import { Add, ArrowBack } from '@mui/icons-material';
import { dateCompare } from '../../../utilities/helpers';
import { Chargement, LargeDialog, LoadingModal } from '../../../Components';
import { getMotifs, getIsGettingMotif, getMotifsSortie, createSortie, getCreating } from '../../../app/reducers/sortie';
import he from 'he';
import ProduitSortieTable from './ProduitSortieTable';
import { getDevise, getTaux } from '../../../app/reducers/auth';
import { selectById as selectDepotById } from '../../../app/reducers/depot';
import { FeedbackContext } from '../../../App';

const StyledContainer = styled('div')(() => ({
    '& > div:first-of-type': {
        backgroundColor: '#fff',
        padding: '10px 15px 10px 2px',
        borderBottom: '1px solid #e9e9e9',
        display: 'flex',
        alignItems: 'center',
        position: 'fixed',
        left: 280,
        top: 56,
        right: 0,
        zIndex: 100
    },
    '& > div:last-child': {
        marginTop: 110,
        padding: 20,
        alignItems: 'baseline',
        height: 'calc(100vh - 140px)',
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
    "& .body": {
        display: 'flex',
        alignItems: 'base-line'
    },
    "& form": {
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
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

export default function SortieForm() {
    const { id } = useParams();
    const depot = useSelector((state) => selectDepotById(state, id));
    const motifs = useSelector(getMotifs);
    const taux = useSelector(getTaux);
    const devise = useSelector(getDevise);
    const isGettingMotif = useSelector(getIsGettingMotif);
    const [selectedMotif, setSelectedMotif] = useState(null);
    const [demandeur, setDemandeur] = useState('')
    const [serviceDestination, setServiceDestination] = useState('');
    const [refFacture, setRefFacture] = useState('');
    const [dateConstat, setDateConstat] = useState('');
    const [explication, setExplication] = useState('');
    const [rowCount, setRowCount] = useState((new Array(5).fill(0)).map(() => ({
        produit: null,
        quantite: 0,
        cu: null,
        unite: null,
        entreesSorties: []
    })));
    const [errors, setErrors] = useState({ quantite: new Array(rowCount.length).fill(false) });
    const dispatch = useDispatch();
    const { createFeedback } = useContext(FeedbackContext);
    const loading = useSelector(getCreating);

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    }

    const initAll = () => {
        setRowCount((new Array(5).fill(0)).map(() => ({
            produit: null,
            quantite: 0,
            cu: null,
            unite: null,
            entreesSorties: [],
        })));
        setDateConstat('');
        setDemandeur('');
        setServiceDestination('');
        setExplication('');
        setRefFacture('');
        setErrors({ quantite: new Array(rowCount.length).fill(false) });
    }

    const handleErrorChange = (label, val) => {
        if (val && val !== '') {
            setErrors(errors => ({ ...errors, [label]: '' }));
        }

        if (label === 'date') {
            const d = Date.now();
            if (dateCompare(d, val) < 0) {
                setErrors(errors => ({ ...errors, date: 'Cette date ne peut pas être supérieure à celle d\'aujourd\'hui' }));
            }
        }
    }

    const handleSelectMotif = (motif) => {
        setSelectedMotif(motif);
        switch (motif.valeur) {
            case 'interne':
                setRefFacture('');
                break;
            case 'vente':
                setServiceDestination('');
                setDemandeur('');
                break;
            default:
                setServiceDestination('');
                setDemandeur('');
                setRefFacture('');
                break;
        }
        setErrors(errors => ({ ...errors, date: false, refFacture: null, demandeur: null, service: null, explication: null }))
    }

    const validate = () => {
        const errors = { quantite: new Array(rowCount.length).fill(false) };
        let valid = true;

        if (rowCount.length === 0 || rowCount.every(row => (!row.produit && (row.quantite === 0 || row.quantite === '')))) {
            valid = false;
            errors.rowCount = "Insérez au moins une ligne dans le tableau.";
        }

        rowCount.forEach((row, i) => {
            if (row.produit && (!row.quantite || row.quantite == 0 || row.quantite === '')) {
                errors.quantite[i] = "La qunatité est réquis";
                valid = false;
            }
        });

        if (!dateConstat || dateConstat === '') {
            errors.date = 'Ce champs est réquis.'
            valid = false;
        } else {
            const d = Date.now();
            if (dateCompare(d, dateConstat) < 0) {
                errors.date = 'Cette date ne peut pas être supérieure à celle d\'aujourd\'hui'
                valid = false;
            }
        }

        if (selectedMotif.valeur === 'vente' && refFacture === '') {
            errors.refFacture = 'Veuillez insérez le numéro de la facture de vente.'
            valid = false;
        }

        if (selectedMotif.valeur === 'avarie' && explication === '') {
            errors.explication = 'Veuillez donnez le type d\'avarie qu\'ont subit les produits'
            valid = false;
        }

        if (selectedMotif.valeur === 'interne' && demandeur === '') {
            errors.demandeur = 'Ce champs est réquis.'
            valid = false;
        }

        if (selectedMotif.valeur === 'interne' && serviceDestination === '') {
            errors.service = 'Ce champs est réquis.'
            valid = false;
        }

        return { valid, errors }
    }

    const handleSubmit = () => {
        const { valid, errors } = validate();
        if (!valid) {
            setErrors(errors);
            return;
        }

        // Get the filled rows
        const rows = rowCount.filter(row => row.produit);
        // Format the product rows array
        const productRows = rows.map(row => ({
            designation: row.produit.designation,
            quantite: parseFloat(row.quantite),
            cu: row.cu,
            unite: row.unite.id,
            idProduit: row.produit.id,
            entreesSorties: row.entreesSorties
        }));
        // Create the data object
        const data = {
            productRows,
            ref_facture: refFacture,
            date: Date.now(),
            taux,
            devise,
            motif: selectedMotif.id,
            dateConstat,
            demandeur,
            service: serviceDestination,
            explication,
        }

        console.log(data);
        // Send the data to the server
        // dispatch(createSortie({ data, depotId: depot.id }))
        //     .then(res => {
        //         const d = res.payload;
        //         if (d && d.status === 'success') {
        //             createFeedback(
        //                 "Enregistrement effectué avec succès !",
        //                 "nouvelle entrée en stock",
        //                 "success"
        //             );
        //             initAll();
        //         }
        //     })
    }

    const handleAppendRow = () => {
        const r = {
            produit: null,
            quantite: 0,
            cu: null,
            unite: null,
        }

        setRowCount(row => ([...row, r]))
    }

    useEffect(() => {
        dispatch(getMotifsSortie());
    }, []);

    useEffect(() => {
        const m = motifs.find(motif => motif.valeur === 'interne');
        setSelectedMotif(m ? m : null);
    }, [motifs]);

    return (
        <StyledContainer >
            <div>
                <IconButton onClick={handleGoBack} sx={{ borderRadius: 0, mr: 1 }}>
                    <ArrowBack />
                </IconButton>
                <Box flex={1} px={2} display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body1" color="GrayText" sx={{ marginBottom: 0, mr: 2 }}>Fiche de sortie stock</Typography>
                    <Typography variant="caption" color="GrayText">Date: {(new Date()).toLocaleDateString()}</Typography>
                </Box>
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
            <div className="body">
                {errors.rowCount &&
                    <LargeDialog
                        open={errors.rowCount ? true : false}
                        agreeBtnText="Ok"
                        message={errors.rowCount}
                        onAgree={() => setErrors(errors => ({ ...errors, rowCount: null }))}
                        title="Erreur"
                    />
                }
                {loading && <LoadingModal open={loading} />}
                <StyledBoxContainer
                    maxWidth={300}
                    minWidth={300}
                >
                    <div className="header">
                        <Typography variant="caption">Motif de sortie</Typography>
                    </div>
                    <form>
                        {isGettingMotif || !selectedMotif ?
                            <Chargement message="Chargement..." sx={{ height: '100%' }} size={15} /> :
                            <div>
                                {motifs.map(motif => (
                                    <Box
                                        key={motif.id}
                                        mb={1}
                                    >
                                        <Radio
                                            label={motif.type_sortie}
                                            value={motif.id}
                                            checked={motif.id === selectedMotif.id}
                                            onChange={() => handleSelectMotif(motif)}
                                            sx={{ display: 'block', mb: 0.2 }}
                                        />
                                        <Typography
                                            variant="caption"
                                            color="GrayText"
                                            sx={{ fontSize: '12px', pl: 2.7, display: 'block' }}
                                        >{he.decode(motif.explication)}</Typography>
                                    </Box>
                                ))}
                            </div>
                        }
                    </form>
                </StyledBoxContainer>
                <StyledBoxContainer
                    flex={1}
                    height="100%"
                    sx={{ mr: 0 }}
                >
                    <div className="header">
                        <Typography variant="caption">Informations sur la sortie</Typography>
                    </div>
                    <form>
                        <div className="extra-data colored-bloc">
                            <Box display='flex' alignItems="center">
                                <Box flex={1} className="form-controle" mr={1.5}>
                                    <Typography
                                        sx={{ display: 'block', mr: 1 }}
                                        variant='caption'
                                        component={"label"}
                                        htmlFor="demandeur"
                                        className="label"
                                        color={selectedMotif ? selectedMotif.valeur !== 'interne' ? 'GrayText' : '#1d1d1d' : '#1d1d1d'}
                                    >Demandeur<span className="star" style={{ color: selectedMotif ? selectedMotif.valeur !== 'interne' ? 'GrayText' : 'red' : 'red' }}>*</span></Typography>
                                    <TextField
                                        name="demandeur"
                                        id="demandeur"
                                        type="text"
                                        placeholder="Nom de la personne"
                                        size="small"
                                        value={demandeur}
                                        onChange={e => {
                                            setDemandeur(e.target.value);
                                            handleErrorChange('demandeur', e.target.value);
                                        }}
                                        disabled={selectedMotif ? selectedMotif.valeur !== 'interne' : false}
                                        sx={{ m: "5px 0" }}
                                        className="star"
                                        error={errors.demandeur ? true : false}
                                        helperText={errors.demandeur}
                                    />
                                </Box>
                                <Box flex={1} className="form-controle">
                                    <Typography
                                        sx={{ display: 'block', mr: 1 }}
                                        variant='caption'
                                        component={"label"}
                                        htmlFor="service"
                                        className="label"
                                        color={selectedMotif ? selectedMotif.valeur !== 'interne' ? 'GrayText' : '#1d1d1d' : '#1d1d1d'}
                                    >Service de dést.<span className="star" style={{ color: selectedMotif ? selectedMotif.valeur !== 'interne' ? 'GrayText' : 'red' : 'red' }}>*</span></Typography>
                                    <TextField
                                        name="service"
                                        id="service"
                                        type="text"
                                        placeholder="Nom de service ou d'atélier"
                                        size="small"
                                        value={serviceDestination}
                                        onChange={e => {
                                            setServiceDestination(e.target.value);
                                            handleErrorChange('service', e.target.value);
                                        }}
                                        disabled={selectedMotif ? selectedMotif.valeur !== 'interne' : false}
                                        sx={{ m: "5px 0" }}
                                        className="star"
                                        error={errors.service ? true : false}
                                        helperText={errors.service}
                                    />
                                </Box>
                            </Box>
                            <Box display='flex' alignItems="center">
                                <Box flex={1} className="form-controle" mr={1.5}>
                                    <Typography
                                        sx={{ display: 'block', mr: 1 }}
                                        variant='caption'
                                        component={"label"}
                                        htmlFor="ref_facture"
                                        color={selectedMotif ? selectedMotif.valeur !== 'vente' ? 'GrayText' : '#1d1d1d' : '#1d1d1d'}
                                    >Réf. facture<span className="star" style={{ color: selectedMotif ? selectedMotif.valeur !== 'vente' ? 'GrayText' : 'red' : 'red' }}>*</span></Typography>
                                    <TextField
                                        name="ref_facture"
                                        id="ref_facture"
                                        type="text"
                                        placeholder="Référence de la facture vente"
                                        disabled={selectedMotif ? selectedMotif.valeur !== 'vente' : false}
                                        size="small"
                                        value={refFacture}
                                        onChange={e => {
                                            setRefFacture(e.target.value);
                                            handleErrorChange('refFacture', e.target.value);
                                        }}
                                        sx={{ m: "5px 0px" }}
                                        error={errors.refFacture ? true : false}
                                        helperText={errors.refFacture}
                                    />
                                </Box>
                                <Box flex={1} justifyContent="space-between" className="form-controle">
                                    <Typography
                                        sx={{ display: 'block', mr: 1 }}
                                        variant='caption'
                                        component={"label"}
                                        htmlFor="date_demande"
                                    >{selectedMotif ? selectedMotif.valeur === 'interne' ? 'Date demande' : selectedMotif.valeur === 'vente' ? 'Date facture' : 'Date constat' : 'Date'}<span className="star" style={{ color: 'red' }}>*</span></Typography>
                                    <TextField
                                        name="date_demande"
                                        id="date_demande"
                                        type="date"
                                        value={dateConstat}
                                        onChange={e => {
                                            setDateConstat(e.target.value);
                                            handleErrorChange('date', e.target.value);
                                        }}
                                        placeholder=""
                                        size="small"
                                        sx={{ m: "5px 0", maxWidth: 150 }}
                                        error={errors.date ? true : false}
                                        helperText={errors.date}
                                    />
                                </Box>
                            </Box>
                            <Box flex={1} className="form-controle">
                                <Typography
                                    sx={{ display: 'block', mr: 1 }}
                                    variant='caption'
                                    component={"label"}
                                    htmlFor="explication"
                                    className="label"
                                >Explications{selectedMotif && selectedMotif.valeur === 'avarie' && <span className="star" style={{ color: 'red', marginRight: -25, display: 'inline-block' }}>*</span>}</Typography>
                                <TextField
                                    name="explication"
                                    id="explication"
                                    type="text"
                                    placeholder={selectedMotif && selectedMotif.valeur === 'avarie' ? "Quel type d'avarie ont subit les produits sortis" : "Petite explication du motif de la sortie"}
                                    size="small"
                                    value={explication}
                                    onChange={e => {
                                        setExplication(e.target.value);
                                        handleErrorChange('explication', e.target.value);
                                    }}
                                    sx={{ m: "5px 0 5px 27px" }}
                                    className="star"
                                    error={errors.explication ? true : false}
                                    helperText={errors.explication}
                                />
                            </Box>
                        </div>
                        <Box mt={2} flex={1} className='product-list'>
                            <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>Lignes d'articles</Typography>
                            <ProduitSortieTable
                                rowCount={rowCount}
                                setRowCount={setRowCount}
                                errors={errors.quantite ? errors.quantite : []}
                                setErrors={setErrors}
                            />
                            <Button
                                disableElevation
                                endIcon={<Add />}
                                color='primary'
                                variant="outlined"
                                size='medium'
                                sx={{ mt: 4 }}
                                onClick={handleAppendRow}
                            >
                                Ajouter une ligne
                            </Button>
                        </Box>
                    </form>
                </StyledBoxContainer>
            </div>
        </StyledContainer >
    )
}
