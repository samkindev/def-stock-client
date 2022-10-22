/* Validator helpers */


/**
 * Checks if a given email is valid
 * @param {string} email Email address
 * @returns true or false
 */
export const isValidEmail = email => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
/**
 * Checks if a given phone number is valid
 * @param {string} tel Phone number
 * @returns true or false
 */
export const isValidPhoneNumber = tel => /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(tel);
/**
 * Checks if a given value, especially a string, is empty
 * @param {string | undefined | null} value Value to verify 
 * @returns true or false
 */
export const isEmptyString = value => !value || value === '';
/**
 * checks if an array is empty
 * @param {array} array Array to verify
 * @returns true or false
 */
export const isEmptyArray = array => !array || (array && array.length === 0);