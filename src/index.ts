import Country from './map';

const country = new Country();
// country.setSearch('thailand');
(async () => {
    await country.setMyCountry();
    console.log('Async Country', country.getCountryCode(), country.getMyCountryError());
})();

country.setLimit(3);
country.setPage(10);
country.setBaseUrl('https://api.example.com');
console.log('Execute Country', country.getPaginateCountriesMinimal());
