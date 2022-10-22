import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Popover, CircularProgress } from "@mui/material";
import TableFicheStock from "../components/TableFicheStock";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import SortieIcon from "@mui/icons-material/CallMade";
import EntreeIcon from "@mui/icons-material/Download";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FicheStockChart from "../components/FicheStockChart";
import { styled } from "@mui/styles";
import {
	getFicheStockData,
	selectAll,
	getFicheStockInitData,
	getNombreEntrees,
	getNombreSorties,
} from "../../../app/reducers/ficheStock";
import { selectAll as selectAllProduit, getProduits, getReqState } from "../../../app/reducers/stockProduit";
import { Box } from "@mui/system";
import { CustomisedChekbox as Checkbox, ComboBox, MonthYearPeaker } from "../../../Components";

export default function FicheStock() {
	const ficheData = useSelector(selectAll);
	const nbreEntrees = useSelector(getNombreEntrees);
	const nbreSorties = useSelector(getNombreSorties);

	console.log(nbreEntrees, nbreSorties);

	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getFicheStockInitData());
	}, [dispatch]);
	useEffect(() => {
		if (ficheData.length === 0) {
			dispatch(getFicheStockData());
		}
	}, [ficheData, dispatch]);
	return (
		<StyledContainer>
			<StyledHeader>
				<div>
					<Typography className="module-title">
						Mouvement des stocks
					</Typography>
				</div>
				<MonthYearPeaker value={new Date()} onChange={() => { }} />
			</StyledHeader>
			<div>
				<StyledDataDisplay>
					<Box>
						<Typography variant="h2" sx={{ mb: 2 }}>
							Transactions
						</Typography>
						<Box display="flex">
							<div>
								<StyledCountCard>
									<div>
										<Typography
											variant="caption"
											color="primary"
											className="large"
										>
											{nbreEntrees}
										</Typography>
										<Typography
											variant="caption"
											color="GrayText"
										>
											Entrées stock
										</Typography>
									</div>
									<EntreeIcon
										fontSize="small"
										color="primary"
									/>
								</StyledCountCard>
								<StyledCountCard>
									<div>
										<Typography
											variant="caption"
											color="secondary"
											className="large"
										>
											{nbreSorties}
										</Typography>
										<Typography
											variant="caption"
											color="GrayText"
										>
											Sorties stock
										</Typography>
									</div>
									<SortieIcon
										fontSize="small"
										color="secondary"
									/>
								</StyledCountCard>
							</div>
							<div className="chart">
								<FicheStockChart />
							</div>
						</Box>
					</Box>
					<Filters />
				</StyledDataDisplay>
				<TableFicheStock data={ficheData} />
			</div>
		</StyledContainer>
	);
}

// Composant des filtres

const Filters = () => {
	const produits = useSelector(selectAllProduit);
	const loading = useSelector(getReqState) === 'loading';
	const [open, setOpen] = useState(false);
	const [produit, setProduit] = useState(null);
	const handleChangeProduit = (value) => {
		setProduit(value);
	};
	const dispatch = useDispatch();
	const handleChange = (e) => {
		setOpen(!open);
		if (produits.length === 0) {
			dispatch(getProduits());
		}
	}

	return (
		<StyledFilters>
			<Typography variant="h2" sx={{ mb: '0px!important' }}>
				Filtres
			</Typography>
			<StyledProduitFilter>
				<Periode />
				<Box mb={1} mt={2} display="flex" alignItems="center">
					<Checkbox color="default" checked={open} onChange={handleChange} label="Produits" />
					{loading && <CircularProgress size={10} sx={{ ml: 1.5 }} />}
				</Box>
				<Box ml={3}>
					<ComboBox
						value={produit}
						placeholder="Séléctionnez un produit"
						filterSelectedOptions={true}
						label="Séléctionnez un produit"
						setValue={handleChangeProduit}
						disabled={!open || loading}
						minWidth={150}
						options={produits.map((prod) => ({
							id: prod.id,
							label: prod.designation,
							marge: prod.marge,
						}))}
					/>
				</Box>
			</StyledProduitFilter>
		</StyledFilters>
	);
};

// Composant de séléction de la période

const periodes = [
	{ id: 1, name: "24h" },
	{ id: 2, name: "3 jours" },
	{ id: 3, name: "1 semaine" },
	{ id: 4, name: "1 mois" },
];

const Periode = () => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [activePeriode, setActivePeriode] = useState({
		id: 4,
		name: "1 mois",
	});
	const open = anchorEl ? true : false;

	const toggleMenu = (event) => {
		if (!anchorEl) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	const handleSelectPeriode = (name) => {
		setActivePeriode(name);
		setAnchorEl(null);
	};

	const canBeOpen = open && Boolean(anchorEl);
	const id = canBeOpen ? "transition-popper" : undefined;

	return (
		<StyledPeriod>
			<button aria-describedby={id} type="button" onClick={toggleMenu}>
				Période :<span>{activePeriode.name}</span>
				<ExpandMoreIcon fontSize="small" />
			</button>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={toggleMenu}
				elevation={3}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				BackdropProps={{ sx: { backgroundColor: "rgba(0,0,0,0)" } }}
			>
				<StyledPeriodeMenu>
					<Typography variant="caption">
						Séléctionner la période
					</Typography>
					<ul>
						{periodes.map((periode) => (
							<li
								key={periode.id}
								onClick={() => handleSelectPeriode(periode)}
							>
								<span>
									{periode.id === activePeriode.id && (
										<RadioButtonCheckedIcon
											fontSize="small"
											color="default"
										/>
									)}
								</span>
								<Typography variant="caption">
									{periode.name}
								</Typography>
							</li>
						))}
					</ul>
				</StyledPeriodeMenu>
			</Popover>
		</StyledPeriod>
	);
};

// Composants stylés

const StyledContainer = styled("div")(() => ({}));
const StyledCountCard = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	width: 150,
	border: "1px solid #eaeaea",
	borderRadius: 5,
	padding: 10,
	"&:not(:last-child)": {
		marginBottom: 10,
	},
	"& > div": {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		"& > span": {
			fontSize: 12,
		},
		"& > .large": {
			fontSize: 25,
			fontWeight: "bold",
		},
	},
}));
const StyledHeader = styled("header")(() => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	borderBottom: "1px solid #eaeaea",
	padding: "10px 0",
}));
const StyledPeriod = styled("div")(() => ({
	display: "flex",
	alignItems: "center",
	"& > button": {
		display: "flex",
		alignItems: "center",
		cursor: "pointer",
		padding: "8px 14px",
		border: "1px solid #b1d8ff33",
		backgroundColor: "#91bfed14",
		borderRadius: 5,
		outline: "none",
		color: "#666",
		"& > span": {
			color: "#333",
			fontWeight: 600,
		},
	},
}));
const StyledPeriodeMenu = styled("div")(() => ({
	display: "flex",
	flexDirection: "column",
	backgroundColor: "#fff",
	border: "1px solid #eaeaea",
	borderRadius: 5,
	width: 300,
	"& > span:first-of-type": {
		borderBottom: "1px solid #eaeaea",
		padding: "7px 10px",
	},
	"& > span, & li": {
		fontSize: 12,
	},
	"& li": {
		cursor: "pointer",
		display: "flex",
		alignItems: "center",
		padding: "0px 10px",
		transition: "background .2s",
		"& > span": {
			padding: "7px 0px",
			fontSize: 12,
		},
		"& > span:first-of-type": {
			width: "10%",
			padding: 0,
		},
		"&:hover": {
			backgroundColor: "#eaeaea",
		},
	},
	"& li:not(:last-child)": {
		borderBottom: "1px solid #eaeaea",
	},
}));
const StyledDataDisplay = styled("div")(({ theme }) => ({
	display: "flex",
	padding: "20px 0",
	"& > div": {
		flex: 1,
	},
	"& .chart": {
		height: 210,
		backgroundColor: "#fff",
		borderRadius: 5,
		padding: 10,
		border: "1px solid #eaeaea",
		width: 500,
		marginLeft: 15,
	},
	"& h2": {
		padding: "8px 16px",
		backgroundColor: theme.palette.primary.main,//"#f6f8fa",
		// backgroundImage: 'linear-gradient(1deg, #f3f3f3, rgb(245 245 245 / 87%))',//"#f6f8fa",
		fontWeight: 'bold',
		color: '#fff',
		borderTopLeftRadius: 6,
		borderTopRightRadius: 6,
		borderBottom: '1px solid #eaeaea',
	}
}));
const StyledFilters = styled("div")(({ theme }) => ({
	backgroundColor: "#fff",
	borderRadius: 5,
	border: "1px solid #eaeaea",
	marginLeft: 15,
	"& > h2": {
		padding: "8px 16px",
		backgroundColor: theme.palette.primary.main,//"#f6f8fa",
		// backgroundImage: 'linear-gradient(1deg, #f3f3f3, rgb(245 245 245 / 87%))',//"#f6f8fa",
		color: '#fff',
		fontWeight: 'bold',
		borderTopLeftRadius: 6,
		borderTopRightRadius: 6,
		borderBottom: '1px solid #eaeaea',
	}
}));
const StyledProduitFilter = styled("div")(() => ({
	padding: '15px 16px',
}));
