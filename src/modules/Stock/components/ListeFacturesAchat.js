import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import { Close as CloseIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import {
	getFacturesAchat,
	getReqStatus,
	selectAll,
} from "../../../app/reducers/factureAchat";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import noSelectedImage from "../../../assets/nodata.svg";
import noData from "../../../assets/void.svg";
import SelectedFacture from "./SelectedApprovFacture";
import { Chargement } from "../../../Components";

export default function ListeFacturesAchat({ open, onClose }) {
	const loading = useSelector(getReqStatus) === "loading";
	const factures = useSelector(selectAll).filter((fA) => !fA.approvisionnee);
	const [active, setActive] = useState(null);
	const [produistApprovisionnes, setProduitsApprovisionnes] = useState([]);

	const handleSelectFacture = (facture) => {
		setActive(facture);
	};

	const clearSelectedFacture = () => {
		setActive(null);
	};

	const handleSetProduitsApprovisionnes = (produit) => {
		setProduitsApprovisionnes([...produistApprovisionnes, produit]);
	};

	const handleRemoveProduct = (produit) => {
		const prods = produistApprovisionnes.filter(
			(prod) => prod.id_achete !== produit.id_achete
		);
		setProduitsApprovisionnes(prods);
	};

	const handleClearSelection = () => {
		setProduitsApprovisionnes([]);
	};

	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getFacturesAchat());
	}, [dispatch]);
	return (
		<Modal open={open} onClose={onClose}>
			<StyledContainer>
				{factures.length === 0 ? (
					<StyledNoContent>
						<Box
							textAlign="center"
							display="flex"
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							width={"100%"}
							alignSelf={"center"}
							justifySelf={"center"}
						>
							<Typography variant="h1" sx={{ mb: 7, fontSize: 22 }}>
								Factures d'achat non approvisionnée
							</Typography>
							<img style={{height: 100, width: 'auto'}} src={noData} alt="Aucune facture" />
							<Typography variant="caption" sx={{ mt: 2 }}>
								Aucune facture d'achat non approvisionnée
							</Typography>
							<Button
								variant="contained"
								color="primary"
								onClick={onClose}
								size="medium"
								sx={{ mt: 4 }}
								disableElevation
							>
								Fermer
							</Button>
						</Box>
					</StyledNoContent>
				) : (
					<StyledContentContainer>
						<StyledAside>
							<StyledHorizontal
								justifyContent="space-between"
								pl={2.5}
								pr={1}
							>
								<Typography variant="h2">
									Factures d'achat non approvisionnée
								</Typography>
								<IconButton onClick={onClose}>
									<CloseIcon fontSize="small" />
								</IconButton>
							</StyledHorizontal>
							{loading ? (
								<Chargement
									message="Chargement..."
									sx={{ height: "70%" }}
									size={20}
								/>
							) : (
								<StyledList>
									{factures.map((facture, index) => (
										<FactureCard
											onSelect={handleSelectFacture}
											key={`${facture.reference_facture}_${index}`}
											facture={facture}
											activeId={active && active.id}
										/>
									))}
								</StyledList>
							)}
						</StyledAside>
						<StyledDisplaySelected
							className={active ? "active" : ""}
						>
							{!active ? (
								<Box
									textAlign="center"
									display="flex"
									flexDirection="column"
									alignItems="center"
									justifyContent="center"
									width={"100%"}
									height={130}
									alignSelf={"center"}
									justifySelf={"center"}
								>
									<img
										src={noSelectedImage}
										alt="Aucune Selection"
									/>
									<Typography
										variant="caption"
										sx={{ mt: 2 }}
									>
										Sélectionnez une facture !
									</Typography>
								</Box>
							) : (
								<SelectedFacture
									facture={active}
									produistApprovisionnes={
										produistApprovisionnes
									}
									handleClearSelection={handleClearSelection}
									handleRemoveProduct={handleRemoveProduct}
									clearSelectedFacture={clearSelectedFacture}
									handleAppendProduits={
										handleSetProduitsApprovisionnes
									}
								/>
							)}
						</StyledDisplaySelected>
					</StyledContentContainer>
				)}
			</StyledContainer>
		</Modal>
	);
}

const FactureCard = ({ facture, activeId, onSelect }) => {
	return (
		<StyledFactureCard
			className={activeId === facture.id ? "active" : ""}
			onClick={() => onSelect(facture)}
		>
			<span className="activeBar" />
			<Typography
				sx={{
					fontWeight: "600",
					fontSize: 15,
				}}
			>
				<span>Facture : </span>
				<span>
					{facture.reference_facture} {facture.sigle_fournisseur}
				</span>
			</Typography>
			<Typography
				variant="body2"
				sx={{
					fontSize: 14,
				}}
			>
				<span>Qunatité : {facture.quantite_total}</span>
			</Typography>
			<Typography
				variant="caption"
				color="GrayText"
				sx={{
					fontSize: 12,
					width: "100%",
				}}
			>
				{facture.produitAchetes.map((pA) => (
					<span key={pA.designation}>
						{pA.quantite} {pA.designation},{" "}
					</span>
				))}
			</Typography>
		</StyledFactureCard>
	);
};

const StyledContainer = styled("div")(() => ({
	// height: '100vh',
	width: "100%",
	backgroundColor: "#faf8ff",
	overflowY: "auto",
	display: "flex",
	flexDirection: "column",
	height: "100%",
	flex: "1 0 auto",
	zIndex: 1200,
	position: "fixed",
	top: 0,
	outline: "currentcolor none 0px",
	left: 0,
	color: "#444",
}));
const StyledHorizontal = styled(Box)(() => ({
	display: "flex",
	alignItems: "center",
}));
const StyledContentContainer = styled("div")(() => ({
	display: "flex",
}));
const StyledAside = styled(Box)(() => ({
	// borderBottom: "1px solid #eaeaea",
	width: "300px",
	padding: "15px 0 15px 20px",
	backgroundColor: "#f0f0f0",
	height: "100vh",
	overflowY: "auto",
}));
const StyledList = styled("div")(() => ({
	marginTop: 10,
}));

const StyledDisplaySelected = styled("div")(() => ({
	maxWidth: 1200,
	flex: 1,
	display: "flex",
	"&.active": {
		boxShadow: "-2px 0px 5px #2020200f",
	},
}));
const StyledNoContent = styled("div")(() => ({
	width: "100%",
	height: "100%",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));
const StyledFactureCard = styled("div")(({ theme }) => ({
	padding: "5px 10px 5px 25px",
	marginBottom: 10,
	borderRadius: 5,
	backgroundColor: "#bbbbbb45",
	marginRight: 20,
	cursor: "pointer",
	transition: "background .1s",
	position: "relative",
	overflow: "hidden",
	"& > p": {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		display: "block",
	},
	"& > span": {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		display: "block",
	},
	"&:hover": {
		backgroundColor: "#faf8ff",
	},
	"&.active": {
		backgroundColor: "#faf8ff",
		marginRight: 0,
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
		boxShadow:
			"-1px 0px 0px rgba(0, 0, 0, 0.12),-1px 0px 0px rgba(0,0,0,0.14),-5px 0px 5px rgba(0,0,0,0.12)",
	},
	"&.active > .activeBar": {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		backgroundColor: theme.palette.primary.main,
		width: 5,
	},
}));
