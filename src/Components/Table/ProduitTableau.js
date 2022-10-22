import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Checkbox from "@mui/material/Checkbox";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector, useDispatch } from "react-redux";
import { getFilterdProduits } from "../../app/reducers/produit";
import { Button, Typography, useTheme } from "@mui/material";
import { Warning } from "@mui/icons-material";
import { SearchAuctoComplete } from "../Inputs/Search";
import { Box } from "@mui/system";
import { ComboBox } from "..";
import {
	getCategories,
	getCategoriesProduit,
} from "../../app/reducers/produit";

// Quelques composants
const StyledContainer = styled("div")(() => ({
	// border: "1px solid #eaeaea",
	borderRadius: 5,
}));
const StyledHorizontal = styled(Box)(() => ({
	display: "flex",
	alignItems: "center",
	"&.top > div": {
		padding: "10px 0",
		"& > *:last-child": {
			marginLeft: 10,
		},
	},
}));
const StyledFilters = styled("div")(({ theme }) => ({
	backgroundColor: theme.palette.primary.light,
	color: "#fff",
}));
const StyledTab = styled(Button)(({ theme }) => ({
	borderRadius: 0,
	"&.active": {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
	},
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.white,
		color: theme.palette.common.black,
		fontSize: 15,
		padding: "7px 10px",
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
		padding: "7px 10px",
		"&.prodLink": {
			textDecoration: 'none',
			"&:hover": {
				textDecoration: 'underline',
			}
		}
	},
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

export default function ProduitTableau() {
	// declaration des variables d'étas
	const categories = useSelector(getCategories) || [];
	const theme = useTheme();
	const [selected, setSelected] = React.useState([]);
	const [categorie, setCategorie] = useState(null);
	const [filter, setFilter] = useState("tous");
	const [searchText, setSearchText] = useState(null);
	const produits = useSelector((state) =>
		getFilterdProduits(state, categorie ? categorie.id : null, filter)
	);
	const dispatch = useDispatch();

	// Fonction de recuperation du filtre
	const handleFilterClick = (filter) => {
		setFilter(filter);
	};

	// Fonction de séléction multiple
	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = produits.map((n) => n.id);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	// Fonction de séléction d'une seule ligne du tableau
	const handleClick = (event, id) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
	};

	// Fonction de verification de la séléction d'une ligne du tableau
	const isSelected = (name) => selected.indexOf(name) !== -1;

	useEffect(() => {
		// Recharger les categories
		if (!categories || categories.length === 0) {
			dispatch(getCategoriesProduit());
		}
	}, [dispatch]);

	return (
		<StyledContainer>
			<div>
				<StyledHorizontal
					className="top"
					justifyContent="space-between"
				>
					<StyledHorizontal className="header">
						<SearchAuctoComplete
							options={produits.map((prod) => ({
								label: prod.designation,
								id: prod.id,
							}))}
							mb={0}
							value={searchText}
							setValue={(value) => setSearchText(value)}
							placeholder="Recherche..."
							sx={{
								minWidth: 200,
							}}
							textFieldXs={{
								mt: 0,
								mb: 0,
							}}
						/>
						<Button
							variant="outlined"
							color="primary"
							size="medium"
							disableElevation
							disabled={selected.length === 0}
						>
							Supprimer
						</Button>
					</StyledHorizontal>
					<StyledHorizontal>
						<Typography variant="caption">Catégorie</Typography>
						<ComboBox
							placeholder="Sélectionnez"
							options={categories.map((cat) => ({
								label: cat.nom_categorie,
								...cat,
							}))}
							value={categorie}
							setValue={(value) => setCategorie(value)}
							sx={{
								minWidth: 200,
							}}
							textFieldXs={{
								mt: 0,
								mb: 0,
							}}
						/>
					</StyledHorizontal>
				</StyledHorizontal>
				<StyledFilters>
					<StyledTab
						color="inherit"
						className={filter === "tous" && "active"}
						onClick={() => handleFilterClick("tous")}
					>
						Tous
					</StyledTab>
					<StyledTab
						color="inherit"
						className={filter === "dispo" && "active"}
						onClick={() => handleFilterClick("dispo")}
					>
						Disponnible
					</StyledTab>
					<StyledTab
						color="inherit"
						className={filter === "indispo" && "active"}
						onClick={() => handleFilterClick("indispo")}
					>
						Indisponible
					</StyledTab>
					<StyledTab
						color="inherit"
						className={filter === "alert" && "active"}
						onClick={() => handleFilterClick("alert")}
					>
						Alerte
					</StyledTab>
				</StyledFilters>
			</div>
			<TableContainer style={{marginTop: 10}}>
				<Table
					sx={{ minWidth: 700, border: '1px solid #eaeaea' }}
					size="small"
					aria-label="customized table"
				>
					<TableHead>
						<TableRow>
							<StyledTableCell padding="checkbox">
								<Checkbox
									color="primary"
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
							<StyledTableCell>Code</StyledTableCell>
							<StyledTableCell>Désignation</StyledTableCell>
							<StyledTableCell>Catégorie</StyledTableCell>
							<StyledTableCell>Unité</StyledTableCell>
							<StyledTableCell align="right">
								Quantité
							</StyledTableCell>
							<StyledTableCell align="right">
								Q. min
							</StyledTableCell>
							<StyledTableCell align="right">
								Marge
							</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{produits &&
							produits.map((produit, i) => {
								const isItemSelected = isSelected(produit.id);
								return (
									<StyledTableRow key={produit.id}>
										<StyledTableCell padding="checkbox">
											<Checkbox
												size="small"
												color="primary"
												checked={isItemSelected}
												onChange={(e) =>
													handleClick(e, produit.id)
												}
												inputProps={{
													"aria-label":
														"select all desserts",
												}}
											/>
										</StyledTableCell>
										<StyledTableCell>
											{produit.code_produit}
										</StyledTableCell>
										<StyledTableCell
											style={{
												color: theme.palette.primary
													.main,
											}}
											className="prodLink"
											component="th"
											scope="row"
										>
											<Link
												to={produit.id}
												style={{
													textDecoration: "inherit",
												}}
											>
												{produit.designation}
											</Link>
										</StyledTableCell>
										<StyledTableCell>
											{produit.categorie_produit
												? produit.categorie_produit
														.code_categorie
												: ""}
										</StyledTableCell>
										<StyledTableCell>
											{produit.unite}
										</StyledTableCell>
										<StyledTableCell
											align="right"
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "end",
												width: "100%",
												padding: "8px 14px",
												fontSize: "15px!important",
											}}
										>
											{produit.quantite}
											{parseFloat(produit.quantite) <=
												parseFloat(
													produit.quantite_min
												) && (
												<Warning
													sx={{
														fontSize: "1rem",
														mr: 1,
													}}
													fontSize="small"
													color="secondary"
												/>
											)}
										</StyledTableCell>
										<StyledTableCell align="right">
											{produit.quantite_min}
										</StyledTableCell>
										<StyledTableCell align="right">
											{produit.marge}%
										</StyledTableCell>
									</StyledTableRow>
								);
							})}
						<StyledTableRow style={{ height: 35 }}>
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
					</TableBody>
				</Table>
			</TableContainer>
		</StyledContainer>
	);
}
