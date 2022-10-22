import React, { useState, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import { Circle as CircleIcon } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { selectAll as selectAllProduits } from "../../../app/reducers/stockProduit";
import { ComboBox, LargeDialog, MenuPoppover } from "../../../Components";
import {
	Checkbox,
	Typography,
	TextField,
	Button,
	Divider,
	Chip,
	Fade,
	CircularProgress,
} from "@mui/material";
import { Box } from "@mui/system";
import { formatNumber, getPrixUnitaire } from "../../../utilities/helpers";
import ApprovProduitList from "./ApprovProduitList";
import {
	creerEntreeMultiple,
	getReqState as getSavingState,
} from "../../../app/reducers/entree";
import { getTaux, getDevise } from "../../../app/reducers/config";
import { actions } from "../../../app/reducers/factureAchat";
import { FeedbackContext } from "../../../App";

export default function SelectedFacture({
	facture,
	handleAppendProduits,
	handleRemoveProduct,
	handleClearSelection,
	produistApprovisionnes,
	clearSelectedFacture
}) {
	const devise = useSelector(getDevise);
	const taux = useSelector(getTaux);
	const produits = useSelector(selectAllProduits);
	const [anchorEl, setAnchorEl] = useState(null);
	const [produitAchete, setProduitAchete] = useState(null);
	const [produitApprov, setProduitApprov] = useState(null);
	const open = Boolean(anchorEl);
	const containerRef = React.useRef();
	const dispatch = useDispatch();
	const saving = useSelector(getSavingState) === "loading";
	const { createFeedback } = useContext(FeedbackContext);
	const [submitError, setSubmitError] = useState(null);

	const handleSelectProduitApprovisionne = (value) => {
		if (!produitAchete) {
			setProduitApprov(null);
			return;
		}
		if (value) {
			// Calcul du coût unitaire et du prix unitaire de vente
			const cu = getPrixUnitaire(
				produitAchete.prix_ht,
				produitAchete.quantite,
				"number"
			);
			const pV_u = cu * (1 + value.marge / 100);
			// Ajout du prix de vente unitaire et de la quantité et du coût unitaire au produit à aprovisionner
			const pA = {
				...value,
				pv_unitaire: pV_u,
				quantite: produitAchete.quantite,
				cout_unitaire: cu,
				id_achete: produitAchete.id,
			};
			setProduitApprov(pA);
		} else {
			setProduitApprov(value);
		}
	};

	// Valider les produits approvisionnés
	// Tous les produits de la facture doivent etre sélectionnés avant l'enregistrement
	// 1. Verification si les deux tableau des produits ne sont pas vide ou null
	// 2. Verification si tous les produits sont sélectionnés
	const canSubmit = () => {
		const pAchetes = facture.produitAchetes;
		if (
			!produistApprovisionnes ||
			produistApprovisionnes.length < 0 ||
			!pAchetes ||
			pAchetes.length === 0
		) {
			return false;
		}

		let submit = true;
		pAchetes.forEach((p) => {
			if (
				!produistApprovisionnes.some((pApp) => pApp.id_achete === p.id)
			) {
				submit = false;
			}
		});

		return submit;
	};

	// Fonction appelée lors de la confirmation de l'enregistrement du produit
	// 1. Verification de la validité des données
	// 2. Envoie de la requête, initialisation, et notification de l'enregistrement
	const handleSubmitSelection = () => {
		const valid = canSubmit();
		if (valid) {
			dispatch(
				creerEntreeMultiple({
					data: {
						devise: devise,
						provenance: "facture",
						taux: taux,
						produits: produistApprovisionnes,
					}, factureId: facture.id
				})
			).then(({ payload }) => {
				if (payload && payload.state === "success") {
					dispatch(actions.updateteOne({ id: facture.id, attribute: 'approvisionnee', value: true }));
					handleClearSelection();
					clearSelectedFacture();
					// Notification 
					createFeedback(
						"Enregistrement fait avec succès !",
						"enregistrement-entrees-facture-multiple",
						"success"
					);
				}
			});
		} else {
			setSubmitError(
				"Verifiez que tous les produits de la facture sont bien sélectionnés."
			);
		}
	};

	const handleCancelSelection = () => {
		handleClearSelection();
	};

	const handleConfirm = () => {
		handleAppendProduits(produitApprov);
		handleClose();
	};

	const handleOpenDialog = (event, produit) => {
		setAnchorEl(event.currentTarget);
		setProduitAchete(produit);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setProduitAchete(null);
		setProduitApprov(null);
	};
	return (
		<div style={{ width: "100%", display: "flex" }} ref={containerRef}>
			{submitError && (
				<LargeDialog
					title="Erreur"
					open={submitError ? true : false}
					message={submitError}
					onClose={() => setSubmitError(null)}
					agreeBtnText="Ok"
					onAgree={() => setSubmitError(null)}
				/>
			)}
			<Fade in>
				<StyledFacture>
					<Typography variant="h2">
						Facture #{facture.reference_facture}
						<span style={{ float: "right" }}>
							{new Date(facture.createdAt).toLocaleDateString()}
						</span>
					</Typography>
					<StyledFactureHeader>
						<Typography variant="body2">
							<span>Fournisseur : </span>
							<span>{facture.raison_sociale_fournisseur}</span>
						</Typography>
						<Typography variant="body2">
							<span>Bon decommande : </span>
							<span>{facture.bon_commande || "Non définit"}</span>
						</Typography>
						<Typography variant="body2">
							<span>Nombre produits : </span>
							<span>{facture.produitAchetes.length}</span>
						</Typography>
						<Typography variant="body2">
							<span>Autres Frais : </span>
							<span>
								{facture.total_charge || 0} {facture.devise}
							</span>
						</Typography>
					</StyledFactureHeader>
					<Box height={"calc(100vh - 265px)"} minHeight={400}>
						<StyledRow className="header" in>
							<div>
								<IconButton color="primary">
									<CircleIcon
										fontSize="small"
										htmlColor="#fff"
									/>
								</IconButton>
								<Typography variant="caption" className="fill">
									Produit
								</Typography>
								<Typography variant="caption" className="right">
									Quantité
								</Typography>
								<Typography variant="caption" className="right">
									Coût U.
								</Typography>
							</div>
						</StyledRow>
						<StyledFactureBody>
							{facture.produitAchetes.map((pAchete, i) => {
								const isSelected = produistApprovisionnes.some(
									(pApp) => pApp.id_achete === pAchete.id
								);
								return (
									<Row
										key={`${pAchete.designation}_${i}`}
										produit={pAchete}
										onClick={handleOpenDialog}
										devise={facture.devise}
										selected={isSelected}
									/>
								);
							})}
						</StyledFactureBody>
						{open && (
							<MenuPoppover
								anchorEl={anchorEl}
								open={open}
								handleClose={handleClose}
								anchorOrigin={{
									vertical: "center",
									horizontal: "center",
								}}
								transformOrigin={{
									vertical: "center",
									horizontal: "center",
								}}
							>
								<StyledMenu>
									<Box pb={2}>
										<Typography
											variant="caption"
											sx={{ mb: 1, display: "block" }}
										>
											Produit Acheté
										</Typography>
										<Chip
											label={produitAchete.designation}
										/>
									</Box>
									<Divider />
									<Box pt={2} pb={2}>
										<Typography
											variant="caption"
											sx={{ mb: 1, display: "block" }}
										>
											Produit Approvisionné
										</Typography>
										<ComboBox
											value={produitApprov}
											placeholder="Produit *"
											filterSelectedOptions={true}
											label="Produit"
											setValue={
												handleSelectProduitApprovisionne
											}
											options={produits.map((prod) => ({
												label: prod.designation,
												...prod,
											}))}
										/>
										<Typography
											variant="caption"
											sx={{ mb: 1 }}
										>
											Marge:{" "}
											<Chip
												sx={{ minWidth: 40 }}
												label={
													produitApprov
														? produitApprov.marge +
														"%"
														: ""
												}
											/>
										</Typography>
										<TextField
											label="Prix de vente unitaire *"
											id="pv"
											name="pv"
											value={
												produitApprov
													? formatNumber(
														produitApprov.pv_unitaire
													) + facture.devise
													: ""
											}
											placeholder="Coût unitaire du produit"
											variant="outlined"
											disabled
											fullWidth
											helperText="Ce prix sera utilisé lors de la vente."
										/>
									</Box>
									<Button
										disabled={produitApprov ? false : true}
										variant="contained"
										color="primary"
										size="small"
										disableElevation
										onClick={handleConfirm}
									>
										Confirmer
									</Button>
									<Button
										variant="outlined"
										color="default"
										size="small"
										sx={{ ml: 2 }}
										onClick={handleClose}
									>
										Annuler
									</Button>
								</StyledMenu>
							</MenuPoppover>
						)}
					</Box>
					<StyledMessage>
						<InfoIcon
							color="info"
							fontSize="medium"
							sx={{ mr: 2 }}
						/>
						<Typography sx={{ fontSize: 14 }} variant="caption">
							Pour sélectionner un produit cliquez sa ligne dans
							le tableaux des produits achetés et puis choisissez
							le produit à approvisionner dans la boite de
							dialogue.
						</Typography>
					</StyledMessage>
				</StyledFacture>
			</Fade>
			<StyledProduitApprov>
				<Typography variant="h2">Produits Approvisionnés</Typography>
				{produistApprovisionnes.length === 0 ? (
					<></>
				) : (
					<>
						<Divider />
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "flex-end",
								pt: 3,
							}}
						>
							<Button
								variant="outlined"
								color="default"
								size="small"
								onClick={handleCancelSelection}
							>
								Annuler
							</Button>
							<Button
								variant="contained"
								color="primary"
								size="small"
								disableElevation
								onClick={handleSubmitSelection}
								sx={{
									ml: 2,
									minWidth: 84,
									height: 30.75,
								}}
							>
								{saving ? (
									<CircularProgress
										size={12}
										color="inherit"
									/>
								) : (
									"Enregistrer"
								)}
							</Button>
						</Box>
						<ApprovProduitList
							removeProduit={handleRemoveProduct}
							approvProduits={produistApprovisionnes}
						/>
					</>
				)}
			</StyledProduitApprov>
		</div>
	);
}

const StyledMessage = styled("div")(({ theme }) => ({
	position: "absolute",
	bottom: 0,
	left: 0,
	right: 0,
	backgroundColor: "#fff",
	padding: "10px 20px",
	borderTop: "1px solid #eaeaea",
	display: "flex",
	alignItems: "baseline",
}));

const StyledFacture = styled("div")(() => ({
	position: "relative",
	flex: 2,
	width: "100%",
	minWidth: 400,
	maxWidth: 530,
	padding: "30px 20px",
}));
const StyledFactureHeader = styled("div")(({ theme }) => ({
	marginBottom: 20,
	"& > p": {
		fontSize: 15,
		display: "flex",
		"& > span": {
			flex: 1,
		},
	},
}));
const StyledFactureBody = styled("div")(() => ({
	border: "1px solid rgb(208, 215, 222)",
	maxHeight: "calc(100% - 35px)",
	overflowY: "auto",
}));
const StyledRow = styled(Fade)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	"&.header": {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
	},
	"&.body": {
		cursor: "pointer",
		transition: "background .2s",
		"&:hover": {
			backgroundColor: "#dbdbdb",
		},
	},
	"& > *": {
		padding: "5px 10px",
	},
	"& > *:first-of-type": {
		width: "10%",
	},
	"& > .fill": {
		width: "30%",
		flex: 1,
	},
	"& .right": {
		width: "25%",
		textAlign: "right",
	},
	"&.body:nth-of-type(2n)": {
		backgroundColor: "#eaeaea",
	},
}));

const StyledProduitApprov = styled("div")(() => ({
	flex: 1,
	borderLeft: "2px solid #eaeaea",
	padding: "30px 15px",
}));

const StyledMenu = styled("div")(() => ({
	backgroundColor: "#fff",
	padding: 10,
}));

const Row = ({ produit, devise, onClick, selected }) => {
	return (
		<StyledRow
			in
			className="body"
			onClick={(e) => (selected ? {} : onClick(e, produit))}
		>
			<div>
				<Checkbox
					size="small"
					color="primary"
					checked={selected}
					onChange={(e) => { }}
					inputProps={{
						"aria-label": "select one",
					}}
				/>
				<Typography variant="caption" className="fill">
					{produit.designation}
				</Typography>
				<Typography variant="caption" className="right">
					{produit.quantite.toLocaleString("de-DE")}
				</Typography>
				<Typography variant="caption" className="right">
					{getPrixUnitaire(produit.prix_ht, produit.quantite)}{" "}
					{devise}
				</Typography>
			</div>
		</StyledRow>
	);
};
