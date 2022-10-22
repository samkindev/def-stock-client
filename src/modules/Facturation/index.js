import React, { useState, useEffect, useContext } from 'react';
import { Box, styled } from '@mui/system';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton, Typography, TextField, Button, Chip } from '@mui/material';
import { Add, Cancel, Delete, Edit, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import ProduitsVendustable from './components/ProduitsVendusTable';
import { Select, ComboBox, LargeDialog, LoadingModal } from '../../Components';
import ExtraBillInfoTable from './components/ExtraBillInfoTable';
import { selectAll as selectAllDepots } from '../../app/reducers/depot';
import { getTaux, getDevise, getCurrentUser } from '../../app/reducers/auth';
import { actions, getProduitsDisponibles, getProductRow, getPaymentModes, getReductions, selectPaymentModes, saveVente, getSaving } from '../../app/reducers/venteData';
import { formatNumber, getNumberFromInput } from '../../utilities/helpers';
import IsoIcon from '@mui/icons-material/Iso';
import ReducePriceForm from './components/ReducePriceForm';
import UpdateProductRow from './components/UpdateForm';
import { FeedbackContext } from '../../App';

const StyledContainer = styled('div')(() => ({
    minHeight: 'calc(100vh - 56px)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    "& .form-controle": {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 5,
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
        "& .field-with-button": {
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
    '& .chips-container': {
        display: 'flex',
        flexWrap: 'wrap',
        marginBottom: 8,
    }
}));

const StyledBlock = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    '&.produits': {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    '& .header': {
        backgroundColor: '#307eccd6',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0px 15px'
    },
    '& .body': {
        flex: 1,
        backgroundColor: '#fff',
        '&.base': {
            display: 'flex',
            '& > div': {
                flex: 1,
                padding: '10px 15px'
            },
            '& > div:last-child': {
                borderLeft: '1px solid #eaeaea'
            }
        },
        '& .actions': {
            padding: '10px 15px',
            "& > *": {
                marginRight: 10
            }
        },
        '& .calcul-paiement': {
            padding: '0 10px',
            minWidth: 300,
            '& label': {
                // justifyContent: 'flex-end',
            },
            '& .large-btn': {
                fontSize: 25,
                padding: '14px 20px'
            }
        },
    },
}));


export default function Facturation() {
    const user = useSelector(getCurrentUser);
    const depots = useSelector(selectAllDepots);
    const paymentModes = useSelector(selectPaymentModes);
    const devise = useSelector(getDevise);
    const taux = useSelector(getTaux);
    const [depot, setDepot] = useState(depots[0] ? depots[0] : null);
    const location = useLocation();
    location.search = depot ? depot.id : null;
    const [client, setClient] = useState({
        nom: '',
        tel: '',
        address: ''
    });
    const [vendeur, setVendeur] = useState({
        nom_vendeur: `${user.prenom} ${user.nom}`,
        code_guichet: user.code_guichet || ''
    });
    const [netPayer, setNetPayer] = useState(0);
    const [paymentMode, setPaymentMode] = useState(null);
    const [selectedPaymentModes, setSelectedPaymentModes] = useState([]);
    const [amount, setAmount] = useState('');
    const [restFromPayment, setRestFromPayment] = useState(0);
    const [taxes, setTaxes] = useState([]);
    const [errors, setErrors] = useState({});
    const [showTaxes, setShowTaxes] = useState(false);
    const [openPriceReduction, setOpenPriceReduction] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState([]);
    const [openUpdate, setOpenUpdate] = useState(false);
    const dispatch = useDispatch();
    const productRow = useSelector(getProductRow);
    const isSingleSelected = selectedRowData.length === 1;
    const isMultipleSelected = selectedRowData.length > 1;
    const { createFeedback } = useContext(FeedbackContext);
    const saving = useSelector(getSaving);

    const initAll = () => {
        dispatch(actions.clearProductRow());
        setNetPayer(0);
        setPaymentMode(paymentModes[0]);
        setSelectedPaymentModes([]);
        setAmount(0);
        setErrors({});
        setSelectedRowData([]);
        setTaxes([]);
    }

    const handleSelectDepot = (value) => {
        setDepot(value);
        initAll();
    }

    const toggelSelectClient = () => { };

    const toggleOpenReducePrice = () => {
        setOpenPriceReduction(!openPriceReduction);
    }

    const toggleUpdate = () => {
        setOpenUpdate(!openUpdate);
    }

    const handleSelectPaymentMode = (value) => {
        setPaymentMode(value);
        setErrors(errs => ({ ...errs, paymentMode: null }));
        const exist = selectedPaymentModes.some(s => s.id === value.id);
        if (exist) {
            setErrors(errs => ({ ...errs, paymentMode: 'Evitez les doublons' }));
            return;
        }
    }

    const appendMethodePayement = (e) => {
        e.preventDefault();
        const errs = { ...errors };
        let valid = true;
        if (!paymentMode) {
            valid = false;
            errs.paymentMode = 'Selectionnez le mode de payement.'
        }
        if (amount === '' || parseFloat(amount.replace(',', '.')) === 0 || parseFloat(amount.replace(',', '.')) > restFromPayment) {
            valid = false;
            errs.amount = 'Mauvaisse valeur'
        };

        if (!valid) {
            setErrors(errs);
            return;
        }

        const exist = selectedPaymentModes.some(s => s.id === paymentMode.id);
        if (exist) {
            setErrors(errs => ({ ...errs, paymentMode: 'Evitez les doublons' }));
            return;
        }
        setRestFromPayment(rFP => parseFloat(formatNumber(rFP, 2, '.')) - parseFloat(amount.replace(',', '.')));
        setSelectedPaymentModes(s => ([
            ...s,
            {
                ...paymentMode,
                amount: parseFloat(amount.replace(',', '.'))
            }
        ]));
        setAmount('');
        setPaymentMode(null);
    }

    const handleRemovePaymentMode = (id) => {
        const pM = selectedPaymentModes.find(s => s.id === id);
        if (pM) {
            setRestFromPayment(restFromPayment + parseFloat(pM.amount));
        }
        setSelectedPaymentModes(s => {
            return s.filter(item => item.id !== id);
        });
    }

    const renderSpreadButtonIcon = (spread) => {
        return spread ? <KeyboardArrowDown fontSize='small' /> : <KeyboardArrowUp fontSize='small' />
    }

    const handleDeleteRowData = () => {
        dispatch(actions.removeProductRow(selectedRowData.map(rD => rD.id)));
        setSelectedRowData([]);
    }

    const handleSubmit = () => {
        if (Object.values(errors).some(e => e)) {
            setErrors(errors => ({ ...errors, global: 'Il ya des erreurs sur la page. Vérifiez s\'il y a des champs qui sont marqués en rouge' }))
            return;
        }
        const tva = taxes.find(t => t.label.toLowerCase() === 'tva');
        const date = new Date();
        if (productRow.length === 0) {
            setErrors(errors => ({
                ...errors,
                global: 'Inserez aumoins une ligne d\'articles',
            }));
            return;
        }
        const data = {
            taux,
            devise,
            net_payer: parseFloat(netPayer),
            total_tva: tva ? parseFloat(tva.montant) : '',
            date_facturation: date,
            client,
            vendeur,
            productRows: productRow.filter(r => !r.reduction).map(row => {
                const { code, tva, total, totalMin, unit, ...other } = row;
                return {
                    ...other,
                    tva: tva.taux,
                    unite: unit.id
                };
            }),
            reductionRows: productRow.filter(r => r.reduction).map(r => ({ ...r.reduction, rowId: r.rowId })),
            paymentRows: selectedPaymentModes.map(p => ({
                montant: p.amount,
                id: p.id,
                nom_mode_payement: p.nom_mode_payement
            }))
        }

        if (data.paymentRows.length === 0) {
            data.paymentRows = [{
                montant: netPayer,
                id: paymentMode ? paymentMode.id : paymentModes[0].id,
                nom_mode_payement: paymentMode ? paymentMode.nom_mode_payement : paymentModes[0].nom_mode_payement
            }]
        }

        dispatch(saveVente({ depotId: depot.id, data }))
            .then(res => {
                const d = res.payload;
                if (d && d.status === 'success') {
                    createFeedback(
                        "Vente effectuée avec succès !",
                        "Vente d'articles",
                        "success"
                    );
                    initAll();
                }
            });

        console.log(data);
    }

    useEffect(() => {
        if (depot) {
            dispatch(getProduitsDisponibles(depot.id));
            dispatch(actions.setMagasin(depot));
        }
    }, [depot]);

    useEffect(() => {
        let tva = 0;
        let net = 0;
        productRow.forEach((val) => {
            tva += val.tva.montant;
            if (val.reduction) {
                net -= parseFloat(val.total);
            } else {
                net += parseFloat(val.total);
            }
        }, 0);
        setNetPayer(formatNumber(net));
        setRestFromPayment(parseFloat(net));
        setSelectedPaymentModes([]);
        setPaymentMode(paymentModes[0]);
        setTaxes([{ id: 0, label: 'TVA', montant: formatNumber(tva) }]);
    }, [productRow]);

    useEffect(() => {
        dispatch(getPaymentModes());
        dispatch(getReductions());
    }, []);

    useEffect(() => {
        if (paymentModes.length > 0) {
            setPaymentMode(paymentModes[0] ? paymentModes[0] : null);
        }
    }, [paymentModes]);

    return (
        <StyledContainer>
            {errors.global &&
                <LargeDialog
                    agreeBtnText={"Ok"}
                    open={errors.global ? true : false}
                    title="Erreur"
                    message={errors.global}
                    onAgree={() => setErrors(errors => ({ ...errors, global: null }))}
                />
            }
            {saving &&
                <LoadingModal open={saving} />
            }
            {openPriceReduction &&
                <ReducePriceForm rowData={selectedRowData[0]} open={openPriceReduction} onClose={toggleOpenReducePrice} />
            }
            {openUpdate &&
                <UpdateProductRow open={openUpdate} onClose={toggleUpdate} productRow={selectedRowData[0]} />
            }
            <StyledBlock>
                <div className="header">
                    <Typography variant="caption">Informations de base</Typography>
                    <IconButton>
                        <KeyboardArrowDown fontSize='small' htmlColor='#fff' />
                    </IconButton>
                </div>
                <Box className='body base' >
                    <div>
                        <Box mb={1}>
                            <Typography variant="h2" sx={{ fontWeight: '600' }}>Client</Typography>
                        </Box>
                        <div className='form-controle'>
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="nomClient"
                                className="label"
                            >Nom du client</Typography>
                            <div className={`field-with-button`}>
                                <TextField
                                    name="nomClient"
                                    id="nomClient"
                                    type="text"
                                    value={client.nom}
                                    placeholder="Nom du client"
                                    onChange={e => {
                                        setClient(f => ({ ...f, nom: e.target.value }));
                                    }}
                                    size="small"
                                    sx={{ m: "0" }}
                                    className="star"
                                />
                                <Button
                                    variant="outlined"
                                    color="default"
                                    size="medium"
                                    onClick={toggelSelectClient}
                                    sx={{ ml: 1 }}
                                >Sélect. client</Button>
                            </div>
                        </div>
                        <div className='form-controle'>
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="tel"
                                className="label"
                            >Num. téléphone</Typography>
                            <TextField
                                name="tel"
                                id="tel"
                                type="tel"
                                value={client.tel}
                                placeholder="Numéro de téléphone"
                                onChange={e => {
                                    setClient(f => ({ ...f, tel: e.target.value }));
                                }}
                                size="small"
                                sx={{ m: "0" }}
                                className="star"
                            />
                        </div>
                        <div className='form-controle'>
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="adresse"
                                className="label"
                            >Adresse</Typography>
                            <TextField
                                name="adresse"
                                id="adresse"
                                type="text"
                                value={client.address}
                                placeholder="Nom du fournisseur"
                                onChange={e => {
                                    setClient(f => ({ ...f, address: e.target.value }));
                                }}
                                size="small"
                                sx={{ m: "0" }}
                            />
                        </div>
                    </div>
                    <div>
                        <Box mb={1}>
                            <Typography variant="h2" sx={{ fontWeight: '600' }}>Vendeur</Typography>
                        </Box>
                        <div className='form-controle'>
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="magasin"
                                className="label"
                            >Magasin stock</Typography>
                            <ComboBox
                                id="magasin"
                                options={depots}
                                value={depot}
                                optionLabel="nom_depot"
                                setValue={handleSelectDepot}
                                placeholder="Séléctionnez le magasin"
                                minWidth={100}
                                error={errors.produit ? true : false}
                                helperText={errors.produit}
                                sx={{
                                    '& > div': {
                                        margin: 0
                                    }
                                }}
                            />
                        </div>
                        <div className='form-controle'>
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="code"
                                className="label"
                            >code guichet de vente</Typography>
                            <TextField
                                name="code"
                                id="code"
                                type="text"
                                InputProps={{ readOnly: true }}
                                value={vendeur.code_guichet}
                                placeholder="Code guichet de vente"
                                onChange={e => {
                                    setVendeur(f => ({ ...f, code_guichet: e.target.value }));
                                }}
                                size="small"
                                sx={{ m: "0" }}
                            />
                        </div>
                        <div className='form-controle'>
                            <Typography
                                sx={{ display: 'block', mr: 1.5 }}
                                variant='caption'
                                component={"label"}
                                htmlFor="nomVendeur"
                                className="label"
                            >Nom vendeur/vendeuse</Typography>
                            <TextField
                                name="nomVendeur"
                                id="nomVendeur"
                                type="text"
                                value={vendeur.nom_vendeur}
                                placeholder="Nom complet"
                                InputProps={{ readOnly: true }}
                                onChange={e => {
                                    setVendeur(f => ({ ...f, nom_vendeur: e.target.value }));
                                }}
                                size="small"
                                sx={{ m: "0" }}
                            />
                        </div>
                    </div>
                </Box>
            </StyledBlock>
            <StyledBlock className='produits'>
                <div className="header">
                    <Typography variant="caption">Articles vendus</Typography>
                    <IconButton>
                        <KeyboardArrowDown fontSize='small' htmlColor='#fff' />
                    </IconButton>
                </div>
                <div className='body' style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 15 }}>
                    <div className='actions'>
                        <Link to="produits" state={{ backgroundLocation: location }}>
                            <Button
                                endIcon={<Add />}
                                disableElevation
                                variant='outlined'
                                color="primary"
                                size='small'
                                type="submit"
                            >Ajouter articles</Button>
                        </Link>
                        <Button
                            endIcon={<Edit />}
                            disableElevation
                            variant='text'
                            color="default"
                            size='small'
                            type="submit"
                            disabled={(isSingleSelected && selectedRowData.length > 0 && !selectedRowData[0].reduction) ?
                                false :
                                true
                            }
                            onClick={toggleUpdate}
                        >Modifier</Button>
                        <Button
                            endIcon={<Delete />}
                            disableElevation
                            variant='text'
                            color="default"
                            size='small'
                            type="submit"
                            onClick={handleDeleteRowData}
                            disabled={isMultipleSelected || isSingleSelected ? false : true}
                        >Suppimer</Button>
                        <Button
                            endIcon={<IsoIcon />}
                            disableElevation
                            variant='text'
                            color="default"
                            size='small'
                            type="submit"
                            disabled={(isSingleSelected && selectedRowData.length > 0 && !selectedRowData[0].reduction) ?
                                false :
                                true
                            }
                            onClick={toggleOpenReducePrice}
                        >Réduire le prix</Button>
                    </div>
                    <Box display="flex" flex={1}>
                        <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                            <ProduitsVendustable productRow={productRow} selected={selectedRowData} setSelected={setSelectedRowData} />
                        </div>
                        <div className='calcul-paiement' style={{ flex: 1 }}>
                            <Box p='5px 20px' borderTop='1px solid #e8e8e8'>
                                <div className='form-controle'>
                                    <Typography
                                        sx={{ display: 'block', mr: 1.5, fontSize: 22 }}
                                        variant='caption'
                                        component={"label"}
                                        className="label"
                                    >Net à Payer (TTC)</Typography>
                                    <Typography
                                        sx={{ display: 'block', mr: 1.5, textAlign: 'right', fontSize: 35 }}
                                        variant='caption'
                                        component={"label"}
                                    >{netPayer}$</Typography>
                                </div>
                            </Box>
                            <Box pb={1} px={1} backgroundColor="#f5f5f5" color="#444">
                                <Box display="flex" justifyContent={'space-between'} alignItems="center">
                                    <Typography variant="caption" color="inherit" sx={{ fontWeight: '600' }}>Taxes</Typography>
                                    <IconButton onClick={() => { setShowTaxes(!showTaxes) }}>
                                        {renderSpreadButtonIcon(showTaxes)}
                                    </IconButton>
                                </Box>
                                {showTaxes &&
                                    <ExtraBillInfoTable data={taxes} />
                                }
                            </Box>
                            <Box py={1.5} component='form' onSubmit={appendMethodePayement}>
                                {selectedPaymentModes.length > 0 &&
                                    <div className="chips-container">
                                        {selectedPaymentModes.map((pMode, i) => (
                                            <Chip
                                                key={"" + pMode.id + i.toString()}
                                                label={`${pMode.nom_mode_payement} : ${pMode.amount} $`}
                                                color={"primary"}
                                                variant="outlined"
                                                sx={{
                                                    mr: 1,
                                                    mt: '3px'
                                                }}
                                                deleteIcon={<Cancel />}
                                                onDelete={() => handleRemovePaymentMode(pMode.id)}
                                            />
                                        ))}
                                    </div>
                                }
                                <div className='form-controle'>
                                    <Typography
                                        sx={{ display: 'block', mr: 1.5 }}
                                        variant='caption'
                                        component={"label"}
                                        htmlFor="np"
                                        className="label"
                                    >Payement</Typography>
                                    <div>
                                        <Select
                                            options={paymentModes}
                                            optionLabel="nom_mode_payement"
                                            value={paymentMode || {}}
                                            style={{ margin: 0, borderColor: errors.paymentMode ? 'red' : '#CDD2D7' }}
                                            onChange={
                                                handleSelectPaymentMode
                                            }
                                        />
                                        {errors.paymentMode &&
                                            <Typography
                                                color="red"
                                                sx={{ display: 'block', fontSize: '10px!important' }}
                                                variant='caption'
                                            >{errors.paymentMode}</Typography>
                                        }
                                    </div>
                                </div>
                                <div className='form-controle'>
                                    <Typography
                                        sx={{ display: 'block', mr: 1.5 }}
                                        variant='caption'
                                        component={"label"}
                                        htmlFor="np"
                                        className="label"
                                    >Montant Payé</Typography>
                                    <TextField
                                        name="np"
                                        id="np"
                                        type="text"
                                        inputMode="decimal"
                                        value={amount}
                                        placeholder={formatNumber(restFromPayment)}
                                        inputProps={{ min: 0 }}
                                        onChange={e => {
                                            const val = e.target.value.trim();
                                            setAmount(getNumberFromInput(val[val.length - 1], val));
                                            setErrors(errs => ({ ...errs, amount: null }));
                                        }}
                                        size="small"
                                        sx={{ m: "0" }}
                                        error={errors.amount ? true : false}
                                        helperText={errors.amount}
                                    />
                                </div>
                                <Box display="flex" justifyContent="flex-end" mt={0.65}>
                                    <Button
                                        variant="outlined"
                                        color="default"
                                        size="small"
                                        startIcon={<Add />}
                                        type="submit"
                                    >
                                        Ajouter
                                    </Button>
                                </Box>
                            </Box>
                            <Box p="20px 0" display={'flex'} justifyContent="center" borderTop='1px solid #e8e8e8'>
                                <Button
                                    className='large-btn'
                                    variant='outlined'
                                    color="default"
                                    size="large"
                                    sx={{ mr: 1 }}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    className='large-btn'
                                    variant='contained'
                                    color="primary"
                                    disableElevation
                                    size="large"
                                    onClick={handleSubmit}
                                >
                                    Confirmer
                                </Button>
                            </Box>
                        </div>
                    </Box>
                </div >
            </StyledBlock >
        </StyledContainer >
    )
}
