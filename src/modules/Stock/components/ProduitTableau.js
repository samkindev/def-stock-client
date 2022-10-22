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
import { useSelector, useDispatch } from "react-redux";
import { getFilterdProduits, getCounts } from "../../../app/reducers/stockProduit";
import { Button, IconButton, Typography, useTheme } from "@mui/material";
import { MoreVertOutlined } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DownloadIcon from "@mui/icons-material/Download";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { SearchAuctoComplete } from "../../../Components/Inputs/Search";
import { Box } from "@mui/system";
import ComboBox from "../../../Components/Inputs/ComboBox";
import {
	getCategories,
	getCategoriesProduit,
} from "../../../app/reducers/stockProduit";
import { MenuPoppover } from "../../../Components";

// Quelques composants
const StyledContainer = styled("div")(() => ({
	marginTop: 10,
}));
const StyledHorizontal = styled(Box)(() => ({
	display: "flex",
	alignItems: "center",
	"&.top > div:first-of-type": {
		marginRight: 10,
	},
	"&.top > div": {
		padding: "10px 0",
		"& > *:last-child": {
			marginLeft: 10,
		},
	},
}));
const StyledFilters = styled("div")(() => ({
	paddingBottom: "15px",
	width: "100%",
	display: "flex",
	flexWrap: "nowrap",
	alignItems: "center",
}));

const StyledTab = styled(Button)(() => ({
	borderRadius: 5,
	flex: 1,
	width: "100%",
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-start",
	color: "#fff!important",
	transition: "transform .2s",
	maxWidth: 150,
	"&:not(:first-of-type)": {
		marginLeft: 10,
	},
	"& > span": {
		fontSize: 15,
	},
	"& > span:not(:first-of-type)": {
		fontWeight: "600",
	},
	"&.active": {
		transform: "scaleY(1.1)",
		boxShadow: "0px 0px 15px #00000054",
	},
}));
const StyledTableContainer = styled(TableContainer)(() => ({
	marginTop: 10,
	borderRadius: 5,
	border: "1px solid #eaeaea",
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
			textDecoration: "none",
			"&:hover": {
				textDecoration: "underline",
			},
		},
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
	const counts = useSelector(getCounts);
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
	}, []);

	return (
		<StyledContainer>
			<div>
				<StyledFilters>
					<StyledTab
						color="primary"
						variant="contained"
						disableElevation
						disableRipple
						className={filter === "tous" && "active"}
						onClick={() => handleFilterClick("tous")}
					>
						<span>Tous</span>
						<span>{counts.all}</span>
					</StyledTab>
					<StyledTab
						color="info"
						variant="contained"
						disableElevation
						disableRipple
						className={filter === "dispo" && "active"}
						onClick={() => handleFilterClick("dispo")}
					>
						<span>Disponnibles</span>
						<span>{counts.dispo}</span>
					</StyledTab>
					<StyledTab
						color="error"
						variant="contained"
						disableElevation
						disableRipple
						className={filter === "indispo" && "active"}
						onClick={() => handleFilterClick("indispo")}
					>
						<span>Indisponibles</span>
						<span>{counts.indispo}</span>
					</StyledTab>
					<StyledTab
						color="secondary"
						variant="contained"
						disableElevation
						disableRipple
						className={filter === "alert" && "active"}
						onClick={() => handleFilterClick("alert")}
					>
						<span>En Alerte</span>
						<span>{counts.alert}</span>
					</StyledTab>
				</StyledFilters>
				<StyledHorizontal
					className="top"
				// justifyContent="space-between"
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
								ml: "0!important",
							}}
							textFieldXs={{
								mt: 0,
								mb: 0,
							}}
						/>
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
			</div>
			<StyledTableContainer>
				<Table size="small" aria-label="customized table">
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
							<StyledTableCell align="right">
								Options
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
												color:
													parseFloat(
														produit.quantite
													) <=
														parseFloat(
															produit.quantite_min
														)
														? "red"
														: "",
												fontWeight: 600,
											}}
										>
											{produit.quantite}
										</StyledTableCell>
										<StyledTableCell align="right">
											{produit.quantite_min}
										</StyledTableCell>
										<StyledTableCell align="right">
											{produit.marge}%
										</StyledTableCell>
										<StyledTableCell align="right">
											<ProduitOptions />
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
							<StyledTableCell align="right"></StyledTableCell>
						</StyledTableRow>
					</TableBody>
				</Table>
			</StyledTableContainer>
		</StyledContainer>
	);
}

const ProduitOptions = () => {
	const [anchorEl, setAnchorEl] = useState();
	const open = Boolean(anchorEl);

	const openMenu = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const closeMenu = () => {
		setAnchorEl(null);
	};
	return (
		<>
			<IconButton onClick={openMenu} sx={{ p: 0 }}>
				<MoreVertOutlined fontSize="small" color="default" />
			</IconButton>
			{open && (
				<MenuPoppover
					anchorEl={anchorEl}
					open={open}
					handleClose={closeMenu}
					anchorOrigin={{
						vertical: "center",
						horizontal: "center",
					}}
					transformOrigin={{
						vertical: "center",
						horizontal: "center",
					}}
				>
					<Paper>
						<MenuList>
							<MenuItem>
								<ListItemIcon>
									<ReadMoreIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText>Voir détails</ListItemText>
							</MenuItem>
							<MenuItem>
								<ListItemIcon>
									<DownloadIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText>Approvisionnemt</ListItemText>
							</MenuItem>
							<Divider />
							<MenuItem>
								<ListItemIcon>
									<EditIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText>Modifier</ListItemText>
							</MenuItem>
							<MenuItem>
								<ListItemIcon>
									<HighlightOffIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText>Supprimer</ListItemText>
							</MenuItem>
						</MenuList>
					</Paper>
				</MenuPoppover>
			)}
		</>
	);
};
