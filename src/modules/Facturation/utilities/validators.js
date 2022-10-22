/**
 * Valide Les information générales de la vente
 * @param {object} client
 * @param {string} clientDef Num def du client
 * @param {numeric} taux Le taux de change
 * @param {string} devise Monaie
 * @returns valid as boolean, errors as object
 */
export const validerDefaultValues = (client, clientDef, taux, devise) => {
	let valid = true;
	let errors = {};

	if (!client && (clientDef !== "" || clientDef !== null || clientDef !== undefined)) {
		valid = false;
		errors["client"] = "Le numéro DEF du client est invalide";
	}

	if (!taux || taux === "" || +taux <= 0) {
		valid = false;
		errors["taux"] = "Le taux de vente est réquis en Fc";
	}

	if (devise !== "USD" && devise !== "CDF") {
		valid = false;
		errors["devise"] = "Spécifiez la devise";
	}

	return {
		valid,
		errors,
	};
};

/**
 * Valide les produits et qauntités vendues
 * @param {array} selectedProduits
 * @returns valid as boolean and error as string
 */
export const validerVente = (selectedProduits) => {
	let valid = true;
	let error = null;

	if (!selectedProduits || selectedProduits.length === 0) {
		error = "Séléctionnez au moins un produit.";
		valid = false;
	} else {
		valid = !selectedProduits.some((sP) => sP.quantiteSortie <= 0);
		if (!valid) {
			error = "Toutes les quantités doivent être superieur à zéro.";
		}
	}

	return {
		valid,
		error,
	};
};
