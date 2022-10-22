import styled from '@emotion/styled';
import React, { useEffect, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Radio, FormControlLabel, Divider, Fade, Button, CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { Select } from "../../../../Components";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { updateGeneralDepotData } from '../../../../app/reducers/depot';
import { FeedbackContext } from '../../../../App';
import { StyledBoxContainer as StyledContainer } from '../../../../app/theme';

const StyledWrapper = styled("div")(() => ({
    padding: 10,
    maxWidth: 700,
    margin: 'auto'
}));

const StyledTreeController = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    "& > label > span:last-child": {
        color: "#000",
    },
    "&:not(:last-child)": {
        marginBottom: 15,
    },
    "&.inline": {
        marginBottom: 0,
        "&:not(:last-child)": {
            marginRight: 15,
        },
    },
    "& .child1": {
        marginLeft: 27,
    },
    "& .child2": {
        marginLeft: 25,
    },
    "& .title": {
        color: "#444",
        fontWeight: "600",
        lineHeight: 1.3,
        marginBottom: "8px!important",
    },
    "& .description": {
        color: "#666",
        lineHeight: 1.3,
        marginBottom: "8px!important",
    },
}));

const methodesValorisation = [
    {
        id: 0,
        label: "CUMP après chaque entrée (Inventaire permanent)",
        value: "cump-ace",
        description: "Dans ce cas, le coût unitaire est calculé après chaque entrée."
    },
    {
        id: 1,
        label: "CUMP calculé sur la durée moyenne de stockage (Inventaire intermittent)",
        value: "cump-dm",
        description: "Le coût unitaire est calculé sur les entrées enregistrée pendant une période bien déterminée."
    },
    {
        id: 2,
        label: "Premier entré - premier sorti (PEPS ou FIFO) avec contrainte des dates d'expiration",
        value: 'fifo-exp',
        description:
            "Dans ce cas la contrainte des dates d'expiration est prioritaire, et puis vient la contrainte des dates d'entrée.",
    },
    {
        id: 3,
        label: "Premier entré - premier sorti (PEPS ou FIFO) sans contrainte d'expiration",
        value: "fifo",
        description:
            "Les produits sortent du stock selon la méthode du premier entrée - premier sorti sans tenir compte des dates d'expiration.",
    },
];

const methodesReaprovisionnement = [
    {
        label: "Méthode de réapprovisionnement différente par produit",
        value: "par produit",
        description: "La méthode d'approvisionnement sera choisie et ajoutée à chaque produit lors de sa création.",
    },
    {
        label: "Réapprovisionnement par la méthode calendaire",
        value: "Réapprovisionnement calendaire",
        description: `Avec cette méthode, une
                                    notification vous sera envoyée à
                                    une date fixe pour
                                    approvisionner un produit donné
                                    pour une quantité fixe.`,
    },
    {
        label: "Réapprovisionnement par la méthode de recomplètement",
        value: "méthode de recomplètement",
        description: `Avec cette méthode, vous
                                    commandez autant que nécessaire
                                    pour revenir au niveau de stock
                                    maximum défini au préalable.`,
    },
    {
        label: "Réapprovisionnement par la méthode du point de commande (juste-à-temps)",
        value: "méthode du point de commande",
        description: `Avec cette méthode, vous
                                    recevrez une notification
                                    lorsque le stock critique (stock minimal) d'un
                                    des produits est atteint.`,
    },
    {
        label: "Réapprovisionnement à la commande",
        value: "réapprovisionnement à la commande",
        description: `Avec cette méthode, vous allez
                                    commander des quantités
                                    variables à des dates variables.`,
    },
]

export default function ConfigGestionStocksDepot({ depot }) {
    const [expandValorisation, setExpandValorisation] = useState(true);
    const [expandReaprov, setExpandReaprov] = useState(false);
    const [methodeValorisation, setMethodeValorisation] = useState(
        depot ? methodesValorisation.find(m => m.value === depot.methode_valorisation) :
            methodesValorisation[3]
    );
    const [gestionStockMethod, setGestionStockMethod] = useState(
        depot ? depot.methode_reaprovisionnement :
            methodesReaprovisionnement[3].value
    );
    const [saving, setSaving] = useState(false);
    const [changed, setChanged] = useState({
        mv: false,
        mr: false
    });
    const dispatch = useDispatch();
    const { createFeedback } = useContext(FeedbackContext);

    const toggleExpand = (type) => {
        if (type === "valorisation") {
            setExpandValorisation(!expandValorisation);
        } else if (type === "reaprov") {
            setExpandReaprov(!expandReaprov);
        }
    }
    const isActiveMethodeGestionStock = (val) => {
        return gestionStockMethod === val;
    }

    const handleSelectMethodeValorisation = (methode) => {
        setMethodeValorisation(methode);
    }

    const handleSubmit = async () => {
        // Verify if the data are valid
        let data = null
        if (changed.mv) {
            data = {
                methode_valorisation: methodeValorisation.value
            }
        }
        if (changed.mr) {
            data = {
                methode_reaprovisionnement: gestionStockMethod
            }
        }

        if (data) {
            setSaving(true);
            dispatch(updateGeneralDepotData({ id: depot.id, data })).then((res) => {
                const p = res.payload;
                setSaving(false);
                if (p && p.status === "success") {
                    createFeedback(
                        "Mise à jour effectuée avec succès !",
                        "mise à jour d'un dépôt",
                        "success"
                    );
                } else {

                }
            });
        }
    }

    const setDefaultParameters = () => {
        setMethodeValorisation(methodesValorisation[3]);
        setGestionStockMethod(methodesReaprovisionnement[3].value);
    }

    useEffect(() => {
        if (depot && methodeValorisation.value !== depot.methode_valorisation) {
            setChanged(ch => ({
                ...ch,
                mv: true,
            }));
        }
        if (depot && gestionStockMethod !== depot.methode_reaprovisionnement) {
            setChanged(ch => ({
                ...ch,
                mr: true,
            }));
        }
    }, [methodeValorisation, gestionStockMethod, depot]);

    return (
        <StyledContainer
            width='100%'
            maxWidth={1200}
        >
            <div className="header">
                <Typography variant="caption">Paramètres des stocks dans le depot</Typography>
            </div>
            <div className="body">
                <StyledWrapper>
                    <StyledTreeController>
                        <BlockDivider
                            title="Méthode de valorisation des sorties"
                            contentToggler={() => toggleExpand('valorisation')}
                            open={expandValorisation}
                        />
                        {expandValorisation &&
                            <Fade in={expandValorisation}>
                                <div className="child1">
                                    <Typography
                                        variant="caption"
                                        className="small description"
                                    >
                                        Pour la valorisation des sorties de stock,
                                        séléctionnez une méthode. Lors des sorties
                                        le coût unitaire sera calculé en fonction de
                                        cette méthode.
                                    </Typography>
                                    <Select
                                        options={methodesValorisation}
                                        value={methodeValorisation}
                                        onChange={
                                            handleSelectMethodeValorisation
                                        }
                                    />
                                </div>
                            </Fade>
                        }
                    </StyledTreeController>
                    <StyledTreeController>
                        <BlockDivider
                            title="La méthode de réapprovisionnement des stocks"
                            contentToggler={() => toggleExpand('reaprov')}
                            open={expandReaprov}
                        />
                        {expandReaprov &&
                            <Fade in={expandReaprov}>
                                <Box className="child1" display={"flex"} flexDirection="column">
                                    <Typography
                                        variant="caption"
                                        className="small description"
                                    >
                                        Vous recevrez les notifications de
                                        réapprovisionnement de stock selon la
                                        méthode que vous choisissez.
                                    </Typography>
                                    {methodesReaprovisionnement.map(methode => (
                                        <StyledTreeController key={methode.value}>
                                            <FormControlLabel
                                                onChange={() =>
                                                    setGestionStockMethod(methode.value)
                                                }
                                                label={methode.label}
                                                componentsProps={{
                                                    typography: {
                                                        variant: "caption",
                                                        className: "small",
                                                    },
                                                }}
                                                checked={isActiveMethodeGestionStock(methode.value)}
                                                control={
                                                    <Radio
                                                        color="default"
                                                        size="small"
                                                    />
                                                }
                                                sx={{
                                                    mb: 0.5,
                                                    "& > span:first-of-type": {
                                                        marginRight: 0.5,
                                                    },
                                                }}
                                            />
                                            <Typography
                                                variant="caption"
                                                className="small description child2"
                                            >
                                                {methode.description}
                                            </Typography>
                                        </StyledTreeController>
                                    ))}
                                </Box>
                            </Fade>
                        }
                    </StyledTreeController>
                </StyledWrapper>
            </div>
            <div className="footer">
                <Button
                    variant="outlined"
                    color="default"
                    disableElevation
                    size="medium"
                    onClick={setDefaultParameters}
                    sx={{
                        maxWidth: 'fit-content',
                    }}
                >Concerver les paramètres par défaut</Button>
                <Button
                    variant="contained"
                    disableElevation
                    size="medium"
                    onClick={handleSubmit}
                    disabled={!changed.mr && !changed.mv}
                    sx={{
                        maxWidth: 'fit-content',
                        ml: 2,
                        minWidth: 105.19,
                        minHeight: 36.5
                    }}
                >
                    {(saving && (changed.mr || changed.mv)) ? (
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
            </div>
        </StyledContainer>
    )
}

const BlockDivider = ({ contentToggler, title, open }) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            onClick={contentToggler}
        >
            <Typography
                variant="h2"
                sx={{ mb: 1, mt: 1, cursor: "pointer" }}
            >
                {title}
            </Typography>
            <Divider
                sx={{
                    flex: 1,
                    ml: 1,
                    cursor: "pointer",
                }}
            />
            {!open ? (
                <KeyboardArrowDownIcon
                    sx={{
                        border: "1px solid #eaeaea",
                        ml: 1,
                        borderRadius: "50%",
                        cursor: "pointer",
                    }}
                    fontSize="medium"
                    color="default"
                    onClick={contentToggler}
                />
            ) : (
                <KeyboardArrowUpIcon
                    sx={{
                        border: "1px solid #eaeaea",
                        ml: 1,
                        borderRadius: "50%",
                        cursor: "pointer",
                    }}
                    fontSize="medium"
                    color="default"
                    onClick={contentToggler}
                />
            )}
        </Box>
    )
}