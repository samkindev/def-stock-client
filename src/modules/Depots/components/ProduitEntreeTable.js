import React, { useState, useRef, useContext } from "react";
import { useSelector } from 'react-redux';
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { selectAll as selectAllProduct } from '../../../app/reducers/myProduct';
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { Cancel as CancelIcon } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { ComboBox, MenuPoppover, Select } from "../../../Components";
import { formatNumber } from "../../../utilities/helpers";
import DepotEmplacementTreeView from "../../../Components/Trees/EmplacementTree";
import { SubdivisionContext } from "./SingleDepot";
import RefreshIcon from '@mui/icons-material/Refresh';

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
        backgroundColor: '#307eccd6',
        color: theme.palette.common.white,
        fontSize: 15,
        padding: "5px 0",
        paddingRight: "2.5px",
        paddingLeft: "2.5px",
        "&:not(:first-of-type)": {
            borderRight: '1px solid #888',
        },
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: "0px 4px",
        "&.prodLink": {
            textDecoration: "none",
            "&:hover": {
                textDecoration: "underline",
            },
        },
        "& .Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: '#d32f2f',
            borderWidth: '1px',
            borderStyle: 'solid',
        },
        "& .emplacement": {
            display: 'flex',
            alignItems: 'center',
            borderRadius: 3,
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
            paddingLeft: '2px',
            "& > span": {
                flex: 1,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                // maxWidth: '80',
                fontSize: '14px!important'
            },
            "& > button": {
                border: 'none',
                // borderLeft: '1px solid rgba(0, 0, 0, 0.23)',
                backgroundColor: '#f5f5f5',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                padding: '2px 4px',
            },
            "&.error": {
                border: '1px solid red'
            }
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
const StyledTableRow = styled(TableRow)(() => ({
    "&:nth-of-type(2n)": {
        backgroundColor: "#f8f8f8",
    },
    "&:last-child": {
        [`& .${tableCellClasses.body}`]: {
            borderBottom: 'none'
        }
    }
}));
const StyledEmplacementTreeContainer = styled('div')(() => ({
    maxHeight: 250,
    minHeight: 200,
    minWidth: 250,
    border: "1px solid #b6b6b6",
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    "& .header": {
        padding: '6px 10px',
        borderBottom: '1px solid rgb(204, 204, 204)',
        backgroundColor: '#eeeeee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        "& > *": {
            flex: 1
        }
    },
    "& > div:last-child": {
        flex: 1,
        overflowY: 'auto',
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
        label: "PA/unité",
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
        id: 6,
        label: "Total",
        width: '11,11%',
        align: "center"
    },
    {
        id: 5,
        label: "TVA(%)",
        align: "center",
        width: '11,11%'
    },
    {
        id: 9,
        label: "PV/unité",
        align: "center",
        width: '11,11%'
    },
    {
        id: 10,
        label: "PV min/unité",
        align: "center",
        width: '11,11%'
    },
    {
        id: 4,
        label: "Expiration",
        align: "center",
        width: '11,11%'
    },
    {
        id: 7,
        label: "Emplacement",
        width: '12,11%',
        align: "center"
    },
    {
        id: 8,
        label: "Actions",
        align: "center",
        width: '13,11%'
    },
]

export default function ProduitEntreeTable({ rows = [], setRows, monnaie = "" }) {
    const produits = useSelector(selectAllProduct);
    const { subdivisions, loading, refresh } = useContext(SubdivisionContext);
    const [produit, setProduit] = useState(null);
    const [quantite, setQuantite] = useState("");
    const [pu, setPu] = useState(0);
    const [tva, setTva] = useState('');
    const [prixTTC, setPrixTTC] = useState(0);
    const [unite, setUnite] = useState(null);
    const [unites, setUnites] = useState([]);
    const [expiration, setExpiration] = useState('');
    const [emplacement, setEmplacement] = useState(null);
    const [pv, setPv] = useState(0);
    const [pvMin, setPvMin] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const openEmplacement = Boolean(anchorEl);
    const containerRef = useRef();
    const [errors, setErrors] = useState({});

    const handleSetEmplacement = (val) => {
        setEmplacement(val);
        handleToggleError(val, 'emplacement');
        setAnchorEl(null);
    }

    const handleSelectProduit = (val) => {
        setProduit(val);
        handleToggleError(val, 'produit');
        if (!val) {
            setPu('');
            setTva('');
            setPrixTTC(0);
            setExpiration('');
            return;
        }
        const unites = val.units;
        setUnites(unites);
        setTva(val.tva);
        // console.log(formatNumber(pu * (1 + val.marge / 100)));
        setPv(formatNumber(pu * (1 + val.marge / 100), 2, '.'));
        if (quantite && pu) {
            setPrixTTC(formatNumber(pu * quantite));
        }
        if (unites.length === 1) {
            setUnite(unites[0])
            handleToggleError(unites[0], 'unite');
        };
    }

    const handleSelectUnite = (val) => {
        setUnite(val);
        handleToggleError(val, 'unite');
    }

    const hendleChangeWithCalculation = (e, name) => {
        const val = e.target.value;
        handleToggleError(val, name);
        if (name === 'quantite') {
            setQuantite(val);
            if (produit && pu !== '') {
                setPrixTTC(formatNumber((pu * val)));
            }
        } else if (name === 'pu') {
            setPu(val);
            setPv(produit ? formatNumber(val * (1 + produit.marge / 100), 2, '.') : 0);
            if (produit && quantite !== '') {
                setPrixTTC(formatNumber((val * quantite)));
            }
        }
    }

    const handleToggleError = (val, label) => {
        if (val && val !== '') {
            setErrors(errors => ({ ...errors, [label]: false }))
        }
    }

    const validate = () => {
        let valid = true;
        let errors = {};

        if (!produit) {
            valid = false;
            errors = { ...errors, produit: true }
        }
        if (quantite === '' || quantite === 0) {
            valid = false;
            errors = { ...errors, quantite: true }
        }
        if (pu === '' || pu === 0) {
            valid = false;
            errors = { ...errors, pu: true }
        }
        if (!unite) {
            valid = false;
            errors = { ...errors, unite: true }
        }
        if (!pv || pv === '') {
            valid = false;
            errors = { ...errors, pv: true }
        }

        const d = new Date(expiration);
        if (expiration !== '' && d <= Date.now()) {
            valid = false;
            errors = { ...errors, expiration: true }
        }

        return [valid, errors];
    }

    const handleAppendRow = () => {
        const [valid, errors] = validate();
        setErrors(errors);
        if (!valid) {
            return;
        }

        const row = {
            produit,
            pu,
            quantite,
            expiration,
            tva,
            unite,
            prixTTC,
            pv_unitaire: pv,
            pv_minimal: pvMin,
            emplacement: {
                id: emplacement && emplacement.id,
                parent: emplacement && emplacement.parent,
                label: emplacement && emplacement.label
            }
        }
        setRows(r => ([...r, row]));

        setPu('');
        setTva('');
        setQuantite('');
        setPrixTTC(0);
        setProduit(null);
        setUnite(null);
        setEmplacement(null);
        setExpiration('');
        setUnites([]);
        setPv(0);
        setPvMin(0);
        if (containerRef.current) {
            containerRef.current.scrollTo(0, 300);
        }
    }

    const removeRow = (key) => {
        const r = rows.filter((row, i) => i !== key);
        setRows(r);
    }

    const toggleEmplacement = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const handleCloseDialog = () => {
        setAnchorEl(null);
    }

    return (
        <StyledContainer>
            {openEmplacement &&
                <MenuPoppover
                    anchorEl={anchorEl}
                    open={openEmplacement}
                    handleClose={handleCloseDialog}
                    anchorOrigin={{
                        vertical: "center",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "center",
                        horizontal: "right",
                    }}>
                    <StyledEmplacementTreeContainer>
                        <div className="header">
                            <Typography variant="caption">Sélectionnez un emplacement</Typography>
                        </div>
                        <DepotEmplacementTreeView
                            data={subdivisions}
                            selectedEmplacement={handleSetEmplacement}
                        />
                    </StyledEmplacementTreeContainer>
                </MenuPoppover>
            }
            <StyledTableContainer ref={containerRef} sx={{ maxHeight: 260 }}>
                <Table size="small" aria-label="customized table" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center" padding="checkbox" sx={{ width: '30px!important', borderRight: '1px solid #e3e3e3', }}>
                                N°
                            </StyledTableCell>
                            {cols.map(col => {
                                if (col.label === 'Emplacement') {
                                    return (
                                        <StyledTableCell key={col.id} align={col.align} width={col.width}>
                                            {col.label}
                                            {loading ?
                                                <CircularProgress size={15} color="inherit" sx={{ ml: 0.7, verticalAlign: 'middle' }} /> :
                                                <RefreshIcon sx={{ ml: 0.7 }} className="refresher" fontSize="small" onClick={refresh} />
                                            }
                                        </StyledTableCell>
                                    )
                                }
                                return (
                                    <StyledTableCell key={col.id} align={col.align} width={col.width}>
                                        {col.label}
                                    </StyledTableCell>
                                )
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, i) => (
                            <StyledTableRow key={i} style={{ height: 33 }}>
                                <StyledTableCell align="center" sx={{ borderRight: '1px solid #e3e3e3', }}>{i + 1}</StyledTableCell>
                                <StyledTableCell align="left" className="input">
                                    {row.produit.designation}
                                </StyledTableCell>
                                <StyledTableCell align="right" className="input">
                                    {row.pu} {monnaie.toUpperCase()}
                                </StyledTableCell>
                                <StyledTableCell align="right" className="input">
                                    {row.quantite}
                                </StyledTableCell>
                                <StyledTableCell align="left" className="input">
                                    {row.unite.nom_unite}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {row.prixTTC} {monnaie.toUpperCase()}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {row.tva}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {row.pv_unitaire}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {row.pv_minimal}
                                </StyledTableCell>
                                <StyledTableCell align="left" className="input">
                                    {row.expiration && row.expiration !== '' && (new Date(row.expiration)).toLocaleDateString()}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    {row.emplacement.label}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Button
                                        variant="text"
                                        color="primary"
                                        disableElevation
                                        size="small"
                                        onClick={() => removeRow(i)}
                                    >
                                        <CancelIcon fontSize="small" color="error" />
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                        <StyledTableRow style={{ height: 33 }}>
                            <StyledTableCell align="center" sx={{ borderRight: '1px solid #e3e3e3', }}>{rows.length + 1}</StyledTableCell>
                            <StyledTableCell align="left" className="input">
                                <ComboBox
                                    id="produit"
                                    options={produits}
                                    value={produit}
                                    optionLabel="designation"
                                    setValue={handleSelectProduit}
                                    minWidth={100}
                                    textFieldXs={{ my: 0, p: '2px' }}
                                    error={errors.produit ? true : false}
                                />
                            </StyledTableCell>
                            <StyledTableCell className="input">
                                <TextField
                                    name="pu"
                                    value={pu}
                                    type="number"
                                    inputProps={{ min: 0, style: { padding: '5px 0px 5px 14px' } }}
                                    onChange={e => { hendleChangeWithCalculation(e, 'pu') }}
                                    sx={{ my: 0, "& input": { p: '5px 14px', textAlign: 'right' } }}
                                    error={errors.pu ? true : false}
                                />
                            </StyledTableCell>
                            <StyledTableCell className="input">
                                <TextField
                                    name="quantite"
                                    value={quantite}
                                    type="number"
                                    inputProps={{ min: 0, style: { padding: '5px 0px 5px 14px' } }}
                                    onChange={e => hendleChangeWithCalculation(e, 'quantite')}
                                    sx={{ my: 0, "& input": { p: '5px 14px', textAlign: 'right' } }}
                                    error={errors.quantite ? true : false}
                                />
                            </StyledTableCell>
                            <StyledTableCell align="left" className="input">
                                <Select
                                    options={unites}
                                    value={unite}
                                    style={{ margin: 0, padding: '4px 10px', border: `${errors.unite ? '1px solid red' : 'none'}` }}
                                    optionLabel="nom_unite"
                                    onChange={
                                        handleSelectUnite
                                    }
                                />
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {prixTTC}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {tva}
                            </StyledTableCell>
                            <StyledTableCell align="right" className="input">
                                <TextField
                                    name="pix_vente"
                                    value={pv}
                                    type="number"
                                    onChange={e => {
                                        setPv(e.target.value);
                                        handleToggleError(e.target.value, 'pv')
                                    }}
                                    inputProps={{ min: 0, style: { padding: '5px 0px 5px 14px' } }}
                                    sx={{ my: 0, "& input": { p: '5px 14px', textAlign: 'right' } }}
                                    error={errors.pv ? true : false}
                                />
                            </StyledTableCell>
                            <StyledTableCell align="right" className="input">
                                <TextField
                                    name="pv_min"
                                    value={pvMin}
                                    type="number"
                                    onChange={e => {
                                        setPvMin(e.target.value);
                                    }}
                                    inputProps={{ min: 0, style: { padding: '5px 0px 5px 14px' } }}
                                    sx={{ my: 0, "& input": { p: '5px 14px', textAlign: 'right' } }}
                                />
                            </StyledTableCell>
                            <StyledTableCell align="left" className="input">
                                <TextField
                                    name="expiration"
                                    value={expiration}
                                    type="date"
                                    onChange={e => {
                                        setExpiration(e.target.value);
                                        handleToggleError(e.target.value, 'expiration');
                                    }}
                                    inputProps={{ sx: { maxWidth: 105 } }}
                                    sx={{ my: 0, "& input": { p: '5px 14px', textAlign: 'right' } }}
                                    error={errors.expiration ? true : false}
                                />
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                <div className={`emplacement ${errors.emplacement && 'error'}`}>
                                    <Typography variant='caption'>{emplacement && emplacement.label}</Typography>
                                    <Button
                                        variant="outlined"
                                        color="default"
                                        size="medium"
                                        onClick={toggleEmplacement}
                                        sx={{ ml: 1 }}
                                    >Sélect.</Button>
                                </div>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disableElevation
                                    size="small"
                                    onClick={handleAppendRow}
                                >
                                    <AddIcon fontSize="small" />
                                </Button>
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableBody>
                </Table>
            </StyledTableContainer>
        </StyledContainer>
    );
}
