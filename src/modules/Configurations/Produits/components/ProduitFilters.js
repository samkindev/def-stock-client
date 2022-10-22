import React, { useState } from 'react';
import { styled, Box } from '@mui/system';
import { Typography, TextField, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { filteredProduct } from '../../../../app/reducers/myProduct'

const StyledContainer = styled('div')(() => ({
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px solid rgb(204, 204, 204)',
    "& .header": {
        padding: '5px 10px',
        borderBottom: '1px solid rgb(204, 204, 204)',
        backgroundColor: '#eeeeee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    "& form": {
        flex: 1,
        padding: 10,
        display: 'flex',
        "& > *": {
            flex: 1,
        },
        "& .form-controle": {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0px',
            "& > *": {
                flex: 1
            },
        }
    },
    "& .footer": {
        display: 'flex',
        justifyContent: 'center',
        borderTop: '1px solid rgb(204, 204, 204)',
        padding: '5px 10px',
        backgroundColor: '#faf8ff'
    }
}));

export default function ProduitFilters() {
    const [nom, setNom] = useState("");
    const [code, setCode] = useState("");
    const [status, setStatus] = useState("");
    const [codebarre, setCodebarre] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const dispatch = useDispatch();

    const getFilter = () => {
        let filters = "";
        if (nom !== "") {
            filters = filters + "designation=" + nom + "&";
        }
        if (code !== "") {
            filters = filters + "code=" + code + "&";
        }
        if (dateFrom !== "") {
            filters = filters + "from=" + dateFrom + "&";
        }
        if (dateTo !== "") {
            filters = filters + "to=" + dateTo + " 23:59:59&";
        }
        if (codebarre !== "") {
            filters = filters + "codebarre=" + codebarre + "&";
        }
        if (status !== "") {
            filters = filters + "etat=" + status + "&";
        }

        if (filters.length > 0) {
            filters = filters.slice(0, filters.length - 1);
        }
        return filters
    }

    const initAllFilters = () => {
        setNom("");
        setCode("");
        setStatus("");
        setCodebarre("");
        setDateFrom("");
        setDateTo("");
        dispatch(filteredProduct(""));
    }

    const submitFilter = () => {
        const filters = getFilter();
        if (filters !== "") {
            dispatch(filteredProduct(filters));
        }
    }

    return (
        <StyledContainer>
            <div className='header'>
                <Typography variant="caption">Filtres</Typography>
            </div>
            <form>
                <Box mr={4}>
                    <div className="form-controle">
                        <Typography
                            sx={{ display: 'block', mr: 1.5 }}
                            variant='caption'
                            component={"label"}
                            htmlFor="nom_d"
                        >Produit / Article</Typography>
                        <TextField
                            name="nom"
                            id="nom_d"
                            type="text"
                            placeholder="Nom produit"
                            value={nom}
                            onChange={e => setNom(e.target.value)}
                            size="small"
                            sx={{ m: "5px 0" }}
                        />
                    </div>
                    <div className="form-controle">
                        <Typography
                            sx={{ display: 'block', mr: 1.5 }}
                            variant='caption'
                            component={"label"}
                            htmlFor="code_d"
                        >Code produit / Article</Typography>
                        <TextField
                            name="code"
                            id="code_d"
                            type="text"
                            placeholder="Code produit"
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            size="small"
                            sx={{ m: "5px 0" }}
                        />
                    </div>
                    <div className="form-controle">
                        <Typography
                            sx={{ display: 'block', mr: 1.5 }}
                            variant='caption'
                            component={"label"}
                            htmlFor="date_f"
                        >Date du</Typography>
                        <TextField
                            name="date_from"
                            id="data_f"
                            type="date"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                            size="small"
                            sx={{ m: "5px 0" }}
                        />
                    </div>
                </Box>

                <Box>
                    <div className="form-controle">
                        <Typography
                            sx={{ display: 'block', mr: 1.5 }}
                            variant='caption'
                            component={"label"}
                            htmlFor="status"
                        >Etat produit / Article</Typography>
                        <TextField
                            name="status"
                            id="status"
                            type="text"
                            placeholder="Etat produit"
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            size="small"
                            sx={{ m: "5px 0" }}
                        />
                    </div>
                    <div className="form-controle">
                        <Typography
                            sx={{ display: 'block', mr: 1.5 }}
                            variant='caption'
                            component={"label"}
                            htmlFor="cb"
                        >Code-barre produit / Article</Typography>
                        <TextField
                            name="codebarre"
                            id="cb"
                            type="text"
                            placeholder="Code-barre"
                            value={codebarre}
                            onChange={e => setCodebarre(e.target.value)}
                            size="small"
                            sx={{ m: "5px 0" }}
                        />
                    </div>
                    <div className="form-controle">
                        <Typography
                            sx={{ display: 'block', mr: 1.5 }}
                            variant='caption'
                            component={"label"}
                            htmlFor="nom_t"
                        >Date au</Typography>
                        <TextField
                            name="date_to"
                            id="data_t"
                            type="date"
                            value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                            size="small"
                            sx={{ m: "5px 0" }}
                        />
                    </div>
                </Box>
            </form>
            <div className='footer'>
                <Button
                    disableElevation
                    variant='outlined'
                    color="default"
                    size='small'
                    type="submit"
                    sx={{ mr: 1.5 }}
                    onClick={submitFilter}
                >Filtrer</Button>
                <Button
                    disableElevation
                    variant='outlined'
                    color="default"
                    size='small'
                    type="submit"
                    onClick={initAllFilters}
                >Annuler le filtre</Button>
            </div>
        </StyledContainer>
    )
}
