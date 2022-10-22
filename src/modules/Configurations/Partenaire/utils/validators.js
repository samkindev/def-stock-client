import { isEmptyArray, isEmptyString, isValidEmail, isValidPhoneNumber } from "../../../../utilities/validators";

// Validates the fournisseur data
// Returns the errors object and the valid boolean
export const validateFournisseurData = (tel, email, address, compte, numFournisseur, intitule, allDepots, selectedDepots) => {
    const errors = {};
    let valid = true;

    if (!isValidPhoneNumber(tel)) {
        valid = false;
        errors.tel = "Mauvais format du numéro de téléphone"
    }
    if (!isValidEmail(email)) {
        valid = false;
        errors.email = 'Mauvais format d\'email'
    }
    if (isEmptyString(address)) {
        valid = false;
        errors.address = "L'adresse du fournisseur est réquise."
    } else if (address.split(',').length < 5) {
        valid = false;
        errors.address = "L'adresse est incorrecte. Elle doit avoir 5 valeur séparée par des virgules."
    }
    if (compte === 'new' && isEmptyString(numFournisseur)) {
        valid = false;
        errors.numFournisseur = 'Veuillez renseigner le numéro du fournisseur'
    }
    if (compte === 'new' && isEmptyString(intitule)) {
        valid = false;
        errors.intitule = 'Veuillez renseigner l\'intitulé du compte'
    }
    if (!allDepots && isEmptyArray(selectedDepots)) {
        valid = false;
        errors.depot = 'Veuillez spécifier le dépôt/magasin';
    }

    return { valid, errors }
}
