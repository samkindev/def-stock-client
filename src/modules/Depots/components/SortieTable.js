import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Checkbox from "@mui/material/Checkbox";
import TableRow from "@mui/material/TableRow";
import { selectAll as selectAllProduct } from '../../../app/reducers/entree';
import { Typography } from "@mui/material";
import { Box } from "@mui/system";

// Quelques composants
const StyledContainer = styled("div")(() => ({
    border: '1px solid #e9e9e9',
    borderRadius: 5,
    overflow: 'hidden',
    margin: '0 10px',
    backgroundColor: '#fff',
}));
const StyledTableContainer = styled(TableContainer)(() => ({
    borderTop: "1px solid #eaeaea",
    borderBottom: "1px solid #eaeaea",
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
    maxWidth: 120,
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#307eccd6',
        color: theme.palette.common.white,
        fontSize: 15,
        padding: "5px 10px",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: "5px 10px",
        "&.prodLink": {
            textDecoration: "none",
            "&:hover": {
                textDecoration: "underline",
            },
        },
    },
    "&.disabled": {
        color: '#888!important'
    }
}));
const StyledTableRow = styled(TableRow)(() => ({
    cursor: 'pointer',
    "&:nth-of-type(2n)": {
        backgroundColor: "#e8e8e8",
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
    "&:hover": {
        backgroundColor: '#4372a145'
    },
    "&.selected": {
        backgroundColor: '#4372a145'
    }
}));

const cols = [
    {
        id: 0,
        label: "Date",
        align: "left",
        width: '11,11%'
    },
    {
        id: 1,
        label: "Référence sortie",
        align: "left",
        width: '11,11%'
    },
    {
        id: 2,
        label: "Type",
        align: "left",
        width: '11,11%'
    },
    {
        id: 3,
        label: "Référence facture",
        align: "left",
        width: '11,11%'
    },
    {
        id: 4,
        label: "Fournisseur",
        width: '11,11%',
        align: "left"
    },
    {
        id: 5,
        label: "Num. lot",
        align: "left",
        width: '11,11%'
    },
    {
        id: 6,
        label: "Produits",
        align: "center",
        width: '11,11%'
    },
    {
        id: 7,
        label: "Devise",
        align: "center",
        width: '11,11%'
    },
    {
        id: 8,
        label: "Taux",
        align: "right",
        width: '11,11%'
    },
]

export default function SortieTable({ selected = [], setSelected }) {
    const sorties = useSelector(selectAllProduct);

    // Fonction de séléction multiple
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = sorties.map((n) => n);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    // Fonction de séléction d'une seule ligne du tableau
    const handleSelect = (prod) => {
        const product = selected.find(s => s.id === prod.id);
        let newSelected = [...selected];

        if (!product) {
            newSelected.push(prod);
        } else {
            newSelected = selected.filter(s => s.id !== prod.id);
        }
        setSelected(newSelected);
    };

    // Fonction de verification de la séléction d'une ligne du tableau
    const isSelected = (id) => selected.some(s => s.id === id);

    return (
        <StyledContainer>
            <StyledTableContainer>
                <Table size="small" aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={
                                        selected.length > 0 &&
                                        selected.length < sorties.length
                                    }
                                    checked={
                                        sorties.length > 0 &&
                                        selected.length === sorties.length
                                    }
                                    onChange={handleSelectAllClick}
                                    inputProps={{
                                        "aria-label": "select all desserts",
                                    }}
                                />
                            </StyledTableCell>
                            {cols.map(col => (
                                <StyledTableCell key={col.id} align={col.align}>
                                    {col.label}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sorties &&
                            sorties.map((sortie, i) => {
                                const isItemSelected = isSelected(sortie.id);
                                return (
                                    <StyledTableRow onClick={() => handleSelect(sortie)} key={sortie.id} className={isItemSelected ? 'selected' : ''}>
                                        <StyledTableCell padding="checkbox">
                                            <Checkbox
                                                size="small"
                                                color="primary"
                                                checked={isItemSelected}
                                                onChange={(e) =>
                                                    handleSelect(sortie)
                                                }
                                                inputProps={{
                                                    "aria-label":
                                                        "select all sorties",
                                                }}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {(new Date(sortie.date_transaction)).toLocaleDateString()}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {sortie.ref_bon_entree}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {sortie.type_entree}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {sortie.ref_facture}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {sortie.nom_fournisseur}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {sortie.num_lot}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {sortie.produits}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {sortie.devise_entree}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {sortie.taux_change}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        {sorties.length === 0 &&
                            <StyledTableRow style={{ height: 33 }}>
                                <StyledTableCell align="center"></StyledTableCell>
                                <StyledTableCell align="center"></StyledTableCell>
                                <StyledTableCell
                                    component="th"
                                    scope="row"
                                ></StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                                <StyledTableCell align="right"></StyledTableCell>
                                <StyledTableCell align="right"></StyledTableCell>
                                <StyledTableCell align="right"></StyledTableCell>
                                <StyledTableCell align="right"></StyledTableCell>
                                <StyledTableCell align="right"></StyledTableCell>
                                <StyledTableCell align="right"></StyledTableCell>
                            </StyledTableRow>
                        }
                    </TableBody>
                </Table>
            </StyledTableContainer>
            {sorties.length === 0 &&
                <Box p={3} textAlign="center">
                    <Typography variant="caption" className="small">Aucun produit / Article</Typography>
                </Box>
            }
        </StyledContainer>
    );
}
