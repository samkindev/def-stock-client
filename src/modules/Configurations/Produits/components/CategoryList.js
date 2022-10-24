import React, { useState, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { styled, Box } from '@mui/system';
import { Button, CircularProgress, Typography } from '@mui/material';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import { Search as SearchIcon } from "@mui/icons-material";
import { CategoryContext } from '../../../../app/Navigations/ProduitConfigRouts';
import { ProduitCategoriesTreeView } from '../../../../Components';
import { stringsSortCb } from '../../../../utilities/helpers';
import { filteredProduct } from '../../../../app/reducers/myProduct';
import axios from 'axios';

const StyledContainer = styled('div')(() => ({
    width: 320,
    marginRight: 20,
    position: 'fixed',
    left: 10,
    top: 70,
    bottom: 20,
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
        backgroundColor: '#eeeeee',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    "& .category-list": {
        padding: '10px 0'
    }
}));

const StyledActionBar = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    "& .action": {
        marginRight: 5,
        padding: '2px 4px',
        border: '1px solid #d4d3d3',
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        marginLeft: 4,
        maxWidth: 'fit-content',
        maxHeight: 'fit-content',
        color: '#111',
        cursor: 'pointer',
        "&:hover": {
            backgroundColor: '#e0dede',

        },
        "&.active": {
            color: theme.palette.primary.main,
            backgroundColor: '#e0dede',

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

export default function CategoryList() {
    const { categories, loading, setSelectedCategory } = useContext(CategoryContext);
    const [query, setQuery] = useState("");
    const [sorted, setSorted] = useState(true);
    const [displayedCategories, setDisplayedCategories] = useState([]);
    const [listType, setListType] = useState("all");
    const [searching, setSearching] = useState(false);
    const [searchingError, setSearchingError] = useState(null);
    const dispatch = useDispatch();

    const toggleSort = () => {
        setSorted(!sorted);
    };

    const toggleListType = (type) => {
        setListType(type);
    }

    const handleSelectType = (type) => {
        if (!type) return;
        setSelectedCategory(type);
        dispatch(filteredProduct("type=" + type));
    }

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
                    console.log(err);
                    setSearchingError("Une erreur s'est produite pendant la recherche.");
                }).finally(() => setSearching(false));
        } else {
            setDisplayedCategories(categories);
        }
    }

    const initCategories = () => {
        const cats = [...categories];
        if (sorted) {
            cats.sort((a, b) => {
                return stringsSortCb(a.nom_categorie, b.nom_categorie);
            });
        }
        setDisplayedCategories(cats);
    }

    useEffect(() => {
        if (query === "") {
            setTimeout(() => {
                initCategories();
            }, 500);
        }
    }, [query, sorted, categories]);
    return (
        <StyledContainer>
            <div className='header'>
                <Typography variant="caption">Categories d'articles/de produits</Typography>
                <StyledBox component="form" onSubmit={handleSubmitSearch} mb={1} mt={1}>
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
                    >Go</Button>
                </StyledBox>
                <StyledActionBar>
                    <Box display="flex" alignItems="center" mr={1}>
                        <Typography variant="caption" className="small">Filtres : </Typography>
                        <span className={`action ${listType === 'all' && "active"}`} onClick={() => toggleListType('all')}>
                            <Typography variant="caption" color="inherit" className='small'>Toutes</Typography>
                        </span>
                        <span className={`action ${listType === 'used' && "active"}`} onClick={() => toggleListType('used')}>
                            <Typography variant="caption" color="inherit" className='small'>Utilisées</Typography>
                        </span>
                    </Box>
                    <span className={`action ${sorted && "active"}`} onClick={toggleSort}>
                        <Typography variant='caption' color="inherit" className="small">Trie</Typography>
                        <SortByAlphaIcon color="inherit" fontSize="small" sx={{ fontSize: '1.15rem' }} />
                    </span>
                </StyledActionBar>
            </div>
            <div className="category-list">
                {loading || searching ?
                    <Box height={"100%"} display="flex" justifyContent="center" alignItems="center">
                        <CircularProgress size={15} />
                    </Box> :
                    <ProduitCategoriesTreeView data={displayedCategories} selectedCategorySetter={handleSelectType} />
                }
            </div>
        </StyledContainer>
    )
}
