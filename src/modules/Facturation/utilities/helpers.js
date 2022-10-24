import axios from 'axios';
import { dateCompare } from '../../../utilities/helpers';

/**
 * La function qui recupere les donnees du client
 * @param {string} numDef Le num def du client
 * @param {function} cb Callback function. Params: loading, client, error
 * @returns null if no numDef oththerwise void;
 */
export const getClientData = async (numDef, assujetti, cb) => {
	let nD = numDef;
	if (!nD || nD === '' || nD.length < 5) return;
	if (compareNumDef(nD, assujetti.num_def)) return;

	nD = nD.replaceAll('/', '').replaceAll('-', '');

	cb(true);
	axios
		.post(`https://def-api.herokuapp.com/api/assujetti/by_def/${nD}`, { numero_def: numDef })
		.then(res => {
			const d = res.data;
			if (!d.numero_def) {
				cb(false, null, d.message);
			} else {
				cb(false, d, null);
			}
		})
		.catch((error) => {
			cb(false, null, error);
		});
}

/**
 * Compare two num def
 * @param {string} def1 
 * @param {string} def2 
 * @returns true if equal false if not equal
 */
export const compareNumDef = (def1, def2) => {
	if ((def1 === def2)) return true;
	return false;
}

/**
 * Convert a quantity to default
 * @param {number} quantite 
 * @param {number} equivalent 
 * @returns {number}
 */
export const convertQuantityToDefaultUnit = (quantite, equivalent) => {
	return quantite / equivalent;
}

/**
 * Methode Fifo pour la gestion des stocks 
 * @param {array} entrees 
 * @param {number} qSortie 
 * @param {object} newUnit 
 * @param {object} currentUnit 
 * @returns {object} {
		prixTotal,
		prixTotalMin,
		entreeSortie,
		newEntrees,
	}
 */
export function fifo(entrees = [], qSortie, newUnit, currentUnit) {
	if (!qSortie || qSortie === 0) {
		return { prixTotal: 0, entreeSortie: [], newEntrees: [] };
	}
	// Quantity conversion
	const quantite = newUnit.type_unite === 'extra' ? convertQuantityToDefaultUnit(qSortie, newUnit.equivalent) : qSortie;

	let i = 0,
		qSparEntree = 0,
		qS = quantite,
		newEntrees = [],
		entreeSortie = [],
		pT = 0,
		pTMin = 0;

	let sorted = [...entrees].sort((a, b) =>
		dateCompare(a.createdAt, b.createdAt)
	);

	while (qS > 0 && i < sorted.length) {
		const e = sorted[i];
		qS = qS - e.solde;
		let solde = 0;
		entreeSortie = entreeSortie.filter((es) => es.entreeId !== e.id);

		if (qS < 0) {
			solde = Math.abs(qS);
			qSparEntree = quantite;
		} else {
			qSparEntree = e.solde;
		}

		newEntrees[i] = { ...sorted[i], solde };

		entreeSortie.push({
			id: e.id,
			q_sortie: qSparEntree,
			solde,
		});

		let pv = e.pv_unitaire;
		let pvMin = e.pv_unitaire_minimal;

		pT = pT + qSparEntree * pv;
		pTMin = pTMin + qSparEntree * pvMin;

		i++;
	}

	newEntrees = [...newEntrees, ...entrees.filter(e => !newEntrees.some(nE => nE.id === e.id))];

	return {
		prixTotal: pT,
		prixTotalMin: pTMin,
		entreeSortie,
		newEntrees,
	};
}

/**
 * Calcule la facture
 * @param {array} produits Tableaux des produits
 * @param {number} remise La remise appliquée 
 * @returns object of {q, sousTotal, tva, netAPayer}
 */
export function calculeFacture(produits = [], remise) {
	let q = 0;
	let st = 0;
	produits.forEach((p) => {
		q = p.quantiteSortie + q;
		st = st + p.prixTot;
	});

	if (remise && !isNaN(+remise)) {
		st = st * (1 - +remise / 100);
	}
	const tva = st * 0.16;
	const netAPayer = st + tva;

	return {
		q,
		sousTotal: st,
		tva,
		netAPayer,
	};
}

/**
 * 
 * @param {array} entrees 
 * @param {object} newUnit 
 * @returns {number}
 */
export function getQuantiteDisponible(entrees = [], newUnit) {
	const qty = entrees.reduce((prev, val) => prev + val.solde, 0);

	if (newUnit.type_unite === 'extra') {
		return qty * newUnit.equivalent;
	}

	return qty;
}