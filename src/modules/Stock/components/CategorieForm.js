import React, { useState } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	CircularProgress,
	Modal,
	IconButton,
	Alert,
} from "@mui/material";
import { useDispatch } from 'react-redux';
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { actions } from '../../../app/reducers/stockProduit';

// Creation des quelques composants 
const StyledContainer = styled("form")(() => ({
	backgroundColor: "#fff",
	height: "100%",
	width: 300,
	padding: 20,
}));
const StyledHeader = styled("div")(() => ({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	marginBottom: 15,
	"& > h1": {
		fontSize: 17,
	},
}));

/**
 * Componsant Formulaire de création des catégories des produits
 */
export default function CategorieForm({ open, onClose }) {
	// Declaration des variable états du composant
	const [nom, setNom] = useState("");
	const [code, setCode] = useState("");
	const [description, setDescription] = useState("");
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);

	// Référence au premier champs du formulaire
	const nomRef = React.useRef();

	// Fonction d'initialisation
	const initAll = () => {
		setNom("");
		setCode("");
		setDescription("");
		setErrors({});
		setLoading(false);
	};

	// Recuperation des valeurs des champs du formulaire
	const handleInputChange = (value, label) => {
		// Reinitialisation des eureurs
		setErrors({ ...errors, [label]: null });

		switch (label) {
			case "nom":
				setNom(value);
				if (value !== "") {
				}
				break;
			case "code":
				setCode(value);
				break;
			case "description":
				setDescription(value);
				break;
			default:
				break;
		}
	};

	// Fermeture du formulaire
	const handleClose = () => {
		onClose();
		initAll();
	};

	// Validation des valeurs
	const validateData = (nom, code) => {
		let valid = true;
		if (nom === "") {
			valid = false;
			setErrors({ ...errors, nom: "La valeur est réquise" });
		}
		if (code === "") {
			valid = false;
			setErrors({ ...errors, nom: "La valeur est réquise" });
		}

		return valid;
	};

	// Fonction d'enregistrement
	const dispatch = useDispatch();
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Test de la validation des valeurs avant l'envoie de la requête
		const valid = validateData(nom, code);
		if (!valid) return;

		// Envoie de la requête
		try {
			setLoading(true);
			const res = await axios.post("/api/produits/categories", { nom, code, description });

			const data = res.data;

			console.log(data);

			if (data.state === "success") {
				dispatch(actions.appendCategorie(data.categorie));
				initAll();
			}
		} catch (err) {
			console.log(err);
			setLoading(false);
			errors["server"] =
				"Une erreur s'est produite lors de l'enregistrement";
		}
	};

	return (
		<Modal open={open} onClose={handleClose}>
			<StyledContainer onSubmit={handleSubmit}>
				{errors.server > 0 &&
					<Alert severity="error" color="error" variant="standard" sx={{ fontSize: 13 }}>
						{errors.server}
					</Alert>
				}
				<StyledHeader>
					<Typography variant="h1">
						Nouvelle catégorie de produit
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon size="small" />
					</IconButton>
				</StyledHeader>
				<TextField
					inputRef={nomRef}
					label="Nom de la catégorie *"
					id="categorie"
					name="categorie"
					placeholder="Catégorie des produits"
					variant="outlined"
					fullWidth
					type="text"
					value={nom}
					onChange={(e) => handleInputChange(e.target.value, "nom")}
					error={errors.nom ? true : false}
					helperText={errors.nom}
				/>
				<TextField
					inputRef={nomRef}
					label="Code de la catégorie *"
					id="categorie"
					name="categorie"
					placeholder="Code des produits"
					variant="outlined"
					fullWidth
					type="text"
					value={code}
					onChange={(e) => handleInputChange(e.target.value, "code")}
					error={errors.code ? true : false}
					helperText={errors.code}
				/>
				<Box mt={2}>
					<Typography variant="h2" className="block-title">
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
							handleInputChange(e.target.value, "description")
						}
						rows={4}
						error={errors.description ? true : false}
						helperText={errors.description}
					/>
				</Box>
				<div className="form-actions">
					<div className="horizontal-align">
						<Button
							variant="outlined"
							color="default"
							size="medium"
							disableElevation
							sx={{ mr: 2 }}
							onClick={handleClose}
						>
							Annuler
						</Button>
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
								<CircularProgress size={12} color="inherit" />
							) : (
								"Enregistrer"
							)}
						</Button>
					</div>
				</div>
			</StyledContainer>
		</Modal>
	);
}
