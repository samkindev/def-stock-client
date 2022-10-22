import { Button, CircularProgress, Fade, ListItemIcon, ListItemText, MenuItem, MenuList, TextField, Typography } from '@mui/material';
import { Box, styled } from '@mui/system';
import React, { useState, useContext, useEffect } from 'react';
import { FeedbackContext } from '../../../../App';
import { LargeDialog, MenuPoppover } from '../../../../Components';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { StyledBoxContainer as StyledContainer } from '../../../../app/theme';

// const StyledContainer = styled('div')(() => ({
//     minWidth: 550,
//     marginTop: 30,
//     border: '1px solid rgb(204, 204, 204)',
//     boxShadow: '0px 0px 5px #eaeaea',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     overflow: 'hidden',
//     display: 'flex',
//     flexDirection: 'column',
//     "& .header": {
//         padding: '10px',
//         borderBottom: '1px solid rgb(204, 204, 204)',
//         backgroundColor: '#eeeeee',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//     },
//     "& .body": {
//         flex: 1,
//         display: 'flex',
//         flexDirection: 'row-reverse',
//         "& > *": {
//             flex: 1,
//             padding: 10,
//         },
//         "& .blue": {
//             backgroundColor: '#bfd8fb',
//         },
//         "& .sub-list": {
//             borderRight: '1px solid #eaeaea',
//             maxHeight: 250,
//             overflow: 'auto',
//         },
//     }
// }));

const StyledBody = styled('div')(() => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'row-reverse',
    "& > *": {
        flex: 1,
        padding: 10,
    },
    "& .blue": {
        backgroundColor: '#bfd8fb',
    },
    "& .sub-list": {
        borderRight: '1px solid #eaeaea',
        maxHeight: 250,
        overflow: 'auto',
    },
}));

const StyledListItem = styled('div')(() => ({
    marginBottom: 5,
    "& .name": {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        "&:hover": {
            textDecoration: 'underline',
        },
        "& .icon": {
            marginRight: 5,
            border: '1px solid #eaeaea',
            borderRadius: 2,
            display: 'flex',
            maxWidth: 'fit-content',
            maxHeight: 'fit-content',
        }
    },
    "&.child": {
        marginLeft: 32

    }
}));

const StyledMenu = styled("div")(() => ({
    backgroundColor: "#fff",
    padding: 10,
}));

export default function DepotSubdivision({ depot }) {
    const [subs, setSubs] = useState([]);
    const [selectedSub, setSelectedSub] = useState();
    const [parentSub, setParentSub] = useState(null);
    const [nom, setNom] = useState("");
    const [code, setCode] = useState("");
    const [niveau, setNiveau] = useState(0);
    const [modify, setModify] = useState(false);
    const [addChild, setAddChild] = useState(false);
    const [loading, setloading] = useState(false);
    const [errors, setErrors] = useState({
        server: null,
        nom: null,
        code: null
    });
    const [saving, setSaving] = useState(false);
    const { createFeedback } = useContext(FeedbackContext);

    const resetAll = () => {
        setNom("");
        setCode("");
        setNiveau(0);
        setErrors({
            nom: null,
            code: null
        });
    }

    const toggleModify = () => {
        setModify(!modify);
        if (modify) {
            setSelectedSub(null);
        }
    }

    const toggleAddChild = (sub) => {
        if (!addChild) {
            setParentSub(sub);
        } else {
            setParentSub(null);
            setNiveau(0)
        }
        setAddChild(!addChild);
    }

    const validate = () => {
        let valid = true;
        if (nom === "") {
            valid = false;
            setErrors(err => ({
                ...err,
                nom: "Le nom est réquis."
            }));
        }
        if (code === "") {
            valid = false;
            setErrors(err => ({
                ...err,
                code: "Le nom est réquis."
            }));
        }

        return valid;
    }

    const handleCommitUpdate = async (e) => {
        e.preventDefault();
        // Verify if the data are valid
        let valid = validate();
        if (valid) {
            setSaving(true);
            const data = {
                depotId: depot.id,
                nom_subdivision: nom,
                code_subdivision: code,
                niveau
            }
            try {
                let p = await axios.patch('/api/subdivision/' + selectedSub.id, data);
                const d = p.data;
                if (d && d.status === 'success') {
                    createFeedback(
                        "Mise à jour effectuée avec succès !",
                        "mise à jour d'un emplacement de dépôt",
                        "success"
                    );
                    let sbs = []
                    if (d.grand_parent) {
                        sbs = subs.map(s => {
                            if (s.id === d.grand_parent.id) {
                                return d.grand_parent;
                            }
                            return s;
                        });
                    } else {
                        sbs = subs.map(s => {
                            if (s.id === d.subdivision.id) return d.subdivision;
                            return s;
                        });
                    }
                    setSubs(sbs);
                    resetAll();
                    setModify(false);
                } else if (d.type) {
                    setErrors(err => ({
                        ...err,
                        server: d.errors
                    }));
                } else {
                    setErrors(err => ({
                        ...err,
                        server: d.message
                    }));
                }
            } catch (error) {
                setErrors(err => ({
                    ...err,
                    server: "Une erreur s'est produite."
                }));
            } finally {
                setSaving(false);
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Verify if the data are valid
        let valid = validate();

        if (valid) {
            setSaving(true);
            const data = {
                depot: depot.id,
                nom,
                code,
                niveau,
                parent: parentSub && parentSub.id
            }
            try {
                let p = await axios.post('/api/subdivision', data);
                const d = p.data;
                if (d && d.status === 'success') {
                    createFeedback(
                        "Création effectuée avec succès !",
                        "création d'un emplacement de dépôt",
                        "success"
                    );
                    setSubs(subs => [...subs, d.subdivision]);
                    resetAll();
                } else if (d.type) {
                    setErrors(err => ({
                        ...err,
                        server: d.errors
                    }));
                } else {
                    setErrors(err => ({
                        ...err,
                        server: d.message
                    }));
                }
            } catch (error) {
                setErrors(err => ({
                    ...err,
                    server: error.message
                }));
            } finally {
                setSaving(false);
            }
        }
    }

    const handleSubmitChild = async (e) => {
        e.preventDefault();
        // Verify if the data are valid
        let valid = validate();

        if (valid) {
            setSaving(true);
            const data = {
                depot: depot.id,
                nom,
                code,
                niveau: parentSub.niveau + 1,
            }
            try {
                let p = await axios.post('/api/subdivision/' + parentSub.id, data);
                const d = p.data;
                if (d && d.status === 'success') {
                    createFeedback(
                        "Création effectuée avec succès !",
                        "création d'un emplacement de dépôt",
                        "success"
                    );
                    const sbs = subs.map(s => {
                        if (s.id === d.grand_parent.id) {
                            return d.grand_parent;
                        }
                        return s;
                    });
                    setSubs(sbs);
                    setAddChild(false);
                    setSelectedSub(null);
                    setParentSub(null);
                    resetAll();
                } else if (d.type) {
                    setErrors(err => ({
                        ...err,
                        server: d.errors
                    }));
                } else {
                    setErrors(err => ({
                        ...err,
                        server: d.message
                    }));
                }
            } catch (error) {
                setErrors(err => ({
                    ...err,
                    server: error.message
                }));
            } finally {
                setSaving(false);
            }
        }
    }

    const handleCloseServerErrors = () => {
        setErrors(err => ({ ...err, server: null }));
    }

    function renderEmplacementTree(sub, ch) {
        return (
            <ListItem
                key={sub.id}
                sub={sub}
                className={ch ? "child" : ""}
                subs={subs}
                setSelectedSub={() => setSelectedSub(sub)}
                setErrors={setErrors}
                setSubs={setSubs}
                toggleModify={toggleModify}
                modify={modify}
                toggleAddChild={() => toggleAddChild(sub)}
            >
                {sub.child && sub.child.map(ch => renderEmplacementTree(ch, true))}
            </ListItem>
        );
    }

    useEffect(() => {
        setloading(true);
        axios.get(`/api/depot/${depot.id}/subdivision`).then(res => {
            const d = res.data;
            setSubs(d);
        }).catch(error => {
            setErrors(err => ({ ...err, server: error }));
        }).finally(() => setloading(false));
    }, [depot]);

    useEffect(() => {
        setNom(selectedSub ? selectedSub.nom_subdivision : "");
        setCode(selectedSub ? selectedSub.code_subdivision : "");
    }, [selectedSub]);

    return (
        <StyledContainer
            width='100%'
            maxWidth={1200}
        >
            {errors.server &&
                <LargeDialog
                    message={errors.server}
                    agreeBtnText={"Ok"}
                    onAgree={handleCloseServerErrors}
                    open={errors.server ? true : false}
                    title="Erreur de validation"
                />
            }
            <div className="header">
                <Typography variant="caption">Subdivision du dépôt / Emplacements dans le dépôt</Typography>
            </div>
            <StyledBody>
                <form
                    className={(modify || addChild) ? "blue" : ""}
                    onSubmit={modify ? handleCommitUpdate : addChild ? handleSubmitChild : handleSubmit}
                >
                    <Typography
                        sx={{ display: 'block' }}
                        variant='caption'
                        component={"label"}
                        htmlFor="code"
                    >
                        {modify ?
                            "Modifiez un emplacement : " + selectedSub.nom_subdivision :
                            addChild ?
                                "Ajoutez un sous emplacement de " + parentSub.code_subdivision :
                                "Ajoutez un nouvel emplacement"
                        }
                    </Typography>
                    <Typography
                        variant="caption"
                        className="small description"
                    >{!modify ? `Exemple : "Emplacement 1 et ET001"` : ""}</Typography>
                    <div className="form-controle">
                        <TextField
                            name="nom"
                            id="nom"
                            type="text"
                            placeholder="Nom de l'emplacement"
                            value={nom}
                            onChange={e => setNom(e.target.value)}
                            size="small"
                            fullWidth
                            sx={{ m: '5px 0 0', backgroundColor: '#fff' }}
                        />
                    </div>
                    <div className="form-controle">
                        <TextField
                            name="code"
                            id="code"
                            type="text"
                            placeholder="Code de l'emplacement"
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            size="small"
                            fullWidth
                            sx={{ m: '5px 0 0', backgroundColor: '#fff' }}
                        />
                    </div>
                    <Box display="flex" justifyContent="flex-end" mt={1}>
                        {(modify || addChild) &&
                            <Button
                                variant="outlined"
                                color="default"
                                disableElevation
                                size="medium"
                                onClick={addChild ? toggleAddChild : toggleModify}
                            >Annuler</Button>
                        }
                        <Button
                            variant="contained"
                            disableElevation
                            size="medium"
                            type="submit"
                            disabled={saving}
                            sx={{
                                maxWidth: 'fit-content',
                                ml: 2,
                                minWidth: 80.19,
                                minHeight: 36.5
                            }}
                        >
                            {saving ? (
                                <span>
                                    En cours ...
                                    <CircularProgress
                                        size={12}
                                        color="inherit"
                                    />
                                </span>
                            ) : (
                                modify ? "Modifier" : "Ajouter"
                            )}
                        </Button>
                    </Box>
                </form>
                <div className="sub-list">
                    <Typography
                        sx={{ display: 'block' }}
                        variant='caption'
                        component={"label"}
                        htmlFor="code"
                    >Liste des emplacements</Typography>
                    <Box mt={1} className="sub-tree">
                        {loading ?
                            <Typography variant="caption" className="small">Chargement ...</Typography> :
                            subs.map(sub => renderEmplacementTree(sub))
                        }
                    </Box>
                </div>
            </StyledBody >
        </StyledContainer>
    )
}

const ListItem = ({ children, className, sub, setSelectedSub, subs, setSubs, setErrors, toggleModify, modify, toggleAddChild }) => {
    const [del, setDel] = useState(false);
    const [expand, setExpand] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const opendialog = Boolean(anchorEl);
    const [deleting, setdeleting] = useState(false);
    const { createFeedback } = useContext(FeedbackContext);

    const handleSubClick = (ev, sub) => {
        setAnchorEl(ev.currentTarget);
    }

    const handleCloseDialog = () => {
        setAnchorEl(null);
    }

    const toggleDelete = () => {
        setDel(!del);
    }

    const toggleExpand = () => {
        setExpand(!expand);
    }

    const confirmDelete = async () => {
        setdeleting(true);
        try {
            const response = await axios.delete('/api/subdivision/' + sub.id);
            const d = response.data;

            if (d.status === 'success') {
                setdeleting(false);
                toggleDelete();
                createFeedback(
                    "Suppression effectuée avec succès !",
                    "supppression d'un emplacement de dépôt",
                    "warning"
                );
                let sbs = [];
                if (d.grand_parent) {
                    sbs = subs.map(s => {
                        if (s.id === d.grand_parent.id) {
                            return d.grand_parent;
                        }
                        return s;
                    });
                } else {
                    sbs = subs.filter(s => s.id !== sub.id);
                }
                setSubs(sbs);
            } else {
                setdeleting(false);
                setErrors(err => ({ ...err, server: d.message }));
            }
        } catch (error) {
            setErrors(err => ({ ...err, server: error.message }));
        }
    }

    return (
        <>
            {opendialog &&
                <MenuPoppover
                    anchorEl={anchorEl}
                    open={opendialog}
                    handleClose={handleCloseDialog}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}>
                    <StyledMenu>
                        <Menu
                            closeHandler={handleCloseDialog}
                            deleteHandler={toggleDelete}
                            toggleModify={toggleModify}
                            setSelectedSub={setSelectedSub}
                            modify={modify}
                            toggleAddChild={toggleAddChild}
                        />
                    </StyledMenu>
                </MenuPoppover>
            }
            {del &&
                <LargeDialog
                    message="Voulez-vous supprimer cet emplacement ?"
                    agreeBtnText={"Ok"}
                    disagreeBtnText="Annuler"
                    onAgree={confirmDelete}
                    onDisagree={toggleDelete}
                    open={del}
                    title="Suppression"
                    loading={deleting}
                />
            }
            <StyledListItem className={className}>
                <div className="name">
                    <span className="icon" onClick={toggleExpand}>
                        {(sub.child && sub.child.length > 0 && !expand) ?
                            <AddIcon fontSize='small' sx={{ fontSize: '0.8rem' }} /> :
                            <RemoveIcon fontSize='small' sx={{ fontSize: '0.8rem' }} />}
                    </span>
                    <Typography onClick={(e) => handleSubClick(e, sub)} sx={{ fontSize: 14 }} variant="caption">{sub.nom_subdivision} ({sub.code_subdivision})</Typography>
                </div>
                {expand &&
                    <Fade in={expand}>
                        <div>
                            {children}
                        </div>
                    </Fade>
                }
            </StyledListItem>
        </>
    )
}

const Menu = ({ closeHandler, deleteHandler, toggleModify, setSelectedSub, modify, toggleAddChild }) => {
    const onClick = (action) => {
        switch (action) {
            case 'del':
                deleteHandler();
                break;
            case 'add':
                toggleAddChild();
                break;
            case 'edit':
                setSelectedSub();
                if (!modify) {
                    toggleModify();
                }
                break;
            default:
                break;
        }
        closeHandler();
    }
    return (
        <MenuList>
            <MenuItem onClick={() => onClick('del')}>
                <ListItemIcon>
                    <DeleteOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Supprimer</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => onClick('edit')}>
                <ListItemIcon>
                    <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Modifier</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => onClick('add')}>
                <ListItemIcon>
                    <AddIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Ajouter un emplacement</ListItemText>
            </MenuItem>
        </MenuList>
    )
}