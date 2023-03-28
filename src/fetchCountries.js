const BASE_URL = 'https://restcountries.com/v3.1/name/';
const FIELDS = 'fields=name,capital,population,flags,languages';

const fetchCountries = function (name) {
  return fetch(`${BASE_URL}${name}?${FIELDS}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
};
export { fetchCountries };
