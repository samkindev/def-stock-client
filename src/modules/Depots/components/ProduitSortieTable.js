import React, { useState, useRef } from "react";
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { selectAll as selectAllProduct } from '../../../app/reducers/myProduct';
import { IconButton, TextField } from "@mui/material";
import { Cancel as CancelIcon } from "@mui/icons-material";
import { ComboBox, Select, LoadingModal } from "../../../Components";
import { formatNumber } from "../../../utilities/helpers";
import { selectById as selectDepotById } from "../../../app/reducers/depot";
import axios from 'axios';
import { fifo, getQuantiteDisponible } from "../../Facturation/utilities/helpers";

// Quelques composants
const StyledContainer = styled("div")(() => ({
    backgroundColor: 'color',
    border: '1px solid #e9e9e9',
    borderRadius: 5,
    overflow: 'hidden',
}));
const StyledTableContainer = styled(TableContainer)(() => ({
    borderTop: "1px solid #eaeaea",
    "&.MuiTableContainer-root": {
        borderRadius: 0
    },
    "& .MuiTable-root": {
        borderRadius: 0
    },
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: 110,
    "& *": {
        border: 'none'
    },
    "& .refresher": {
        verticalAlign: 'middle',
        cursor: 'pointer',
        "&:hover": {
            color: theme.palette.primary.main,
        }
    },
    [`&.${tableCellClasses.head}`]: {
        // backgroundColor: '#307eccd6',
        // color: theme.palette.common.white,
        fontSize: 15,
        padding: "5px 0",
        paddingRight: "2.5px",
        paddingLeft: "2.5px",
        "&:not(:first-of-type)": {
            borderRight: '1px solid #e3e3e3',
        },
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: "0px 4px",
        color: '#555',
        "& *": {
            color: '#555',
        },
        "& .Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: '#d32f2f',
            borderWidth: '1px',
            borderStyle: 'solid',
        },
        "&:not(:first-of-type)": {
            borderRight: '1px solid #e3e3e3',
        },
        "&:last-child": {
            borderRight: 'none',
        },
    },
    [`&.${tableCellClasses.body}:not(:last-child)`]: {
        paddingRight: "5px",
    },
    "&.disabled": {
        color: '#888!important'
    }
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&.active": {
        backgroundColor: 'aliceblue'
    },
    // "&:nth-of-type(2n)": {
    //     // backgroundColor: "#f8f8f8",
    // },
    "&:last-child": {
        [`& .${tableCellClasses.body}`]: {
            borderBottom: 'none'
        }
    }
}));

const cols = [
    {
        id: 0,
        label: "Produit/Article",
        align: "center",
        width: '11,11%'
    },
    {
        id: 1,
        label: "Coût/unité",
        align: "center",
        width: '11,11%'
    },
    {
        id: 2,
        label: "Quantité",
        align: "center",
        width: '11,11%'
    },
    {
        id: 3,
        label: "Unité",
        align: "center",
        width: '11,11%'
    },
    {
        id: 5,
        label: "Coût total",
        align: "center",
        width: '11,11%'
    },
    {
        id: 8,
        label: "Actions",
        align: "center",
        width: '13,11%'
    },
]

export default function ProduitSortieTable({ errors, setErrors, rowCount = [], setRowCount }) {
    const { id } = useParams();
    const depot = useSelector((state) => selectDepotById(state, id));
    const produits = useSelector(selectAllProduct);
    const containerRef = useRef();
    const [activeRow, setActiveRow] = useState(null);
    const [loadingData, setLoadingData] = useState(false);

    const handleSelectProduit = (val, rowId) => {
        const rows = [...rowCount];
        let found = -1;
        rowCount.forEach((r, i) => {
            if (r.produit && val.id === r.produit.id) {
                found = i;
            }
        });

        if (found !== -1) {
            setActiveRow(() => found);
            rows[rowId] = { ...rows[rowId], produit: null, unite: null, quantite: 0, cu: null }
            setRowCount(rows);
            setErrors(errors => ({ ...errors, rowCount: 'Le produit séléctionné existe déjà dans le tableau sur la ligne ' + (found + 1) }))
            return;
        }

        if (depot) {
            setLoadingData(true);
            axios
                .get(`https://def-api.herokuapp.com/api/depot/${depot.id}/vente/produits/${val.id}`)
                .then(res => {
                    const d = res.data;
                    const unite = d.units.find(u => u.type_unite === 'default');
                    const qDispo = getQuantiteDisponible(d.entrees, unite, unite);
                    const r = { ...val, units: d.units, cu: 0, entrees: d.entrees, qDispo };
                    rows[rowId] = { ...rows[rowId], produit: r, unite: unite, quantite: 0, cu: null }
                    setRowCount(rows);
                })
                .catch(err => console.log(err))
                .finally(() => { setLoadingData(false) });
        }
    }

    const hendleChangeWithCalculation = (e, name, rowId) => {
        const val = e.target.value;
        const rows = [...rowCount];
        const row = rows[rowId];
        let cu = 0;
        if (name === 'quantite' && row.produit && val && val > 0) {
            const errs = [...errors];
            if (row.produit.qDispo === 0 || row.produit.qDispo < parseFloat(val) || row.produit.entrees.length === 0) {
                errs[rowId] = "La qunatité disponible est inférieur.";
                setErrors(errors => ({ ...errors, quantite: errs, rowCount: "La quantité disponible est insuffisante." }));
                return;
            }
            const { prixTotal, entreeSortie } = fifo(row.produit.entrees, val, row.unite, row.unite);
            cu = prixTotal / val;
            row.entreesSorties = entreeSortie;
            if (val > row.produit.qDispo) {
                errs[rowId] = "La qunatité disponible est inférieur.";
            } else {
                errs[rowId] = null;
            }

            setErrors(errors => ({ ...errors, quantite: errs }));
        }
        rows[rowId] = { ...rows[rowId], [name]: val, cu };
        setRowCount(rows);
    }

    const handleSelectUnite = (rowId, value) => {
        const rows = [...rowCount];
        const qDispo = getQuantiteDisponible(rows[rowId].produit.entrees, value);

        let row = rows[rowId];
        const { prixTotal, entreeSortie, newEntrees } = fifo(row.produit.entrees, row.quantite, value, row.unite);
        const cu = row.quantite > 0 ? prixTotal / row.quantite : null;
        row.entreesSorties = newEntrees

        row = { ...rows[rowId], unite: value, cu }
        row.produit.qDispo = qDispo;
        rows[rowId] = row;
        setRowCount(rows);

        const errs = [...errs];
        if (row.quantite > qDispo) {
            errs[rowId] = "La qunatité disponible est inférieur.";
        } else {
            errs[rowId] = null;
        }

        setErrors(errors => ({ ...errors, quantite: errs }));
    }

    const removeRow = (key) => {
        const rows = rowCount.filter((r, i) => i !== key);
        setRowCount(rows);
        const errs = [...errors];
        errs[key] = false;
        setErrors(errors => ({ ...errors, quantite: errs }));
    }

    const handleFocusRow = (rowId) => {
        setActiveRow(rowId);
    }

    return (
        <StyledContainer>
            {loadingData && <LoadingModal open={loadingData} />}
            <StyledTableContainer ref={containerRef} sx={{ maxHeight: 250 }}>
                <Table size="small" aria-label="customized table" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center" padding="checkbox" sx={{ width: '30px!important', borderRight: '1px solid #e3e3e3', }}>
                                N°
                            </StyledTableCell>
                            {cols.map(col => (
                                <StyledTableCell key={col.id} align={col.align} width={col.width}>
                                    {col.label}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rowCount.map((row, index) => (
                            <StyledTableRow className={activeRow === index ? 'active' : ''} key={index} style={{ height: 33 }} onFocus={() => handleFocusRow(index)}>
                                <StyledTableCell align="center" sx={{ borderRight: '1px solid #e3e3e3', }}>{index + 1}</StyledTableCell>
                                <StyledTableCell align="left" className="input">
                                    <ComboBox
                                        id="produit"
                                        options={produits}
                                        value={row.produit}
                                        optionLabel="designation"
                                        setValue={value => handleSelectProduit(value, index)}
                                        minWidth={100}
                                        textFieldXs={{ my: 0, p: '2px' }}
                                        error={errors.produit ? true : false}
                                    />
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {row.cu && formatNumber(row.cu, 2, ',')}
                                </StyledTableCell>
                                <StyledTableCell className="input">
                                    <TextField
                                        name="quantite"
                                        value={row ? row.quantite : 0}
                                        type="number"
                                        disabled={row.produit ? false : true}
                                        inputProps={{ min: 0, style: { padding: '5px 0px 5px 14px' } }}
                                        onChange={e => hendleChangeWithCalculation(e, 'quantite', index)}
                                        sx={{ my: 0, "& input": { p: '5px 14px', textAlign: 'right' } }}
                                        error={errors[index] ? true : false}
                                    />
                                </StyledTableCell>
                                <StyledTableCell align="left" className="input">
                                    <Select
                                        options={
                                            row.produit ?
                                                row.produit.units : []
                                        }
                                        value={row.unite}
                                        style={{ margin: 0, padding: '4px 10px', border: `${errors.unite ? '1px solid red' : 'none'}` }}
                                        optionLabel="nom_unite"
                                        disabled={row.produit ? false : true}
                                        onChange={
                                            value => handleSelectUnite(index, value)
                                        }
                                    />
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {row.cu && formatNumber(row.quantite * row.cu)}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <IconButton sx={{ p: '2px' }} onClick={() => removeRow(index)}>
                                        <CancelIcon fontSize="small" color="error" />
                                    </IconButton>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </StyledTableContainer>
        </StyledContainer>
    );
}
