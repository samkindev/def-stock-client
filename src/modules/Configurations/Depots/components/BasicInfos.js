import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSaveState, updateGeneralDepotData, getValidationErrors, getError, actions } from '../../../../app/reducers/depot';
import { Box, styled } from '@mui/system';
import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import { LargeDialog, Select } from '../../../../Components';
import { FeedbackContext } from '../../../../App';
import { StyledBoxContainer as StyledDepotContainder } from '../../../../app/theme';

const typesStock = [
    {
        id: 0,
        label: 'Marchandise',
        value: 'marchandise',
    },
    {
        id: 1,
        label: 'Matière prémière',
        value: 'mp'
    },
    {
        id: 2,
        label: 'Produit finit',
        value: 'pf',
    },
    {
        id: 3,
        label: 'Fourniture interne',
        value: 'fi'
    },
    {
        id: 4,
        label: 'Autre',
        value: 'autre',
    }
]

export default function BasicInfos({ depot }) {
    const [modify, setModify] = useState(false);
    const [nom, setNom] = useState("");
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [typeStock, setTypeStock] = useState(null);
    const saving = useSelector(getSaveState);
    const [changed, setChanged] = useState({
        nom: false,
        code: false,
        description: false,
        address: false,
        typeStock: false,
    });
    const dispatch = useDispatch();
    const { createFeedback } = useContext(FeedbackContext);
    const serverError = useSelector(getError);
    const validatationErrors = useSelector(getValidationErrors)

    // Enable or disable the modification of the depot
    const toggleModif = () => {
        setModify(!modify);
        setChanged({
            nom: false,
            code: false,
            description: false,
            address: false,
            typeStock: false,
        });
    }
    // Submit the depot general updates
    const handleSubmit = () => {
        let data = new Object();
        if (changed.nom) {
            data = {
                nom_depot: nom
            }
        }
        if (changed.code) {
            data = {
                ...data,
                code_depot: code,
            }
        }
        if (changed.address) {
            data = {
                ...data,
                adresse: address,
            }
        }
        if (changed.typeStock) {
            data = {
                ...data,
                type_stock: typeStock.value,
            }
        }
        if (changed.description) {
            data = {
                ...data,
                description_depot: description,
            }
        }
        if (Object.keys(data).length > 0) {
            dispatch(updateGeneralDepotData({ id: depot.id, data })).then((res) => {
                const p = res.payload;
                if (p && p.status === "success") {
                    toggleModif();
                    createFeedback(
                        "Mise à jour effectuée avec succès !",
                        "mise à jour d'un dépôt",
                        "success"
                    );
                }
            });
        }
    }
    const handleSelectTypeStock = (typeStock) => {
        setTypeStock(typeStock);
        setChanged(ch => ({
            ...ch,
            typeStock: true
        }));
    }
    const handleCloseServerErrors = () => {
        dispatch(actions.clearValidationErrors());
        dispatch(actions.clearError());
    }

    useEffect(() => {
        if (depot) {
            setNom(depot.nom_depot ? depot.nom_depot : "");
            setCode(depot.code_depot ? depot.code_depot : "");
            setDescription(depot.description_depot ? depot.description_depot : "");
            setAddress(depot.adresse ? depot.adresse : "");
            setTypeStock(depot.type_stock ? typesStock.find(tS => tS.value === depot.type_stock) : null);
        }
    }, [depot]);


    return (
        <StyledDepotContainder
            maxWidth={300}
            minWidth={300}
        >
            {(validatationErrors.length > 0 || serverError) &&
                <LargeDialog
                    message={
                        serverError ?
                            serverError instanceof Array ?
                                [...serverError, ...validatationErrors] :
                                [{ msg: serverError }, ...validatationErrors] :
                            validatationErrors
                    }
                    agreeBtnText={"Ok"}
                    onAgree={handleCloseServerErrors}
                    open={validatationErrors.length > 0 || serverError !== null || serverError !== undefined}
                    title="Erreur de validation"
                />
            }
            <div className="header">
                <Typography variant="caption" className="title">Infos de base</Typography>
                <Button
                    disableElevation
                    variant='outlined'
                    color="default"
                    size='small'
                    type="submit"
                    onClick={toggleModif}
                >{modify ? "Annuler" : "Modifier"}</Button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-controle">
                    <Typography
                        sx={{ display: 'block' }}
                        variant='caption'
                        component={"label"}
                        htmlFor="nom_d"
                    >Nom du dépôt</Typography>
                    <TextField
                        name="nom"
                        id="nom_d"
                        type="text"
                        placeholder="Nom dépôt"
                        value={nom}
                        onChange={e => {
                            setNom(e.target.value);
                            setChanged(ch => ({
                                ...ch,
                                nom: true
                            }))
                        }}
                        size="small"
                        fullWidth
                        InputProps={{
                            readOnly: !modify
                        }}
                    />
                </div>
                <div className="form-controle">
                    <Typography
                        sx={{ display: 'block' }}
                        variant='caption'
                        component={"label"}
                        htmlFor="code_d"
                    >Code du dépôt</Typography>
                    <TextField
                        name="code"
                        id="code_d"
                        type="text"
                        placeholder="Code dépôt"
                        value={code}
                        onChange={e => {
                            setCode(e.target.value);
                            setChanged(ch => ({
                                ...ch,
                                code: true
                            }))
                        }}
                        size="small"
                        fullWidth
                        InputProps={{
                            readOnly: !modify
                        }}
                    />
                </div>
                <div className="form-controle">
                    <Typography
                        sx={{ display: 'block' }}
                        variant='caption'
                        component={"label"}
                        htmlFor="adr_d"
                    >Adresse du dépôt</Typography>
                    <TextField
                        name="address"
                        id="adr_d"
                        type="text"
                        value={address}
                        onChange={e => {
                            setAddress(e.target.value);
                            setChanged(ch => ({
                                ...ch,
                                address: true
                            }))
                        }}
                        size="small"
                        fullWidth
                        InputProps={{
                            readOnly: !modify
                        }}
                    />
                </div>
                <div className="form-controle">
                    <Typography
                        sx={{ display: 'block' }}
                        variant='caption'
                        component={"label"}
                        htmlFor="description_d"
                    >Type de stock</Typography>
                    <Select
                        options={typesStock}
                        value={typeStock}
                        disabled={!modify}
                        onChange={
                            handleSelectTypeStock
                        }
                    />
                </div>
                <div className="form-controle">
                    <Typography
                        sx={{ display: 'block' }}
                        variant='caption'
                        component={"label"}
                        htmlFor="description_d"
                    >Description du dépôt</Typography>
                    <TextField
                        name="desc"
                        id="description_d"
                        type="text"
                        placeholder="Une petite description du dépôt"
                        value={description}
                        onChange={e => {
                            setDescription(e.target.value);
                            setChanged(ch => ({
                                ...ch,
                                description: true
                            }))
                        }}
                        size="small"
                        multiline
                        rows={3}
                        fullWidth
                        InputProps={{
                            readOnly: !modify
                        }}
                    />
                </div>
                <Box display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        disableElevation
                        size="medium"
                        onClick={handleSubmit}
                        disabled={!Object.values(changed).some(v => v)}
                        sx={{
                            maxWidth: 'fit-content',
                            ml: 2,
                            minWidth: 105.19,
                            minHeight: 36.5
                        }}
                    >
                        {(saving && Object.values(changed).some(v => v)) ? (
                            <span>
                                Enregistrement ...
                                <CircularProgress
                                    size={12}
                                    color="inherit"
                                />
                            </span>
                        ) : (
                            "Enregistrer"
                        )}
                    </Button>
                </Box>
            </form>
        </StyledDepotContainder>
    )
}
