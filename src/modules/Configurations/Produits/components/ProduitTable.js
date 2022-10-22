import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Checkbox from "@mui/material/Checkbox";
import TableRow from "@mui/material/TableRow";
import { useTheme } from "@mui/styles";
import { selectAll as selectAllProduct } from '../../../../app/reducers/myProduct';
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";

// Quelques composants
const StyledContainer = styled("div")(() => ({
	borderRadius: 5,
	overflow: 'hidden',
	border: "1px solid #eaeaea",
	margin: '0 10px',
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
	"&:nth-of-type(2n)": {
		backgroundColor: "#f8f8f8",
	},
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

const cols = [
	{
		id: 0,
		label: "Produit type",
		align: "left",
		width: '11,11%'
	},
	{
		id: 1,
		label: "Code produit",
		align: "left",
		width: '11,11%'
	},
	{
		id: 2,
		label: "Code-barre",
		align: "left",
		width: '11,11%'
	},
	{
		id: 3,
		label: "Désignation",
		align: "left",
		width: '11,11%'
	},
	{
		id: 4,
		label: "Fabricant",
		width: '11,11%',
		align: "left"
	},
	{
		id: 5,
		label: "Unité défaut",
		align: "left",
		width: '11,11%'
	},
	{
		id: 6,
		label: "Q. min",
		align: "right",
		width: '11,11%'
	},
	{
		id: 7,
		label: "Marge Bénéfice",
		align: "right",
		width: '11,11%'
	},
	{
		id: 8,
		label: "Etat",
		align: "center",
		width: '10,11%'
	},
]

export default function TableProduit({ selected, setSelected }) {
	const produits = useSelector(selectAllProduct);
	const theme = useTheme();

	// Fonction de séléction multiple
	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = produits.map((n) => n);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};

	// Fonction de séléction d'une seule ligne du tableau
	const handleSelect = (event, prod) => {
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
									color="white"
									indeterminate={
										selected.length > 0 &&
										selected.length < produits.length
									}
									checked={
										produits.length > 0 &&
										selected.length === produits.length
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
						{produits &&
							produits.map((produit, i) => {
								const isItemSelected = isSelected(produit.id);
								const pUnit = produit.units.find(u => u.produit_unite.type_unite === 'default');
								return (
									<StyledTableRow key={produit.id}>
										<StyledTableCell padding="checkbox">
											<Checkbox
												size="small"
												color="primary"
												checked={isItemSelected}
												onChange={(e) =>
													handleSelect(e, produit)
												}
												inputProps={{
													"aria-label":
														"select all desserts",
												}}
											/>
										</StyledTableCell>
										<StyledTableCell className={produit.etat_produit === 'caché' ? "disabled" : ""}>
											{produit.produit_type}
										</StyledTableCell>
										<StyledTableCell
											style={{
												color: theme.palette.primary
													.main,
											}}
											className={`${produit.etat_produit === 'caché' ? "disabled" : ""} prodLink`}
											scope="row"
										>
											<Link
												to={produit.id}
												style={{
													textDecoration: "inherit",
												}}
											>
												{produit.code_produit}
											</Link>
										</StyledTableCell>
										<StyledTableCell className={produit.etat_produit === 'caché' ? "disabled" : ""}>
											{produit.codebarre_produit}
										</StyledTableCell>
										<StyledTableCell className={produit.etat_produit === 'caché' ? "disabled" : ""}>
											{produit.designation}
										</StyledTableCell>
										<StyledTableCell align="left" className={produit.etat_produit === 'caché' ? "disabled" : ""}>
											{produit.fabricant}
										</StyledTableCell>
										<StyledTableCell align="left" className={produit.etat_produit === 'caché' ? "disabled" : ""}>
											{pUnit.produit_unite.specification !== '' ? pUnit.produit_unite.specification : pUnit.nom_unite}
										</StyledTableCell>
										<StyledTableCell align="right" className={produit.etat_produit === 'caché' ? "disabled" : ""}>
											{produit.quantite_min}
										</StyledTableCell>
										<StyledTableCell align="right" className={produit.etat_produit === 'caché' ? "disabled" : ""}>
											{produit.marge}%
										</StyledTableCell>
										<StyledTableCell align="center" className={produit.etat_produit === 'caché' ? "disabled" : ""}>
											{produit.margeetat_produit === 'caché' ?
												<VisibilityOutlined fontSize="small" /> :
												<VisibilityOffOutlined fontSize="small" />
											}
										</StyledTableCell>
									</StyledTableRow>
								);
							})}
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
					</TableBody>
				</Table>
			</StyledTableContainer>
			{produits.length === 0 &&
				<Box p={3} textAlign="center">
					<Typography variant="caption" className="small">Aucun produit / Article</Typography>
				</Box>
			}
		</StyledContainer>
	);
}
