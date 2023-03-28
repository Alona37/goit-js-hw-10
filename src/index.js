import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  listEl: document.querySelector('.country-list'),
  infoEl: document.querySelector('.country-info'),
};
// console.log(refs);

refs.inputEl.addEventListener(
  'input',
  debounce(onCountryInput, DEBOUNCE_DELAY)
);

function onCountryInput(event) {
  clearCountries();
  const name = event.target.value.toLowerCase().trim();

  if (!name) {
    return;
  }
  fetchCountries(name)
    .then(data => {
      clearCountries();
      if (data.length >= 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length === 1) {
        refs.listEl.insertAdjacentHTML(
          'beforeend',
          renderMultipleCountry(data)
        );
        refs.infoEl.insertAdjacentHTML('beforeend', renderOneCountry(data));
      } else if (data.length > 2 && data.length <= 10) {
        refs.listEl.insertAdjacentHTML(
          'beforeend',
          renderMultipleCountry(data)
        );
      }
    })
    .catch(err => {
      // console.log(err);
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderOneCountry(data) {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `
    
      <ul class="country-info__list">
          <li class="country-info__item">Capital: ${capital}</li>
          <li class="country-info__item">Population: ${population}</li>
          <li class="country-info__item">Lenguages: ${Object.values(
            languages
          )}</li>
      </ul>
  `
  );
}

function renderMultipleCountry(data) {
  return data
    .map(
      ({ name, flags }) => `
      <li class="country-list__item">
        <img class="country-list__img" 
          src="${flags.svg}" 
          alt="${name.official}" 
          width="100" 
          height="80">
        <h2 class = country-list_title>${name.official}</h2>
      </li>`
    )
    .join('');
}

function clearCountries() {
  refs.listEl.innerHTML = '';
  refs.infoEl.innerHTML = '';
}
