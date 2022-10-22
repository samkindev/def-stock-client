import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "@emotion/styled";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
	Typography,
	Button,
	Avatar,
	Box,
	FormControlLabel,
	Checkbox,
	Radio,
	Divider,
	Fade,
	TextField,
	Modal,
	CircularProgress
} from "@mui/material";
import { getAssujetti } from "../../../app/reducers/assujetti";
import { configureAllDepots, creerDepot, selectAll as selectAllDepots, getSaveState, getReqStatus, getDepots } from '../../../app/reducers/depot';
import ConfigurationTabs from "./ConfigTabs";
import { Select } from "../../../Components";
import ConfigurationsView from "../components/ConfigurationsView";

const StyledContainer = styled("div")(() => ({
	width: "100%",
	minHeight: "100vh",
}));

const StyledWrapper = styled("div")(() => ({
	marginLeft: "300px",
	marginTop: 54,
	minHight: "calc(100% - 245px)",
	overflowX: "hidden",
	padding: "20px",
	"& > .actions": {
		marginTop: 15,
		padding: "0 10px",
		display: "flex",
		justifyContent: "flex-end",
		maxWidth: 600,
		"& > *:not(:last-child)": {
			marginRight: 15,
		},
	},
}));

const StyledTreeController = styled(Box)(() => ({
	display: "flex",
	flexDirection: "column",
	"& > label > span:last-child": {
		color: "#000",
	},
	"&:not(:last-child)": {
		marginBottom: 15,
	},
	"&.inline": {
		marginBottom: 0,
		"&:not(:last-child)": {
			marginRight: 15,
		},
	},
	"& .child1": {
		marginLeft: 27,
	},
	"& .child2": {
		marginLeft: 50,
	},
	"& .title": {
		color: "#444",
		fontWeight: "600",
		lineHeight: 1.3,
		marginBottom: "8px!important",
	},
	"& .description": {
		color: "#666",
		lineHeight: 1.3,
		marginBottom: "8px!important",
	},
}));

const tabs = [
	{ id: 1, label: "Organisation des stocks" },
	{ id: 2, label: "Méthode de gestion" },
	{ id: 3, label: "Méthode de valorisation" },
];

const methodesValorisation = [
	{
		id: 0,
		value: 'cump',
		label: "Coût unitaire moyen pondéré (CUMP)",
	},
	{
		id: 1,
		value: 'fifo',
		label: "Premier entré - premier sorti (PEPS ou FIFO)",
	},
];

const variantesFIFO = [
	{
		id: 0,
		label: "FIFO avec contrainte des dates d'expiration",
		value: 'fifo-exp',
		description:
			"Dans ce cas la contrainte des dates d'expiration est prioritaire, et puis vient la contrainte des dates d'entrée.",
	},
	{
		id: 1,
		label: "Premier entré - premier sorti (PEPS ou FIFO) sans contrainte d'expiration",
		value: "fifo",
		description:
			"Les produits sortent du stock selon la méthode du premier entrée - premier sorti sans tenir compte des dates d'expiration.",
	},
];

const variantesCUMP = [
	{
		id: 0,
		label: "CUMP après chaque entrée (Inventaire permanent)",
		value: "cump-ace",
		description: "Dans ce cas, le coût unitaire est calculé après chaque entrée."
	},
	{
		id: 1,
		label: "CUMP calculé sur la durée moyenne de stockage (Inventaire intermittent)",
		value: "cump-dm",
		description: "Le coût unitaire est calculé sur les entrées enregistrée pendant une période bien déterminée."
	},
];

export default function Configuration() {
	const magasins = useSelector(selectAllDepots);
	const [value, setValue] = React.useState(0);
	const [organisation, setOrganisation] = React.useState("desactivée");
	const [subdivisionStock, setSubdivisionStock] = React.useState("aucune");
	const [customeSubdivision, setCustomeSubdivision] = React.useState("non défini");
	const [errors, setErrors] = React.useState({});
	const [confirm, setConfirm] = React.useState(false);
	const [refEmplacement, setRefEmplacement] = React.useState("non défini");
	const [refProduits, setRefProduits] = React.useState("sku");
	const [gestionStockMethod, setGestionStockMethod] = React.useState(
		"méthode du point de commande"
	);
	const [
		openGestionStockMethods,
		setOpenGestionStockMethods,
	] = React.useState(false);
	const [methodeValorisation, setMethodeValorisation] = React.useState(
		methodesValorisation[1]
	);
	const [variantCUMP, setVariantCUMP] = React.useState(variantesCUMP[0]);
	const [contrainteFIFO, setContrainteFIFO] = React.useState(variantesFIFO[0]);
	const dispatch = useDispatch();

	const isActiveOrganisation = (val) => organisation === val;
	const handleSelectOrganisation = (newValue) => {
		if (isActiveOrganisation(newValue)) setOrganisation("");
		else setOrganisation(newValue);
	};

	const isActiveSubdivision = (val) => subdivisionStock === val;
	const handleSubdivision = (val) => {
		setSubdivisionStock(val);
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const isActiveRefEmplacement = (val) => val === refEmplacement;
	const isActiveRefProduits = (val) => val === refProduits;
	const isActiveMethodeGestionStock = (val) => val === gestionStockMethod;
	const isActiveContrainteFIFO = (val) => val === contrainteFIFO.id;
	const isActiveVarianteCUMP = (val) => val === variantCUMP.id;

	const toggleGestionStockMethodes = () => {
		setOpenGestionStockMethods(!openGestionStockMethods);
	};

	const canSave = () => {
		let valid = true;
		if (
			isActiveOrganisation("rangées") &&
			isActiveSubdivision("personnaliser") &&
			customeSubdivision === ""
		) {
			valid = false;
			setErrors((errors) => ({
				...errors,
				subdivisionStock: "Compllétez ce champs.",
			}));
		} else {
			setErrors((errors) => ({ ...errors, subdivisionStock: null }));
		}

		return valid;
	};

	const toggleConfirmation = async () => {
		if (canSave() && !confirm) {
			setConfirm(true);
		} else {
			setConfirm(false);
		}
	};

	const handleSaveChanges = () => {
		let data = {
			organisation: organisation,
			organisation_label: organisation,
			subdivision: subdivisionStock,
			subdivision_label:
				customeSubdivision !== ""
					? customeSubdivision
					: subdivisionStock,
			reference_emplacement: refEmplacement,
			referenceProduits: refProduits,
			reaprovisionnement: gestionStockMethod,
			valorisation: methodeValorisation.value === "fifo" ? contrainteFIFO.value : variantCUMP.value,
		};

		if (!canSave) {
			return;
		}

		if (magasins.length === 0) {
			data = {
				nom: 'Magasin Principal',
				code: 'M001',
				description: "Magasin principal de l'entreprise",
				...data
			}

			dispatch(creerDepot(data)).then(() => {
				toggleConfirmation();
			});
		} else {
			dispatch(configureAllDepots(data)).then(() => {
				toggleConfirmation();
			});
		}
	};

	const handleSelectMethodeValorisation = (selected) => {
		setMethodeValorisation(selected);
	};

	useEffect(() => {
		if (magasins.length === 0) {
			dispatch(getDepots());
		}
	}, []);
	return (
		<StyledContainer>
			{confirm &&
				<ConfigurationsView
					open={confirm}
					onClose={toggleConfirmation}
					configurations={{
						organisation: organisation,
						organisation_label: organisation,
						subdivision: subdivisionStock,
						subdivision_label:
							customeSubdivision !== ""
								? customeSubdivision
								: subdivisionStock,
						referenceRangees: refEmplacement,
						referenceProduits: refProduits,
						reaprovisionnement: gestionStockMethod,
						valorisation: methodeValorisation.value === "fifo" ? contrainteFIFO.label : variantCUMP.label,
					}}
					handleConfirmation={handleSaveChanges}
				/>
			}
			<ConfigLeftAside magasins={magasins} />
			<StyledWrapper>
				<ConfigurationTabs
					tabs={tabs}
					value={value}
					handleChange={handleChange}
				>
					<>
						<TabPanel index={0} value={value}>
							<Box pt={1}>
								<Box
									component="fieldset"
									border="1px solid #eaeaea"
									borderRadius={1}
									p={1}
								>
									<StyledTreeController>
										<Typography
											variant="caption"
											className="small title"
										>
											Organisation par rangées
										</Typography>
										<Typography
											variant="caption"
											className="small description"
										>
											Lorsque vous choisissez d'organiser
											les stocks par rangées, ce logiciel
											vous permettra de retrouver les
											stocks des produits facilement et
											rapidement en utilisant la référence
											de la rangée où se trouve le
											produit.
										</Typography>
										<FormControlLabel
											className="child1"
											sx={{
												mb: 1,
												width: "fit-content",
												"& > span:first-of-type": {
													marginRight: 0.5,
												},
											}}
											label={
												isActiveOrganisation("rangées")
													? "Desactiver"
													: "Activer"
											}
											componentsProps={{
												typography: {
													variant: "caption",
													className: "small",
												},
											}}
											control={
												<Checkbox
													size="small"
													onChange={() =>
														handleSelectOrganisation(
															"rangées"
														)
													}
													checked={isActiveOrganisation(
														"rangées"
													)}
												/>
											}
										/>
									</StyledTreeController>
									<Box ml={23 / 8}>
										<Divider sx={{ mb: 1.5 }} />
										<Typography
											variant="h2"
											className="small"
										>
											Comment voulez-vous organiser (ou
											subdiviser) les rangées dans le stock ?
										</Typography>
										<Box display="flex" alignItems="center">
											<StyledTreeController className="inline">
												<FormControlLabel
													onChange={() =>
														handleSubdivision(
															"aucune"
														)
													}
													disabled={
														!isActiveOrganisation(
															"rangées"
														)
													}
													label="Aucune"
													componentsProps={{
														typography: {
															variant: "caption",
															className: "small",
														},
													}}
													checked={isActiveSubdivision(
														"aucune"
													)}
													control={
														<Radio
															color="default"
															size="small"
														/>
													}
													sx={{
														width: "fit-content",
														"& > span:first-of-type": {
															marginRight: 0.5,
														},
													}}
												/>
											</StyledTreeController>
											<StyledTreeController className="inline">
												<FormControlLabel
													onChange={() =>
														handleSubdivision(
															"block"
														)
													}
													disabled={
														!isActiveOrganisation(
															"rangées"
														)
													}
													label="En blocks"
													componentsProps={{
														typography: {
															variant: "caption",
															className: "small",
														},
													}}
													checked={isActiveSubdivision(
														"block"
													)}
													control={
														<Radio
															color="default"
															size="small"
														/>
													}
													sx={{
														width: "fit-content",
														"& > span:first-of-type": {
															marginRight: 0.5,
														},
													}}
												/>
											</StyledTreeController>
											<StyledTreeController className="inline">
												<FormControlLabel
													onChange={() =>
														handleSubdivision(
															"niveau"
														)
													}
													checked={isActiveSubdivision(
														"niveau"
													)}
													disabled={
														!isActiveOrganisation(
															"rangées"
														)
													}
													label="En niveaux"
													componentsProps={{
														typography: {
															variant: "caption",
															className: "small",
														},
													}}
													control={
														<Radio
															color="default"
															size="small"
														/>
													}
													sx={{
														width: "fit-content",
														"& > span:first-of-type": {
															marginRight: 0.5,
														},
													}}
												/>
											</StyledTreeController>
											<StyledTreeController className="inline">
												<FormControlLabel
													onChange={() =>
														handleSubdivision(
															"personnaliser"
														)
													}
													checked={isActiveSubdivision(
														"personnaliser"
													)}
													disabled={
														!isActiveOrganisation(
															"rangées"
														)
													}
													label="Personnaliser"
													componentsProps={{
														typography: {
															variant: "caption",
															className: "small",
														},
													}}
													control={
														<Radio
															color="default"
															size="small"
														/>
													}
													sx={{
														width: "fit-content",
														"& > span:first-of-type": {
															marginRight: 0.5,
														},
													}}
												/>
											</StyledTreeController>
										</Box>
										{isActiveOrganisation("rangées") &&
											isActiveSubdivision(
												"personnaliser"
											) && (
												<Fade
													in={
														isActiveOrganisation(
															"rangées"
														) &&
														isActiveSubdivision(
															"personnaliser"
														)
													}
												>
													<Box mt={2.5}>
														<Typography
															variant="h2"
															className="small title"
														>
															Personnaliser
															l'emplacement dans
															les rangées
														</Typography>
														<TextField
															id="Subdivision des rangées"
															name="subdivision"
															placeholder="Nom de la subdivision des rangées"
															variant="outlined"
															fullWidth
															value={
																customeSubdivision
															}
															onChange={(e) =>
																setCustomeSubdivision(
																	e.target
																		.value
																)
															}
															error={
																errors.subdivisionStock
																	? true
																	: false
															}
															helperText={
																errors.subdivisionStock
															}
															sx={{
																backgroundColor:
																	"#f6f8fa80",
															}}
														/>
													</Box>
												</Fade>
											)}
									</Box>
								</Box>
								<Box
									component="fieldset"
									border="1px solid #eaeaea"
									borderRadius={1}
									p={1}
									mt={2}
								>
									<StyledTreeController>
										<Typography
											variant="caption"
											className="small title"
										>
											Référencement des stocks
										</Typography>
										<Typography
											variant="caption"
											className="small description"
										>
											Définissez comment vous voulez
											référencer vos rangées et produits
											dans vos stocks pour facilité la
											recherche.
										</Typography>
									</StyledTreeController>
									<StyledTreeController>
										<Typography
											variant="caption"
											className="small"
										>
											1. Rangées et autres emplacements
										</Typography>
										<FormControlLabel
											className="child2"
											onChange={() =>
												setRefEmplacement(
													"personnalisé"
												)
											}
											disabled={
												!isActiveOrganisation("rangées")
											}
											label="Référencer par codes personnalisés"
											componentsProps={{
												typography: {
													variant: "caption",
													className: "small",
												},
											}}
											checked={isActiveRefEmplacement(
												"personnalisé"
											)}
											control={
												<Radio
													color="default"
													size="small"
												/>
											}
											sx={{
												mb: 1,
												mt: 1,
												width: "fit-content",
												"& > span:first-of-type": {
													marginRight: 0.5,
												},
											}}
										/>
										<FormControlLabel
											className="child2"
											onChange={() =>
												setRefEmplacement("automatique")
											}
											disabled={
												!isActiveOrganisation("rangées")
											}
											label="Référencer par codes générés automatiquement"
											componentsProps={{
												typography: {
													variant: "caption",
													className: "small",
												},
											}}
											checked={isActiveRefEmplacement(
												"automatique"
											)}
											control={
												<Radio
													color="default"
													size="small"
												/>
											}
										/>
									</StyledTreeController>
									<StyledTreeController>
										<Typography
											variant="caption"
											className="small"
										>
											2. Produits/articles
										</Typography>
										{/* <FormControlLabel
											className="child2"
											onChange={() =>
												setRefProduits("simple")
											}
											label="Référencer par codes simples"
											componentsProps={{
												typography: {
													variant: "caption",
													className: "small",
												},
											}}
											checked={isActiveRefProduits(
												"simple"
											)}
											control={
												<Radio
													color="default"
													size="small"
												/>
											}
											sx={{
												mb: 1,
												mt: 1,
												width: "fit-content",
												"& > span:first-of-type": {
													marginRight: 0.5,
												},
											}}
										/> */}
										<FormControlLabel
											className="child2"
											onChange={() =>
												setRefProduits("sku")
											}
											label="Référencer par codes SKU (codes-barres internes)"
											componentsProps={{
												typography: {
													variant: "caption",
													className: "small",
												},
											}}
											checked={isActiveRefProduits("sku")}
											control={
												<Checkbox
													color="default"
													size="small"
												/>
											}
											sx={{
												mb: 1,
												width: "fit-content",
												"& > span:first-of-type": {
													marginRight: 0.5,
												},
											}}
										/>
										<FormControlLabel
											className="child2"
											onChange={() =>
												setRefProduits("upc")
											}
											label="Référencer par codes-barres universels (UPC)"
											componentsProps={{
												typography: {
													variant: "caption",
													className: "small",
												},
											}}
											checked={isActiveRefProduits("upc")}
											control={
												<Checkbox
													color="default"
													size="small"
												/>
											}
											sx={{
												width: "fit-content",
												"& > span:first-of-type": {
													marginRight: 0.5,
												},
											}}
										/>
									</StyledTreeController>
								</Box>
							</Box>
						</TabPanel>
						<TabPanel index={1} value={value}>
							<StyledTreeController>
								<Typography
									variant="h2"
									className="small title"
								>
									La méthode de réapprovisionnement des stocks
								</Typography>
								<Typography
									variant="caption"
									className="small description"
								>
									Vous recevrez les notifications de
									réapprovisionnement de stock selon la
									méthode que vous choisissez.
								</Typography>
								<FormControlLabel
									onChange={() => {
										setGestionStockMethod("par produit");
										toggleGestionStockMethodes();
									}}
									label="Chaque produit a sa méthode de réapprovisionnement"
									componentsProps={{
										typography: {
											variant: "caption",
											className: "small",
										},
									}}
									checked={isActiveMethodeGestionStock(
										"par produit"
									)}
									control={
										<Radio color="default" size="small" />
									}
									sx={{
										mb: 1,
										mt: 1,
										width: "fit-content",
										"& > span:first-of-type": {
											marginRight: 0.5,
										},
									}}
								/>
								<Typography
									variant="caption"
									className="small description child1"
								>
									La méthode d'approvisionnement sera choisie
									et ajoutée à chaque produit lors de sa
									création.
								</Typography>
								<Box
									display="flex"
									alignItems="center"
									onClick={toggleGestionStockMethodes}
								>
									<Typography
										variant="caption"
										className="small"
										sx={{ mb: 1, mt: 1, cursor: "pointer" }}
									>
										Une méthode pour tous les produits
									</Typography>
									<Divider
										sx={{
											flex: 1,
											ml: 1,
											cursor: "pointer",
										}}
									/>
									{!openGestionStockMethods ? (
										<KeyboardArrowDownIcon
											sx={{
												border: "1px solid #eaeaea",
												ml: 1,
												borderRadius: "50%",
												cursor: "pointer",
											}}
											fontSize="medium"
											color="default"
											onClick={toggleGestionStockMethodes}
										/>
									) : (
										<KeyboardArrowUpIcon
											sx={{
												border: "1px solid #eaeaea",
												ml: 1,
												borderRadius: "50%",
												cursor: "pointer",
											}}
											fontSize="medium"
											color="default"
											onClick={toggleGestionStockMethodes}
										/>
									)}
								</Box>
							</StyledTreeController>
							{openGestionStockMethods && (
								<Fade in={openGestionStockMethods}>
									<div>
										<StyledTreeController>
											<FormControlLabel
												className="child1"
												onChange={() =>
													setGestionStockMethod(
														"Réapprovisionnement calendaire"
													)
												}
												label="Réapprovisionnement par la méthode calendaire"
												componentsProps={{
													typography: {
														variant: "caption",
														className: "small",
													},
												}}
												checked={isActiveMethodeGestionStock(
													"Réapprovisionnement calendaire"
												)}
												control={
													<Radio
														color="default"
														size="small"
													/>
												}
												sx={{
													mb: 0.5,
													"& > span:first-of-type": {
														marginRight: 0.5,
													},
												}}
											/>
											<Typography
												variant="caption"
												className="small description child2"
											>
												Avec cette méthode, une
												notification vous sera envoyée à
												une date fixe pour
												approvisionner un produit donné
												pour une quantité fixe.
											</Typography>
										</StyledTreeController>
										<StyledTreeController>
											<FormControlLabel
												className="child1"
												onChange={() =>
													setGestionStockMethod(
														"méthode de recomplètement"
													)
												}
												label="Réapprovisionnement par la méthode de recomplètement"
												componentsProps={{
													typography: {
														variant: "caption",
														className: "small",
													},
												}}
												checked={isActiveMethodeGestionStock(
													"méthode de recomplètement"
												)}
												control={
													<Radio
														color="default"
														size="small"
													/>
												}
												sx={{
													mb: 0.6,
													"& > span:first-of-type": {
														marginRight: 0.5,
													},
												}}
											/>
											<Typography
												variant="caption"
												className="small description child2"
											>
												Avec cette méthode, vous
												commandez autant que nécessaire
												pour revenir au niveau de stock
												maximum défini au préalable.
											</Typography>
										</StyledTreeController>
										<StyledTreeController>
											<FormControlLabel
												className="child1"
												onChange={() =>
													setGestionStockMethod(
														"méthode du point de commande"
													)
												}
												label="Réapprovisionnement par la méthode du point de commande (juste-à-temps)"
												componentsProps={{
													typography: {
														variant: "caption",
														className: "small",
													},
												}}
												checked={isActiveMethodeGestionStock(
													"méthode du point de commande"
												)}
												control={
													<Radio
														color="default"
														size="small"
													/>
												}
												sx={{
													mb: 0.6,
													"& > span:first-of-type": {
														marginRight: 0.5,
													},
												}}
											/>
											<Typography
												variant="caption"
												className="small description child2"
											>
												Avec cette méthode, vous
												recevrez une notification
												lorsque le stock critique (stock minimal) d'un
												des produits est atteint.
											</Typography>
										</StyledTreeController>
										<StyledTreeController>
											<FormControlLabel
												className="child1"
												onChange={() =>
													setGestionStockMethod(
														"méthode de réapprovisionnement à la commande"
													)
												}
												label="Réapprovisionnement à la commande"
												componentsProps={{
													typography: {
														variant: "caption",
														className: "small",
													},
												}}
												checked={isActiveMethodeGestionStock(
													"méthode de réapprovisionnement à la commande"
												)}
												control={
													<Radio
														color="default"
														size="small"
													/>
												}
												sx={{
													mb: 0.6,
													"& > span:first-of-type": {
														marginRight: 0.5,
													},
												}}
											/>
											<Typography
												variant="caption"
												className="small description child2"
											>
												Avec cette méthode, vous allez
												commander des quantités
												variables à des dates variables.
											</Typography>
										</StyledTreeController>
									</div>
								</Fade>
							)}
						</TabPanel>
						<TabPanel index={2} value={value}>
							<StyledTreeController>
								<Typography variant="h2">
									Méthode de valorisation des stocks
								</Typography>
								<Typography
									variant="caption"
									className="small description child1"
								>
									Pour la valorisation des sorties de stock,
									séléctionnez une méthode. Lors des sorties
									le coût unitaire sera calculé en fonction de
									cette méthode.
								</Typography>
								<div className="child1">
									<Select
										options={methodesValorisation}
										value={methodeValorisation}
										onChange={
											handleSelectMethodeValorisation
										}
									/>
								</div>
							</StyledTreeController>
							<StyledTreeController>
								{methodeValorisation.id === 0 && (
									<Fade in={methodeValorisation.id === 0}>
										<Box>
											{variantesCUMP.map((variante) => (
												<FormControlLabel
													className="child1"
													key={variante.id}
													onChange={() => {
														setVariantCUMP(
															variante
														);
													}}
													label={variante.label}
													componentsProps={{
														typography: {
															variant: "caption",
															className: "small",
														},
													}}
													checked={isActiveVarianteCUMP(
														variante.id
													)}
													control={
														<Radio
															color="default"
															size="small"
														/>
													}
													sx={{
														mb: 0.6,
														"& > span:first-of-type": {
															marginRight: 1,
														},
													}}
												/>
											))}
										</Box>
									</Fade>
								)}
								{methodeValorisation.id === 1 && (
									<Fade in={methodeValorisation.id === 1}>
										<Box>
											{variantesFIFO.map((variante) => (
												<FormControlLabel
													className="child1"
													key={variante.id}
													onChange={() => {
														setContrainteFIFO(
															variante
														);
													}}
													label={variante.label}
													componentsProps={{
														typography: {
															variant: "caption",
															className: "small",
														},
													}}
													checked={isActiveContrainteFIFO(
														variante.id
													)}
													control={
														<Radio
															color="default"
															size="small"
														/>
													}
													sx={{
														mb: 0.6,
														"& > span:first-of-type": {
															marginRight: 1,
														},
													}}
												/>
											))}
										</Box>
									</Fade>
								)}
							</StyledTreeController>
						</TabPanel>
					</>
				</ConfigurationTabs>
				<div className="actions">
					<Button
						variant="contained"
						color="primary"
						disableElevation
						size="small"
						onClick={toggleConfirmation}
					>
						Enregistrer les modifications
					</Button>
					<Button
						variant="outlined"
						color="default"
						disableElevation
					>
						Configurations par défaut
					</Button>
					<Button variant="outlined" color="default" size="small">
						Annuler
					</Button>
				</div>
			</StyledWrapper>
		</StyledContainer>
	);
}

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <>{children}</>}
		</div>
	);
}

const StyledStockItem = styled('li')(() => ({
	width: '100%',
	padding: '10px 10px',
	cursor: 'pointer',
	borderRadius: 7,
	"&:hover, &.active": {
		backgroundColor: 'InactiveBorder'
	},
	"&:not(:last-child)": {
		marginBottom: 5
	},
}));

const StyledNouveauStockContainer = styled("div")(() => ({
	width: '100%',
	height: '100vh',
	display: 'flex',
	justifyContent: 'center',
	paddingTop: 30,
	"& > form": {
		backgroundColor: "#fff",
		width: "100%",
		overflowY: "auto",
		maxWidth: 500,
		height: 'fit-content',
		border: '1px solid #9a9a9a',
		boxShadow: '0px 0px 16px 11px #cfcdcd',
		// borderLeft: "1px solid #cccccc",
		// boxShadow: "-5px 0px 20px 6px #52525229",
		padding: 0,
		borderRadius: 5,
		overflow: 'hidden'
	},
	"& .form-body": {
		padding: 15
	},
	"& .form-group": {
		marginBottom: 15
	},
	"& .form-actions": {
		padding: "10px 0",
		display: 'flex',
		justifyContent: 'flex-end',
		"& > button": {
			marginLeft: 10
		}
	},
	"& form > header": {
		position: 'static',
	}
}));

const ConfigLeftAside = () => {
	const assujetti = useSelector(getAssujetti);
	const [activeStock, setActiveStock] = React.useState(0);
	const [allStocks, setAllStocks] = React.useState(true);
	const [openForm, setOpenForm] = React.useState(false);
	const [code, setCode] = React.useState('');
	const [nom, setNom] = React.useState('');
	const [description, setDescription] = React.useState('');
	const [errors, setErrors] = React.useState({});
	const magasins = useSelector(selectAllDepots);
	const loadingMagasins = useSelector(getReqStatus) === 'loading';
	const [stockPrinicipal, setStockPrincipal] = useState(magasins.length === 0);

	const toggleOpenModal = () => {
		setOpenForm(!openForm);
		setErrors({});
		setNom("");
		setCode("");
		setDescription("");
	}

	const handleSelectStock = (val) => {
		setActiveStock(val);
	}
	const saveState = useSelector(getSaveState);
	const canSave = () => {
		let valid = true;

		if (code === "" || !code) {
			valid = false;
			setErrors(errors => (
				{ ...errors, code: "Veuillez renseigner le code du stock." }
			));
		}

		if (nom === "" || !nom) {
			valid = false;
			setErrors(errors => (
				{ ...errors, nom: "Veuillez renseigner le nom du stock." }
			));
		}

		return valid;
	}
	const dispatch = useDispatch();
	const handleSaveStock = () => {
		if (canSave() && !saveState) {
			const data = {
				nom_stock: nom,
				code_stock: code,
				description_stock: description
			}

			dispatch(creerDepot(data))
				.then(res => {
					if (res.payload.status === 'success') {
						toggleOpenModal();
					}
				});

		}
	}

	return (
		<aside className="left-aside">
			<div className="aside-header">
				<Avatar
					variant="rounded"
					style={{ width: 40, height: 40 }}
				></Avatar>
				<Typography
					variant="h2"
					sx={{ mt: 1, textTransform: "lowercase" }}
				>
					{assujetti.raison_sociale}
				</Typography>
			</div>
			<div className="aside-body">
				<Typography variant="h2" sx={{ fontWeight: "bold" }}>
					Configuration de la gestion des stocks
				</Typography>
				<FormControlLabel
					sx={{
						width: "fit-content",
						"& > span:first-of-type": {
							marginRight: 0.5,
						},
					}}
					label="Tous les stocks"
					componentsProps={{
						typography: {
							variant: "caption",
							className: "small",
						},
					}}
					control={
						<Checkbox
							size="small"
							onChange={() => setAllStocks(!allStocks)}
							checked={allStocks}
						/>
					}
				/>
				<Box mt={2.5}>
					<Divider sx={{ mt: 1, mb: 1 }} />
					<Typography
						variant="caption"
						className="small description child1"
					>Liste des stocks/Magasins</Typography>
					<Box component="ul">
						<Box my={2}>
							{loadingMagasins ?
								<Box width="100%" height="100%" display="flex" alignItems="center">
									<CircularProgress size={15} />
								</Box> :
								magasins.length > 0 ?
									magasins.map(magasin => (
										<StyledStockItem key={magasin.id} className={activeStock === 0 ? "active" : ""} onClick={() => handleSelectStock(0)}>
											<Typography variant="caption">
												{magasin.nom_magasin}
											</Typography>
										</StyledStockItem>
									)) :
									<Typography variant="caption" className="small">Aucun magasin/stock</Typography>
							}
						</Box>
					</Box>
					<Button
						variant="contained"
						color="primary"
						disableElevation
						onClick={toggleOpenModal}
					>
						Ajouter un stock
					</Button>
					{openForm &&
						<Modal
							open={openForm}
							onClose={toggleOpenModal}
							BackdropProps={{
								style: {
									backgroundColor: "#00000020",
								}
							}}
						>
							<StyledNouveauStockContainer>
								<form className="modal-form">
									<header>
										<Typography variant="h1">Nouveau magasin/stock</Typography>
									</header>
									<div className="form-body">
										<Box className="form-group">
											<TextField
												id="code"
												name="code_stock"
												label="Code du stock/magasin *"
												variant="outlined"
												fullWidth
												value={code}
												onChange={e => setCode(e.target.value)}
												error={errors.code ? true : false}
												helperText={errors.code}
											/>
											<Button
												variant="outlined"
												color="default"
												disableElevation
											>
												Générer automatiquement le code
											</Button>
										</Box>
										<Box className="form-group">
											<TextField
												id="nom"
												name="nom_stock"
												label="Nom du stock/magasin *"
												variant="outlined"
												fullWidth
												value={nom}
												onChange={e => setNom(e.target.value)}
												error={errors.nom ? true : false}
												helperText={errors.nom}
											/>
										</Box>
										<Box className="form-group">
											<Typography
												variant="h2"
												className="block-title"
											>
												Déscripton
											</Typography>
											<TextField
												id="detail"
												name="description_stock"
												placeholder="Déscription du stock/magasin"
												variant="outlined"
												fullWidth
												multiline
												rows={3}
												maxRows={5}
												value={description}
												onChange={e => setDescription(e.target.value)}
											/>
										</Box>
										<Box className="form-group">
											<Typography
												variant="caption"
												className="small"
											>Cocher pour créer ce magasin/stock comme magasin/stock principal.</Typography>
											<FormControlLabel
												className="child1"
												onChange={() => {
													setStockPrincipal(
														!stockPrinicipal
													);
												}}
												label="Stock principal"
												componentsProps={{
													typography: {
														variant: "caption",
														className: "small",
													},
												}}
												checked={stockPrinicipal}
												control={
													<Checkbox
														size="small"
													/>
												}
												sx={{
													"& > span:first-of-type": {
														marginRight: 1,
													},
												}}
											/>
										</Box>
										<Box className="form-actions">
											<Button
												variant="contained"
												color="primary"
												disableElevation
												size="medium"
												onClick={handleSaveStock} sx={{
													minWidth: 105.19,
													height: 36.5,
												}}
											>
												{saveState ? (
													<CircularProgress size={12} color="inherit" />
												) : (
													"Enregistrer"
												)}
											</Button>
											<Button
												variant="outlined"
												disableElevation
												color="default"
												onClick={toggleOpenModal}
											>
												Annuler
											</Button>
										</Box>
									</div>
								</form>
							</StyledNouveauStockContainer>
						</Modal>
					}
				</Box>
			</div>
		</aside>
	);
};
