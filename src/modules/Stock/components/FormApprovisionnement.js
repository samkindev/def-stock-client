import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import {
	Typography,
	FormControl,
	RadioGroup,
	TextField,
	Button,
	useTheme,
	Alert,
	CircularProgress,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import HistoriqueIcon from "@mui/icons-material/History";
import { ComboBox, DateMaskInput, InputRadio, TauxDevise } from "../../../Components";
import MultipleFormApprov from "./MultipleFormApprov";
import ListeFacturesAchat from "./ListeFacturesAchat";
import { useSelector, useDispatch } from "react-redux";
import {
	getProduits,
	selectAll as selectAllProduits,
} from "../../../app/reducers/stockProduit";
import { creerEntree } from "../../../app/reducers/entree";
import { validerEntree } from "../utilities/validators/produit";
import { Box } from "@mui/system";
import { FeedbackContext } from '../../../App';
import { getTaux, getDevise } from '../../../app/reducers/config';

export default function FormApprovisionnement() {
	const taux = useSelector(getTaux);
	const devise = useSelector(getDevise);
	const { createFeedback } = useContext(FeedbackContext);
	const produits = useSelector(selectAllProduits);
	const [provenance, setProvenance] = useState("interne");
	const [produit, setProduit] = useState(null);
	const [quantite, setQuantite] = useState("");
	const [cu, setCu] = useState("");
	const [marge, setMarge] = useState(0);
	const [dateExp, setDateExp] = useState();
	const [licence, setLicence] = useState("");
	const [openFactureList, setOpenFactureList] = useState(false);
	const [multiple, setMultiple] = useState(false);
	const [errors, setErrors] = useState({});
	const [defaultValueErrors, setDefaultValueErrors] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pv, setPv] = useState("");
	const numEntree = "";
	const theme = useTheme();
	const dispatch = useDispatch();

	const dateExpChange = (event) => {
		setDateExp(event.target.value);
	};

	const initAll = useCallback(() => {
		setProduit(null);
		setQuantite("");
		setCu("");
		setMarge("");
		setPv("");
		setErrors({});
		setDefaultValueErrors([]);
	}, []);

	const handleChangeCU = (e) => {
		let val = e.target.value;
		setCu(val);
		val = +val;
		if (val) {
			setPv(Math.floor(val * (1 + produit.marge / 100)));
		} else {
			setPv("");
		}
	};

	const toggleFactureList = () => {
		setOpenFactureList(!openFactureList);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (loading) {
			return;
		}

		const data = {
			date_exp: dateExp,
			num_entree: numEntree,
			quantite: +quantite,
			cout_unitaire: +cu,
			pv_unitaire: pv,
			taux: +taux,
			devise,
			provenance,
			licence_url: licence,
		};

		const { errors, defaultValueErrors, valid } = validerEntree({
			...data,
			produit,
		});

		if (!valid) {
			setErrors(errors);
			setDefaultValueErrors(defaultValueErrors);
			return;
		}

		setLoading(true);

		dispatch(
			creerEntree({
				produitId: produit.id,
				data,
			})
		)
			.then((res) => {
				if (res.payload) {
					if (res.payload.state === "success") {
						initAll();
						createFeedback(
							"Enregistrement fait avec succès !",
							"enregistrement-entrees",
							"success"
						);
					}
				}
			})
			.finally(() => setLoading(false));
	};

	const toggleMultiple = useCallback(() => {
		setMultiple(!multiple);
	}, [multiple]);

	const handleChangeProduit = useCallback((newValue) => {
		setProduit(newValue);
		if (newValue) {
			setMarge(newValue.marge);
		}
	}, []);

	useEffect(() => {
		if (produits.length === 0) {
			dispatch(getProduits());
		}
	}, [dispatch, produits]);
	return (
		<form className="form-approv" onSubmit={handleSubmit}>
			<header>
				<Typography className="module-title">
					Approvisionnement{" "}
					<span className="small">
						>> Entrée des produits en stock
					</span>
				</Typography>
				<Link to="/stock/historique_approvisionnement">
					<Button
						color="primary"
						variant="text"
						size="medium"
						startIcon={<HistoriqueIcon />}
					>
						Voir l'historique des entrées
					</Button>
				</Link>
			</header>
			{multiple && (
				<MultipleFormApprov open={multiple} onClose={toggleMultiple} />
			)}
			{openFactureList && (
				<ListeFacturesAchat
					open={openFactureList}
					onClose={toggleFactureList}
				/>
			)}
			<div className="form-body horizontal-align">
				<div className="form-block">
					{defaultValueErrors.length > 0 && (
						<Alert
							severity="error"
							color="error"
							variant="standard"
							sx={{ fontSize: 13 }}
						>
							{defaultValueErrors.map((error, i) => (
								<span key={i}>
									{error}
									<br />
								</span>
							))}
						</Alert>
					)}
					<Typography variant="h2" className="block-title">
						Provenance
					</Typography>
					<Typography variant="caption" className="small helper-text">
						Spécifiez la provenance des produits/articles
					</Typography>
					<FormControl
						component="fieldset"
						style={{ display: "block" }}
					>
						<RadioGroup
							aria-label="provenance"
							name="provenance des produits ou marchandises"
							value={provenance}
							onChange={(event) =>
								setProvenance(event.target.value)
							}
						>
							<div
								style={{ margin: theme.spacing(0, 0, 1.5, 0) }}
							>
								<InputRadio
									value="licence"
									label="A partir d'une licence d'importation"
									sx={{ fontSize: 15 }}
								/>
								<label
									htmlFor="licence"
									className={`file-input decale-20 ${provenance !== "licence" && "disabled"
										}`}
									disabled={provenance !== "licence"}
								>
									<input
										id="licence"
										name="licence"
										type="file"
										disabled={provenance !== "licence"}
										style={{
											visibility: "hidden",
											display: "none",
										}}
									/>
									Shoisir un fichier
								</label>
							</div>
							<div
								style={{ margin: theme.spacing(0, 0, 1.5, 0) }}
							>
								<InputRadio
									value="facture"
									label="A partir d'une facture d'achat"
								/>
								<Button
									variant="outlined"
									color="default"
									className="decale-20"
									disabled={provenance !== "facture"}
									sx={{
										borderRadius: 0,
										mt: 1,
										display: "flex",
									}}
									onClick={toggleFactureList}
								>
									Sélectionnez la facture
								</Button>
							</div>
							<InputRadio
								value="interne"
								label="Productions internes"
							/>
						</RadioGroup>
					</FormControl>
					<TauxDevise />
				</div>
				<div className="form-block">
					<Box display="flex" justifyContent="space-between" alignItems="baseline" mb={2}>
						<Typography variant="h2" className="block-title" sx={{ mb: '0!important' }}>
							Produits/Articles <span className="small helper-text">>> Production interne</span>
						</Typography>
						<Link to="/stock/nouveau_produit">
							<Button
								variant="text"
								color="primary"
								size="small"
								startIcon={<AddIcon />}
							>
								Nouveau produit
							</Button>
						</Link>
					</Box>
					<div>
						<div
							className="horizontal-align"
							style={{ marginBottom: 15 }}
						>
							<ComboBox
								value={produit}
								placeholder="Produit"
								filterSelectedOptions={true}
								label="Produit"
								setValue={handleChangeProduit}
								disabled={provenance !== 'interne'}
								options={produits.map((prod) => ({
									id: prod.id,
									label: prod.designation,
									marge: prod.marge,
								}))}
								error={errors.produit ? true : false}
								helperText={errors.produit}
							/>
							<TextField
								label="Marge *"
								id="marge"
								name="marge"
								placeholder="Marge de bénéfice sur une unité"
								variant="outlined"
								fullWidth
								disabled
								style={{ maxWidth: 100 }}
								value={`${marge}%`}
								onChange={(e) => setMarge(e.target.value)}
								error={errors.marge ? true : false}
								helperText={errors.marge}
							/>
						</div>
						<div
							className="horizontal-align"
							style={{ marginBottom: 15 }}
						>
							<TextField
								label="Quantité *"
								id="quantite_si"
								name="quantite_si"
								placeholder="Quantité stock initial"
								variant="outlined"
								fullWidth
								disabled={provenance !== 'interne'}
								type="number"
								value={quantite}
								onChange={(e) => setQuantite(e.target.value)}
								error={errors.quantite ? true : false}
								helperText={errors.quantite}
							/>
							<TextField
								label="Coût unitaire *"
								id="cu"
								name="cu"
								placeholder="Coût unitaire du produit"
								variant="outlined"
								disabled={!produit}
								fullWidth
								type="number"
								value={cu}
								onChange={handleChangeCU}
								error={errors.cu ? true : false}
								helperText={errors.cu}
							/>
						</div>
						<div
							className="horizontal-align"
							style={{ marginBottom: 15 }}
						>
							<TextField
								label="Prix de vente unitaire *"
								id="pv"
								name="pv"
								placeholder="Coût unitaire du produit"
								variant="outlined"
								fullWidth
								disabled={!produit}
								type="number"
								value={pv}
								onChange={(e) => setPv(e.target.value)}
								error={errors.pv ? true : false}
								helperText={errors.pv}
							/>
							<DateMaskInput
								label="Date d'expiration"
								value={dateExp}
								onChange={dateExpChange}
								id="exp"
								name="exp"
								disabled={!produit}
								placeholder="jj/mm/aaaa"
								variant="outlined"
								fullWidth
								error={errors.dateExp ? true : false}
								helperText={errors.dateExp}
							/>
						</div>
					</div>
					<div className="form-actions">
						<Button
							variant="contained"
							disableElevation
							type="submit"
							disabled={provenance !== 'interne'}
							sx={{
								minWidth: 113.19,
								height: 36.5,
							}}
						>
							{loading ? (
								<CircularProgress size={12} color="inherit" />
							) : (
								"Enregistrer"
							)}
						</Button>
						<Button
							variant="text"
							color="primary"
							disableElevation
							sx={{ ml: 1 }}
							onClick={toggleMultiple}
							disabled={provenance !== 'interne'}
						>
							Enregistrement multiple
						</Button>
					</div>
					<div style={{ marginTop: 15 }}>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								marginBottom: 1.5,
							}}
						>
							<InfoIcon
								fontSize="small"
								color="default"
								style={{ marginRight: 5 }}
							/>
							<Typography variant="caption" className="small">
								Utilisez la touche tabulation pour passer de
								champs à champs.
							</Typography>
						</div>
						<Typography variant="caption" className="small">
							(*) veut dire que le champs est réquis.
						</Typography>
					</div>
				</div>
			</div>
		</form>
	);
}
