import React, { useState, useRef, useEffect, useContext } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	CircularProgress,
	Modal,
	Divider,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
import {
	actions,
	creerProduit,
	getErrors,
} from "../../../app/reducers/stockProduit";
import { ComboBox } from "../../../Components";
import { validerNouveauProduit } from "../utilities/validators/produit";
import CategorieForm from "./CategorieForm";
import { LargeDialog } from "../../../Components";
import {
	getCategories,
	getCategoriesProduit,
} from "../../../app/reducers/stockProduit";
import { styled } from "@mui/styles";
import { FeedbackContext, SocketContext } from "../../../App";
import { sendMessage } from '../../../sockets';

function AutresTaxes({ taxes = [], handleDelete }) {
	return (
		<Stack direction="row" spacing={1} sx={{ mb: 2 }}>
			{taxes.map((taxe) => (
				<Chip
					key={taxe.label}
					label={`${taxe.label} : ${taxe.pourcentage}%`}
					variant="outlined"
					color="primary"
					onDelete={() => handleDelete(taxe.label)}
				/>
			))}
		</Stack>
	);
}

export default function FormProduitModal({ open, onClose }) {
	// Création des états et variables
	const { createFeedback } = useContext(FeedbackContext);
	const socket = useContext(SocketContext);
	const [designation, setDesignation] = useState("");
	const [unite, setUnite] = useState("");
	const [marge, setMarge] = useState(0);
	const [qMin, setQMin] = useState(0);
	const [code, setCode] = useState("");
	const [description, setDescription] = useState("");
	const [emballage, setEmballage] = useState("");
	const [categorie, setCategorie] = useState(null);
	const [numCompte, setNumCompte] = useState("31");
	const [taxeNom, setTaxeNom] = useState("");
	const [taxeValue, setTaxeValue] = useState("");
	const [taxes, setTaxes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [addCategory, setAddCategory] = useState(false);
	const serverError = useSelector(getErrors);

	// recuperation des categorie des produit (redux store)
	const categories = useSelector(getCategories);

	const designRef = useRef();

	const toggleAddCategory = () => {
		setAddCategory(!addCategory);
	};

	const handleCancel = () => {
		initAll();
		onClose();
	};

	const handleInputChange = (value, label) => {
		switch (label) {
			case "designation":
				setDesignation(value);
				setErrors({ ...errors, designation: null });
				break;
			case "code":
				setCode(value);
				setErrors({ ...errors, code: null });
				break;
			case "qMin":
				setQMin(value);
				if (qMin !== null || qMin !== "") {
					setErrors({ ...errors, qMin: null });
				}
				break;
			case "unite":
				setUnite(value);
				setErrors({ ...errors, unite: null });
				break;
			case "marge":
				setMarge(value);
				setErrors({ ...errors, marge: null });
				break;
			case "emballage":
				setMarge(value);
				setErrors({ ...errors, marge: null });
				break;
			case "taxeNom":
				setTaxeNom(value);
				setErrors({ ...errors, taxeNom: null });
				break;
			case "taxeValue":
				setTaxeValue(value);
				setErrors({ ...errors, taxeValue: null });
				break;
			case "numCompte":
				setNumCompte(value);
				setErrors({ ...errors, numCompte: null });
				break;
			case "categorie":
				setCategorie(value);
				setErrors({ ...errors, categorie: null });
				break;
			default:
				return;
		}
	};

	const appendTaxe = () => {
		let valid = true;
		let errs = { ...errors };
		if (taxeNom === "") {
			valid = false;
			errs["taxeNom"] = "Valeure réquise.";
		}
		if (taxeValue === "") {
			valid = false;
			errs["taxeValue"] = "Valeure réquise.";
		}

		if (taxes.some((t) => t.label === taxeNom)) {
			valid = false;
		}

		if (!valid) {
			setErrors(errs);
			return;
		}

		setTaxes([...taxes, { label: taxeNom, pourcentage: taxeValue }]);

		setTaxeNom("");
		setTaxeValue("");
	};

	const handleRemoveTaxe = (label) => {
		const t = taxes.filter((t) => t.label !== label);

		setTaxes(t);
	};

	// Fonction d'initialisation des champs du formulaire
	const initAll = () => {
		setDesignation("");
		setUnite("");
		setQMin("");
		setMarge(0);
		setCode("");
		setDescription("");
		setCategorie(null);
		setTaxes([]);
		setTaxeNom("");
		setTaxeValue("");
		setNumCompte("31");
		setEmballage("");

		if (designRef.current) {
			designRef.current.focus();
		}
	};

	const handleCompteChange = (e) => {
		const val = e.target.value;
		if (val === "" || val[0] !== "3") {
			setErrors({
				...errors,
				numCompte: "Mauvais numéro de compte",
			});
		} else {
			setErrors({
				...errors,
				numCompte: null,
			});
		}
		setNumCompte(val);
	};

	const dispatch = useDispatch();
	const handleSubmit = (e) => {
		e.preventDefault();

		if (loading) {
			return;
		}

		const { valid: valid1, errors: errors1 } = validerNouveauProduit(
			designation,
			unite,
			marge,
			qMin,
			code,
			numCompte
		);

		if (!valid1) {
			setErrors(errors1);
			return;
		}

		setLoading(true);
		const prod = {
			designation,
			code_produit: code,
			description,
			emballage,
			unite,
			marge,
			taxes,
			quantite: 0,
			q_min: qMin,
			categorieId: categorie ? categorie.id : null,
		};

		dispatch(
			creerProduit({
				data: prod,
			})
		)
			.then((res) => {
				const data = res.payload;
				if (data && data.state === "success") {
					initAll();
					createFeedback(
						"Un produit ajouté avec succès !",
						"création-produit",
						"success"
					);
					// Send the new_produit event with produit id as message
					sendMessage(socket, 'new_produit', { produitId: data.produit.id });
				}
			})
			.finally(() => setLoading(false));
	};

	const handleClearServerErrors = () => {
		setErrors({ ...errors, server: null });
		dispatch(actions.initError());
	};

	useEffect(() => {
		setErrors({ ...errors, server: serverError });
	}, [serverError]);

	useEffect(() => {
		dispatch(getCategoriesProduit());
	}, [dispatch]);

	return (
		<Modal
			open={open}
			onClose={onClose}
			BackdropProps={{
				style: {
					justifyContent: "flex-end",
					backgroundColor: "#00000005",
				},
			}}
		>
			<StyledNouveauProduitContainer>
				{addCategory && (
					<CategorieForm
						onClose={toggleAddCategory}
						open={addCategory}
					/>
				)}
				<form className="modal-form" onSubmit={handleSubmit}>
					{errors.server && (
						<LargeDialog
							title="Erreur"
							open={serverError ? true : false}
							message={errors.server}
							onAgree={handleClearServerErrors}
							onClose={handleClearServerErrors}
							agreeBtnText="Ok"
						/>
					)}
					<header>
						<Typography variant="h1">
							Ajout des nouveaux produits/Articles
						</Typography>
						<Button
							variant="outlined"
							color="default"
							size="small"
							disableElevation
							onClick={handleCancel}
						>
							Annuler
						</Button>
					</header>
					<div>
						<div className="form-block">
							<Typography variant="h2" className="block-title">
								1. Détails
							</Typography>
							<div>
								<TextField
									inputRef={designRef}
									label="Désignation du produit *"
									id="designation"
									name="designation"
									placeholder="Désignation du produit"
									variant="outlined"
									fullWidth
									type="text"
									value={designation}
									onChange={(e) =>
										handleInputChange(
											e.target.value,
											"designation"
										)
									}
									error={errors.designation ? true : false}
									helperText={errors.designation}
									sx={{
										backgroundColor: '#f6f8fa80'
									}}
								/>
								<div className="horizontal-align">
									<TextField
										label="Code Produit *"
										id="code"
										name="code"
										placeholder="Code du produit"
										variant="outlined"
										fullWidth
										type="text"
										value={code}
										onChange={(e) =>
											handleInputChange(
												e.target.value,
												"code"
											)
										}
										error={errors.code ? true : false}
										helperText={errors.code}
										sx={{
											backgroundColor: '#f6f8fa80'
										}}
									/>
									<TextField
										label="Quantité minimale *"
										id="q_min"
										name="q_min"
										placeholder="Quantité minimale"
										variant="outlined"
										fullWidth
										type="number"
										value={qMin}
										onChange={(e) =>
											handleInputChange(
												e.target.value,
												"qMin"
											)
										}
										error={errors.qMin ? true : false}
										helperText={errors.qMin}
										sx={{
											backgroundColor: '#f6f8fa80'
										}}
									/>
								</div>
								<div className="horizontal-align">
									<TextField
										label="Unité de mésure du produit *"
										id="unite"
										name="unite"
										placeholder="Unité de mésure du produit"
										variant="outlined"
										type="text"
										fullWidth
										value={unite}
										onChange={(e) =>
											handleInputChange(
												e.target.value,
												"unite"
											)
										}
										error={errors.unite ? true : false}
										helperText={errors.unite}
										sx={{
											backgroundColor: '#f6f8fa80'
										}}
									/>
									<TextField
										label="Marge de bénéfice sur une unité (%) *"
										id="marge"
										name="marge"
										placeholder="Marge de bénéfice sur une unité"
										variant="outlined"
										fullWidth
										type="number"
										value={marge}
										onChange={(e) =>
											handleInputChange(
												e.target.value,
												"marge"
											)
										}
										error={errors.marge ? true : false}
										helperText={errors.marge}
										sx={{
											backgroundColor: '#f6f8fa80'
										}}
									/>
								</div>
								<TextField
									label="L'emballage du produit (Conteneur)"
									id="emballage"
									name="emballage"
									placeholder="L'emballage du produit"
									variant="outlined"
									fullWidth
									type="text"
									value={emballage}
									onChange={(e) =>
										handleInputChange(
											e.target.value,
											"emballage"
										)
									}
									sx={{
										backgroundColor: '#f6f8fa80'
									}}
								/>
								<Box mt={2}>
									<Typography
										variant="h2"
										className="block-title"
									>
										Déscripton
									</Typography>
									<TextField
										id="description"
										name="description"
										placeholder="Une petite description du produit"
										variant="outlined"
										fullWidth
										multiline
										value={description}
										onChange={(e) =>
											handleInputChange(
												e.target.value,
												"description"
											)
										}
										rows={4}
										error={
											errors.description ? true : false
										}
										helperText={errors.description}
										sx={{
											backgroundColor: '#f6f8fa80'
										}}
									/>
								</Box>
							</div>
						</div>
						<Divider />

						<div className="form-block">
							<Typography variant="h2" className="block-title">
								2. Catégorie du produit (gamme)
							</Typography>
							<div>
								<ComboBox
									label="Catégorie *"
									id="Catégorie"
									name="Catégorie"
									placeholder="Catégorie"
									variant="outlined"
									type="text"
									fullWidth
									options={
										categories.map((cat) => ({
											label: cat.nom_categorie,
											...cat,
										})) || []
									}
									value={categorie}
									setValue={(value) => setCategorie(value)}
									sx={{
										display: "block",
										backgroundColor: '#f6f8fa80'
									}}
								/>
								<Button
									variant="outlined"
									color="primary"
									size="medium"
									onClick={toggleAddCategory}
								>
									Nouvelle catégorie
								</Button>
							</div>
						</div>
						<Divider />

						<div className="form-block">
							<Typography variant="h2" className="block-title">
								3. Autres données
							</Typography>
							<div>
								<TextField
									label="Numéro de compte stock *"
									placeholder="Numéro de compte stock"
									name="compte"
									id="compte"
									inputProps={{ maxLength: 8 }}
									variant="outlined"
									value={numCompte}
									onChange={handleCompteChange}
									error={errors.numCompte ? true : false}
									helperText={errors.numCompte}
									sx={{
										backgroundColor: '#f6f8fa80'
									}}
								/>
								<div style={{ marginTop: 10 }}>
									<Typography
										variant="h2"
										className="block-title"
									>
										Autres taxes liées
									</Typography>
									{taxes.length > 0 && (
										<AutresTaxes
											taxes={taxes}
											handleDelete={handleRemoveTaxe}
										/>
									)}
									<Box display="flex" alignItems="flex-start">
										<TextField
											label="Nom de la taxe"
											id="nom_taxe"
											name="nom_taxe"
											placeholder="Taxe"
											variant="outlined"
											type="text"
											sx={{
												display: "block",
												mr: 1,
												my: 0,
												backgroundColor: '#f6f8fa80'
											}}
											value={taxeNom}
											onChange={(e) =>
												handleInputChange(
													e.target.value,
													"taxeNom"
												)
											}
											error={
												errors.taxeNom ? true : false
											}
											helperText={errors.taxeNom}
										/>
										<TextField
											label="Valeur (%)"
											id="taxe"
											name="taxe"
											placeholder="Taxe"
											variant="outlined"
											type="number"
											inputProps={{
												maxLength: 5,
												minLength: 0,
											}}
											sx={{
												display: "block",
												mr: 1,
												my: 0,
												backgroundColor: '#f6f8fa80'
											}}
											value={taxeValue}
											onChange={(e) =>
												handleInputChange(
													e.target.value,
													"taxeValue"
												)
											}
											error={
												errors.taxeValue ? true : false
											}
											helperText={errors.taxeValue}
										/>
										<Button
											variant="outlined"
											color="primary"
											size="medium"
											startIcon={<Add />}
											onClick={appendTaxe}
										>
											Ajouter
										</Button>
									</Box>
								</div>
							</div>
						</div>
					</div>
					<Divider />
					<div className="form-actions">
						<div className="horizontal-align">
							<Button
								variant="contained"
								color="primary"
								size="medium"
								disableElevation
								type="sumbit"
								sx={{
									minWidth: 124.78,
									height: 36.5,
								}}
							>
								{loading ? (
									<CircularProgress
										size={12}
										color="inherit"
									/>
								) : (
									"Enregistrer"
								)}
							</Button>
						</div>
					</div>
				</form>
			</StyledNouveauProduitContainer>
		</Modal>
	);
}

const StyledNouveauProduitContainer = styled("div")(() => ({
	backgroundColor: "#fff",
	width: "100%",
	height: "100vh",
	overflowY: "auto",
	maxWidth: 600,
	float: "right",
	// padding: "0px 0",
	borderLeft: "1px solid #cccccc",
	boxShadow: "-5px 0px 20px 6px #52525229",
	"& .form-actions": {
		padding: "20px",
	},
}));
