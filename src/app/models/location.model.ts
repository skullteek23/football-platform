/**
 * Structure of object in the response from State City API call for states of India
 */

export interface ILocationState {
    id: number;
    name: string;
    country_id: number;
    country_code: string;
    iso2: string
}


/**
 * Structure of object of response the from State City API call for cities of a State
 */
export interface ILocationCity {
    id: number;
    name: string
}