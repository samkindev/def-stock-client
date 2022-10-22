import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// Quelques composants
const StyledContainer = styled("div")(() => ({
    flex: 1,
    border: '1px solid #e9e9e9',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#fcfcfc',
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
const StyledTableCell = styled(TableCell)(() => ({
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: 120,
    [`&.${tableCellClasses.head}`]: {
        // backgroundColor: '#307eccd6',
        // color: theme.palette.common.white,
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
        label: "N°",
        align: "center",
        width: '11,11%'
    },
    {
        id: 1,
        label: "Nom",
        align: "left",
        width: '11,11%'
    },
    {
        id: 2,
        label: "Motant",
        align: "right",
        width: '11,11%'
    },
    {
        id: 3,
        label: "Pourcentage",
        align: "center",
        width: '11,11%'
    },
]

export default function ExtraBillInfoTable({ data = [] }) {
    return (
        <StyledContainer>
            <StyledTableContainer>
                <Table size="small" aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {cols.map(col => (
                                <StyledTableCell key={col.id} align={col.align}>
                                    {col.label}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, i) => {
                            return (
                                <StyledTableRow key={item.id}>
                                    <StyledTableCell id={item.id} align="center">
                                        {i + 1}
                                    </StyledTableCell>
                                    <StyledTableCell id={item.id}>
                                        {item.label}
                                    </StyledTableCell>
                                    <StyledTableCell id={item.id} align="right">
                                        {item.montant}$
                                    </StyledTableCell>
                                    <StyledTableCell id={item.id} align="center">
                                        -
                                    </StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                        {data.length === 0 &&
                            <StyledTableRow style={{ height: 33 }}>
                                <StyledTableCell align="center"></StyledTableCell>
                                <StyledTableCell align="center"></StyledTableCell>
                                <StyledTableCell
                                    component="th"
                                    scope="row"
                                ></StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                        }
                    </TableBody>
                </Table>
            </StyledTableContainer>
        </StyledContainer>
    );
}
