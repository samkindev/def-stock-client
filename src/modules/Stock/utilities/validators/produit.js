/**
 * Valide les données pour la création d'un nouveau produit
 * @param {string} designation Désignation du produit
 * @param {string} unite Nature du produit
 * @param {number} marge Marge bénéficiaire
 * @param {number} stockSecurite Stock de sécurité
 * @returns Object of {boolean valid value and an objet of errrors}
 */
export const validerNouveauProduit = (
	designation,
	unite,
	marge,
	qMin,
	code,
	numCompte
) => {
	let valid = true;
	const errors = {};

	if (!numCompte || numCompte === "" || numCompte[0] !== "3") {
		valid = false;
		errors["numCompte"] =
			"Le numéro de compte stock commence par 3";
	}

	if (designation === "" || !designation) {
		errors["designation"] = "La désignation du produit est réquise.";
		valid = false;
	}

	if (unite === "" || !unite) {
		errors["unite"] = "La nature du produit est réquise.";
		valid = false;
	}

	if (marge === null || marge === undefined || marge <= 0) {
		errors["marge"] = "La marge bénéficiaire du produit est réquise.";
		valid = false;
	}

	if (!qMin || qMin < 0) {
		errors["qMin"] = "Le stock de sécurité du produit est réquis.";
		valid = false;
	}

	if (!code || code === "") {
		errors["code"] = "Le code du produit est réquis.";
		valid = false;
	}

	return {
		valid,
		errors,
	};
};


/**
 * Valide les données de la création du stock initial
 * @returns Object of {boolean valid value and an objet of errrors}
 */
export const validerEntree = ({
	dateExp,
	quantite,
	cout_unitaire,
	taux,
	pv_unitaire,
	devise,
	provenance,
	licence_url,
	factureId,
	produit,
}) => {
	let valid = true;
	const errors = {};
	const defaultValueErrors = [];

	if (!produit) {
		errors["produit"] = "Séléctionnez un produit.";
		valid = false;
	} else if (!produit.id) {
		errors["produit"] = "Séléctionnez un produit.";
		valid = false;
	}

	if (quantite < 0 || !quantite) {
		errors["quantite"] = "La quantité du produit est réquise.";
		valid = false;
	}

	if (cout_unitaire < 0 || !cout_unitaire) {
		errors["cu"] = "Le coût unitaire du produit est réquis.";
		valid = false;
	}

	if (pv_unitaire < 0 || !pv_unitaire) {
		errors["pv"] = "Le prix de vente unitaire du produit est réquis.";
		valid = false;
	}

	if (taux < 0 || !taux) {
		defaultValueErrors.push("Le taux est réquis.");
		valid = false;
	}

	if (provenance < 0 || !provenance) {
		defaultValueErrors.push(
			"Veillez spécifier la source de l'entrée en stock"
		);
		valid = false;
	}

	if (provenance === "licence" && (!licence_url || licence_url === "")) {
		defaultValueErrors.push("Ajouter l'image de la licence d'importation");
		valid = false;
	}

	if (provenance === "facture" && (!factureId || factureId === "")) {
		defaultValueErrors.push(
			"Veillez séléctionner la facture d'achat pour ce produit."
		);
		valid = false;
	}

	if (devise === "" || !devise) {
		defaultValueErrors.push("Veillez séléctionner la devise utilisée.");
		valid = false;
	}

	if (dateExp !== "" && dateExp) {
		if (
			!/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(
				dateExp
			)
		) {
			errors["dateExp"] = "Mauvaise date";
			valid = false;
		}
	}

	return {
		valid,
		errors,
		defaultValueErrors,
	};
};
