import type { Country, CountryMinimal } from './data';
import type { PaginationResult } from './map';

export { default as PhoneNumberInput } from './components/PhoneNumberInput';
export { default as CountryInput } from './components/CountryInput';

export type { PhoneProps } from './components/PhoneNumberInput';
export type { CountryType, CountryMinimalType, CountryCode } from './data';

export { default as CountryMap } from './map';
export { default as CountriesMap } from './map';

export type CountryPaginationResult = PaginationResult<Country>;
export type CountryMinimalPaginationResult = PaginationResult<CountryMinimal>;
