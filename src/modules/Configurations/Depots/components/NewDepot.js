import React, { useState, useContext } from 'react';
import { Button, Fade, TextField, Typography, CircularProgress } from '@mui/material';
import { Box, styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { creerMultipleDepot, getSaveState, getValidationErrors, actions } from '../../../../app/reducers/depot';
import LargeDialog from '../../../../Components/Dialogs/LargeDialog';
import { FeedbackContext } from '../../../../App';
import { StyledBoxContainer } from '../../../../app/theme';

const StyledSizeForm = styled('div')(() => ({
    maxWidth: 300,
    border: '1px solid rgb(204, 204, 204)',
    boxShadow: '0px 0px 5px #eaeaea',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    "& .header": {
        padding: '10px',
        borderBottom: '1px solid rgb(204, 204, 204)',
        backgroundColor: '#eeeeee'
    },
    "& form": {
        flex: 1,
        padding: 10,
        "& .form-controle": {
            marginBottom: '10px',
        }
    }
}));

const StyledDepotForm = styled('div')(() => ({
    marginTop: 20,
    "& form": {
        marginTop: 10,
        maxWidth: 850,
        "& .row": {
            display: 'flex',
            alignItems: 'center',
            padding: '8px 10px',
            borderRadius: 5,
            "&:nth-of-type(2n + 1)": {
                backgroundColor: '#ececec70',
            },
            "&.h": {
                backgroundColor: '#e1e1e1',
                boxShadow: '0px 0px 10px #eaeaea'
            }
        },
        "& .col": {
            flex: 1,
            marginRight: 10,
        },
        "& .h .col": {
            textAlign: 'center',
        },
        "& .sm": {
            marginRight: 10,
            width: 30,
        }
    }
}));

export default function NewDepot() {
    const [nbreDepot, setNbreDepot] = useState(0);
    const [openForm, setOpenForm] = useState(false);
    const [depots, setDepots] = useState(new Object());
    const saving = useSelector(getSaveState);
    const validationErrors = useSelector(getValidationErrors);
    const [errors, setErrors] = useState({
        empty: {
            status: false,
            message: ""
        }
    });
    const dispatch = useDispatch();
    const { createFeedback } = useContext(FeedbackContext);

    const toggleDepotForm = (e) => {
        e.preventDefault();
        if (nbreDepot > 0) {
            // Create the depot object of nbreDepot items
            let dpt = { ...depots };
            (new Array(parseInt(nbreDepot))).fill(0).map((v, i) => {
                dpt[i] = {
                    nom_depot: "",
                    code_depot: "",
                    description_depot: ""
                }
            });
            setDepots(dpt);
            // Open the form
            setOpenForm(true);
        }
    }

    // Cancelling the depot form
    const handleCancel = () => {
        setNbreDepot(0);
        setOpenForm(false);
        setDepots({});
    }

    const handleColChange = (row, col, val) => {
        // Get the text field row
        const r = depots[row];
        // Get the error
        const eR = errors[row];
        // Get the text field col state
        r[col] = val;
        // Update the field state value
        setDepots(d => ({
            ...d,
            [row]: r
        }));
        // Check and remove the field error
        if (val !== "" && eR) {
            eR[col] = {
                status: false,
                message: ""
            }
            setErrors(err => ({
                ...err,
                [row]: eR
            }));
        }
    }

    const handleSubmit = () => {
        // Get the depot value array
        const vals = Object.values(depots);
        // Check if All the fields are empty
        const empty = vals.every(val => val.nom_depot === "" && val.code_depot === "");

        if (empty || vals.length === 0) {
            // Global errors
            return setErrors(err => ({
                ...err,
                empty: {
                    status: true,
                    message: 'Remplissez au moins une ligne dans le formulaire de création des dépôts.'
                }
            }));
        }

        // Errors by field
        const err = {};
        // Check if Some field is empty and place it in the err object
        let someEmpy = false;
        vals.forEach((val, i) => {
            if ((val.nom_depot !== "" || val.description_depot !== "") && val.code_depot === "") {
                err[i] = {
                    ...err[i],
                    code: {
                        status: true,
                        message: "Le code est réquis"
                    }
                }
                someEmpy = true;
            }
            if ((val.code_depot !== "" || val.description_depot !== "") && val.nom_depot === "") {
                err[i] = {
                    ...err[i],
                    nom: {
                        status: true,
                        message: "Le nom est réquis"
                    }
                }
                someEmpy = true;
            }
        });
        // Update the errors state if there is at least one error 
        // otherwise send the create request to the server
        if (someEmpy) {
            setErrors({ ...errors, ...err });
        } else {
            // Create the data array
            const data = vals.filter((v, i) => v.nom_depot !== "" && v.code_depot !== "");
            dispatch(creerMultipleDepot({ depots: data })).then((res) => {
                const p = res.payload;
                if (!p.type) {
                    handleCancel();
                    createFeedback(
                        "Création effectuée avec succès !",
                        "creation des dépôts",
                        "success"
                    );
                }
            });
        }
    }

    const handleCloseValidationErrors = () => {
        dispatch(actions.clearValidationErrors());
    }

    return (
        <div>
            <StyledBoxContainer
                maxWidth={300}
            >
                {errors.empty.status &&
                    <LargeDialog
                        message={errors.empty.message}
                        agreeBtnText={"Ok"}
                        onAgree={() => {
                            setErrors(err => ({
                                ...err,
                                empty: {
                                    status: false,
                                    message: ""
                                }
                            }))
                        }}
                        open={errors.empty.status}
                        title="Erreur du formulaire"
                    />}
                {validationErrors.length > 0 &&
                    <LargeDialog
                        message={validationErrors}
                        agreeBtnText={"Ok"}
                        onAgree={handleCloseValidationErrors}
                        open={validationErrors.length > 0}
                        title="Erreur de validation"
                    />
                }
                <Box className="header">
                    <Typography variant="body1">Nouveaux dépôts / magasins</Typography>
                </Box>
                <form onSubmit={toggleDepotForm}>
                    <div className="form-controle">
                        <Typography sx={{ display: 'block' }} variant='caption' component={"label"} htmlFor="nbre_d">Nombre des dépôts</Typography>
                        <Typography
                            variant="caption"
                            className="small description"
                        >Combien de dépôts/magasins voulez-vous créer ?</Typography>
                        <TextField
                            name="nbre_depot"
                            id="nbre_d"
                            type="number"
                            value={nbreDepot}
                            onChange={e => setNbreDepot(e.target.value)}
                            size="small"
                            fullWidth
                            disabled={openForm}
                        />
                    </div>
                    <Button
                        disableElevation
                        variant='contained'
                        color="primary"
                        size='medium'
                        type="submit"
                        disabled={openForm}
                    >Suivant</Button>
                </form>
            </StyledBoxContainer>
            {openForm &&
                <Fade in={openForm}>
                    <StyledDepotForm>
                        <div className="header">
                            <Typography variant='h2'>Formulaire de création des dépôts</Typography>
                        </div>
                        <form>
                            <div className='row h'>
                                <Typography className="sm" variant="body1">N°</Typography>
                                <Typography className="col" variant="body1">Nom dépôt</Typography>
                                <Typography className="col" variant="body1">Code dépôt</Typography>
                                <Typography className="col" variant="body1">Description dépôt</Typography>
                            </div>
                            {(new Array(parseInt(nbreDepot))).fill(0).map((v, i) => (
                                <div className='row' key={i}>
                                    <Typography className="sm" variant="body1">{i + 1}.</Typography>
                                    <Box display="flex" flex={1}>
                                        <TextField
                                            name="nom"
                                            id="nom_d"
                                            type="text"
                                            placeholder='Nom du dépôt'
                                            value={depots[i].nom_depot}
                                            onChange={e => handleColChange(i, 'nom_depot', e.target.value)}
                                            size="small"
                                            fullWidth
                                            sx={{
                                                my: 0,
                                                mr: 1.5,
                                                backgroundColor: '#fff'
                                            }}
                                            error={errors[i] && errors[i].nom && errors[i].nom.status}
                                            helperText={errors[i] && errors[i].nom && errors[i].nom.message}
                                        />
                                        <TextField
                                            name="code"
                                            id="code_d"
                                            type="text"
                                            placeholder='Code du dépôt'
                                            value={depots[i].code_depot}
                                            onChange={e => handleColChange(i, 'code_depot', e.target.value)}
                                            size="small"
                                            fullWidth
                                            sx={{
                                                my: 0,
                                                mr: 1.5,
                                                backgroundColor: '#fff'
                                            }}
                                            error={errors[i] && errors[i].code && errors[i].code.status}
                                            helperText={errors[i] && errors[i].code && errors[i].code.message}
                                        />
                                        <TextField
                                            name="description"
                                            id="desc_d"
                                            type="text"
                                            placeholder='Briève description'
                                            value={depots[i].description_depot}
                                            onChange={e => handleColChange(i, 'description_depot', e.target.value)}
                                            size="small"
                                            fullWidth
                                            sx={{
                                                my: 0,
                                                backgroundColor: '#fff'
                                            }}
                                        />
                                    </Box>
                                </div>
                            ))}
                            <Box my={2} display="flex" justifyContent={"flex-end"}>
                                <Button
                                    variant="outlined"
                                    color="default"
                                    disableElevation
                                    size="medium"
                                    onClick={handleCancel}
                                    disabled={saving}
                                    sx={{
                                        maxWidth: 'fit-content',
                                    }}
                                >Annuler</Button>
                                <Button
                                    variant="contained"
                                    disableElevation
                                    size="medium"
                                    onClick={handleSubmit}
                                    disabled={saving}
                                    sx={{
                                        maxWidth: 'fit-content',
                                        ml: 2,
                                        minWidth: 105.19,
                                        minHeight: 36.5
                                    }}
                                >
                                    {saving ? (
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
                    </StyledDepotForm>
                </Fade>
            }
        </div>
    )
}
