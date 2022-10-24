import React, { useState, useContext, useEffect } from 'react';
import { IconButton, Modal, Typography, Button, CircularProgress } from '@mui/material';
import { styled, Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from "@mui/icons-material/Search";
import ProduitForm from './ProduitForm';
import { CategoryContext } from '../../../../app/Navigations/ProduitConfigRouts';
import { LoadingModal, ProduitCategoriesTreeView } from '../../../../Components';
import axios from 'axios';

const StyledContainer = styled("div")(() => ({
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: "center",
    padding: '15px 0'
}));

const StyledContentContainer = styled('div')(() => ({
    backgroundColor: "#fff",
    width: "90vw",
    height: "90vh",
    overflowY: "auto",
    padding: "0px 0",
    boxShadow: "0px 6px 20px 13px #52525257",
    border: "1px solid #b6b6b6",
    "& .header": {
        padding: '6px 10px',
        borderBottom: '1px solid rgb(204, 204, 204)',
        backgroundColor: '#eeeeee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    "& .title": {
        fontWeight: '600!important',
    },
    "& .body": {
        display: 'flex',
        width: '100%',
        height: "calc(100% - 50px)",
        "& > *": {
            height: '100%',
            overflowY: 'auto'
        }
    },
    "& .category": {
        borderRight: '1px solid rgb(204, 204, 204)',
        width: "300px",
        display: 'flex',
        flexDirection: 'column',
        "& .list-header": {
            padding: '15px 10px 5px',
            borderBottom: '1px solid #eaeaea'
        },
        "& .categories-list": {
            flex: 1,
            maxHeight: "calc(100% - 295px)",
            overflowY: 'auto',
            paddingTop: 5
        },
        "& .category-info": {
            height: 200,
            display: 'flex',
            flexDirection: 'column',
            "& .label": {
                padding: '5px 10px',
                backgroundColor: '#d8d7d7',
            },
            "& .info": {
                overflow: 'auto',
                backgroundColor: '#f9f9f9',
                flex: 1,
                padding: 10,
                "& li": {
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid #eaeaea',
                    padding: '2px 0',
                    "& > *": {
                        flex: 1,
                        fontSize: '13px!important',
                        fontStyle: 'italic'
                    },
                    "& > *:last-child": {
                        textAlign: 'right',
                    },
                    "& > *:first-of-type": {
                        fontWeight: '800!important',
                    }
                }
            }
        }
    },
}));

const StyledBox = styled(Box)(({ theme }) => ({
    border: "1px solid #eaeaea",
    borderRadius: 5,
    padding: "3px 5px 3px 14px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    backgroundColor: theme.palette.common.white,
}));

const StyledInput = styled("input")(() => ({
    border: "none",
    outline: 0,
    fontSize: 15,
    paddingRight: 5,
    flex: 1,
    backgroundColor: "inherit",
}));

export default function NewProduitForm({ onClose, categories }) {
    const { loading } = useContext(CategoryContext);
    const [displayedCategories, setDisplayedCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [query, setQuery] = useState("");
    const [gettingType, setGettingType] = useState(false);
    const [searching, setSearching] = useState(false);
    const [searchingError, setSearchingError] = useState(null);

    const handleSubmitSearch = (e) => {
        e.preventDefault();
        if (query !== "") {
            setSearching(true);
            axios
                .get('https://def-api.herokuapp.com/api/type_produit/search/' + query)
                .then(res => {
                    const d = res.data;
                    setDisplayedCategories(d);
                })
                .catch(err => {
                    setSearchingError("Une erreur s'est produite pendant la recherche.");
                }).finally(() => setSearching(false));
        } else {
            setDisplayedCategories(categories);
        }
    }

    useEffect(() => {
        if (selectedCategoryId) {
            setGettingType(true);
            axios.get(`https://def-api.herokuapp.com/api/type_produit/${selectedCategoryId}`)
                .then(res => {
                    const d = res.data;
                    if (d.type) {
                        setSelectedType(d.type);
                    }
                }).catch(err => {
                    console.log(err);
                }).finally(() => setGettingType(false));
        }
    }, [selectedCategoryId]);

    useEffect(() => {
        if (query === "") {
            setTimeout(() => {
                setDisplayedCategories(categories);
            }, 1000);
        }
    }, [query, categories]);
    return (
        <Modal
            open={true}
            onClose={onClose}
            BackdropProps={{
                style: {
                    backgroundColor: "#00000005",
                },
            }}
        >
            <StyledContainer>
                {gettingType &&
                    <LoadingModal open={gettingType} />
                }
                <StyledContentContainer>
                    <div className="header">
                        <Typography variant="caption">Nouveau produit / article</Typography>
                        <IconButton onClick={onClose}>
                            <CloseIcon fontSize='small' color='default' />
                        </IconButton>
                    </div>
                    <div className="body">
                        <div className="category">
                            <div className='list-header'>
                                <Typography variant="h2" className="title">
                                    Sélectionnez le produit type
                                </Typography>
                                <StyledBox mb={1} mt={1} component="form" onSubmit={handleSubmitSearch}>
                                    <StyledInput
                                        placeholder="Rechercher..."
                                        className="search-input"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                    <Button
                                        startIcon={<SearchIcon />}
                                        size="small"
                                        variant="outlined"
                                        color="default"
                                        type="submit"
                                        sx={{ minWidth: 64, height: 30.75 }}
                                    >{searching ?
                                        <CircularProgress size={10} /> : "Go"
                                        }</Button>
                                </StyledBox>
                            </div>
                            <div className="categories-list">
                                {loading || searching ?
                                    <Box height={"200px"} display="flex" justifyContent="center" alignItems="center">
                                        <CircularProgress size={15} />
                                    </Box> :
                                    <ProduitCategoriesTreeView data={displayedCategories} selectedCategorySetter={setSelectedCategoryId} />
                                }
                            </div>
                            <div className="category-info">
                                <Typography variant="caption" className="label">
                                    Infos sur la catégorie
                                </Typography>
                                <div className="info">
                                    {selectedType && !gettingType ?
                                        <ul>
                                            <li>
                                                <Typography variant="caption" className="small">
                                                    Code
                                                </Typography>
                                                <Typography variant="caption" className="small">
                                                    {selectedType.code_type}
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography variant="caption" className="small">
                                                    Nom
                                                </Typography>
                                                <Typography variant="caption" className="small">
                                                    {selectedType.nom_type}
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography variant="caption" className="small">
                                                    TVA
                                                </Typography>
                                                <Typography variant="caption" className="small">
                                                    {selectedType.tva}%
                                                </Typography>
                                            </li>
                                        </ul> :
                                        <Box textAlign={"center"} height="100%" display="flex" justifyContent={"center"} alignItems={"center"}>
                                            {gettingType ?
                                                <Typography variant="caption" className="small">Chargement ...</Typography> :
                                                <Typography variant="caption" className="small">Aucune catégorie sélectionnée</Typography>
                                            }
                                        </Box>
                                    }
                                </div>
                            </div>
                        </div>
                        <ProduitForm produitType={selectedType} onClose={onClose} />
                    </div>
                </StyledContentContainer>
            </StyledContainer>
        </Modal>
    )
}
