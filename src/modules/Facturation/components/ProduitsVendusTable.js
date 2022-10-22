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
    flex: 1,
    border: '1px solid #e5e5e5',
    borderRadius: 5,
    overflow: 'hidden',
    margin: '0 10px',
    backgroundColor: '#fff',
}));
const StyledTableContainer = styled(TableContainer)(() => ({
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
        label: "Code article",
        align: "left",
        width: '11,11%'
    },
    {
        id: 1,
        label: "Désignation",
        align: "left",
        width: '11,11%'
    },
    {
        id: 2,
        label: "Prix Unitaire",
        align: "right",
        width: '11,11%'
    },
    {
        id: 3,
        label: "Quantité",
        align: "right",
        width: '11,11%'
    },
    {
        id: 4,
        label: "Unite",
        width: '11,11%',
        align: "left"
    },
    {
        id: 5,
        label: "TVA",
        align: "right",
        width: '11,11%'
    },
    {
        id: 6,
        label: "Prix TTC",
        align: "right",
        width: '11,11%'
    },
]

export default function ProduitsVendustable({ productRow, selected = [], setSelected }) {
    // Fonction de séléction multiple
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = productRow.map((n) => n);
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
                                        selected.length < productRow.length
                                    }
                                    checked={
                                        productRow.length > 0 &&
                                        selected.length === productRow.length
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
                        {productRow &&
                            productRow.map((row, i) => {
                                const isItemSelected = isSelected(row.id);
                                return (
                                    <StyledTableRow
                                        onClick={() => handleSelect(row)}
                                        key={row.id} className={isItemSelected ? 'selected' : ''}
                                        sx={{ backgroundColor: row.reduction ? '#ffdbd345!important' : 'transparent' }}
                                    >
                                        <StyledTableCell padding="checkbox">
                                            <Checkbox
                                                size="small"
                                                color="primary"
                                                checked={isItemSelected}
                                                onChange={(e) =>
                                                    handleSelect(row)
                                                }
                                                inputProps={{
                                                    "aria-label":
                                                        "select all productRow",
                                                }}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {row.code}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {row.reduction ? row.reduction.type : row.designation}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.reduction ? '-' : row.pu}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.reduction ? '-' : row.quantite}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {row.reduction ? '-' : row.unit.specification === '' ? row.unit.nom_unite : row.unit.specification}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.reduction ? '-' : row.tva.taux}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.reduction ? '-' + row.total : row.total}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        {productRow.length === 0 &&
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
                            </StyledTableRow>
                        }
                    </TableBody>
                </Table>
            </StyledTableContainer>
        </StyledContainer>
    );
}
