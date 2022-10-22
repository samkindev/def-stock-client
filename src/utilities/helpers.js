/**
 * Compares two date
 * @param {date} a First date
 * @param {date} b Second date
 * @returns (a > b) - (a < b) or NAN if either a or be is not in a good Date format
 */
export function dateCompare(a, b) {
	let x = a,
		y = b;
	x = new Date(x).valueOf();
	y = new Date(y).valueOf();
	return isFinite(x) && isFinite(y) ? (x > y) - (x < y) : NaN;
}
/**
 * Compares two date
 * @param {date} a First date
 * @param {date} b Second date
 * @returns (a > b) - (a < b) or NAN if either a or be is not in a good Date format
 */
export function stringsSortCb(a, b) {
	if (a < b) {
		return -1;
	} else if (a > b) {
		return 1;
	} else {
		return 0;
	}
}

/**
 * Get the redirect string url from the current url
 * @returns The Url string	
 */
export const getLoginRedirectUrl = () => {
	// Retrieve the current url
	const href = window.location.href;
	const protocol = href.slice(0, href.indexOf("//") + 2); // Get the protocal (http:// or https://)
	// Split the rest of the url into array to find the hostname (the first element of the array)
	let baseUrl = href.slice(protocol.length).split(":");
	if (baseUrl.length <= 1) {
		baseUrl = href.slice(protocol.length).split("/");
	}
	// Return the url string
	return protocol + baseUrl[0] + "/login";
};

/**
 * Reçoit un number et retourne le nombre formaté
 * @param {number} number The number to format
 * @returns formated number string
 */
// export const formatNumber = (number) => {
// 	const str = number.toLocaleString("fr");
// 	return str
// }

export function formatNumber(number, mantiseSize = 2, separator = ',') {
	let [mantise, dec] = number.toString().split('.');
	dec = dec ? dec.length > mantiseSize ?
		dec.slice(0, mantiseSize) :
		dec + (new Array(mantiseSize - dec.length)).fill('0').join('') :
		(new Array(mantiseSize)).fill('0').join('');

	return [mantise, dec].join(separator);
}

/**
 * Calcule le prix unitaire et retourn le prix unitaire formaté
 * @param {number} prixTotal Total price
 * @param {number} quantite quantity
 * @param {string} type type retourné
 * @returns P.U
 */
export const getPrixUnitaire = (prixTotal, quantite, type) => {
	const pu = prixTotal / quantite;
	if (type === "number") {
		return pu;
	}
	return formatNumber(pu);
}

/**
 * Verify if an input value is numeric and return the value
 * @param {string} char Character from input
 * @param {string} inputCurrentValue Current value of the input before adding the new typed character
 * @returns The char if number or the input current value
 */
export const getNumberFromInput = (char, inputCurrentValue, lang = 'fr') => {
	if (
		(!isFinite(char) && char !== '.' &&
			char !== ',') ||
		(char === '.' &&
			inputCurrentValue.slice(0, inputCurrentValue.length - 1).indexOf('.') !== -1
		) ||
		(char === ',' &&
			inputCurrentValue.slice(0, inputCurrentValue.length - 1).indexOf(',') !== -1
		) ||
		(char === '.' && lang === 'fr' &&
			inputCurrentValue.slice(0, inputCurrentValue.length - 1).indexOf(',') !== -1
		) ||
		(char === ',' && lang === 'en' &&
			inputCurrentValue.slice(0, inputCurrentValue.length - 1).indexOf('.') !== -1
		) ||
		inputCurrentValue[0] === '.' || inputCurrentValue[0] === ','
	) {
		return inputCurrentValue.slice(0, inputCurrentValue.length - 1);
	}

	if (char === ',' && lang === 'en') inputCurrentValue = inputCurrentValue.replace(char, '.');

	if (char === '.' && lang === 'fr') inputCurrentValue = inputCurrentValue.replace(char, ',');

	return inputCurrentValue;
}

/**
 * Convert the quantity by unit
 * @param {object} newUnit The new selected unit
 * @param {object} currentUnit The current unit
 * @param {number} quantity The quantity
 * @returns The new quantity
 */
export const convertQuantity = (newUnit, currentUnit, qDispo) => {
	let newQ = 0;
	if (currentUnit.type_unite === 'default' && newUnit.type_unite === 'default') {
		newQ = qDispo;
	} else if (currentUnit.type_unite === 'extra' && newUnit.type_unite === 'default') {
		newQ = parseFloat(qDispo) / currentUnit.equivalent;
	} else if (currentUnit.type_unite === 'default' && newUnit.type_unite === 'extra') {
		newQ = parseFloat(qDispo) * newUnit.equivalent;
	} else if (currentUnit.type_unite === 'extra' && newUnit.type_unite === 'extra') {
		const currentQ = qDispo / currentUnit.equivalent;
		newQ = currentQ * newUnit.equivalent;
	}

	return newQ;
}