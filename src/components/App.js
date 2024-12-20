import { useEffect, useState, useReducer } from 'react';
import { useGeolocation } from './useGeolocation';
import DaysList from './DaysList.jsx';
import CountrySelector from './CountrySelector.jsx';
import CitySelector from './CitySelector.jsx';
// import countriesData from '../data/countries.json'

import './App.scss';
// 'uk-UA'
const date = new Date().toLocaleDateString(navigator.languages, {
	day: '2-digit',
	month: 'long',
	year: 'numeric',
});

// const date = new Intl.DateTimeFormat(navigator.languages).format(new Date());

const days = [
	{ name: 'Sunday', wmoCode: 1, tmin: -40, tmax: 40, date },
	{ name: 'Monday', wmoCode: 0, tmin: -4, tmax: 4, date },
	{ name: 'Tuesday', wmoCode: 95, tmin: 0, tmax: 5, date },
	{ name: 'Wednesday', wmoCode: 2, tmin: -1, tmax: 1, date },
	{ name: 'Thursday', wmoCode: 55, tmin: 40, tmax: 47, date },
	{ name: 'Friday', wmoCode: 99, tmin: 0, tmax: 1, date },
	{ name: 'Saturday', wmoCode: 3, tmin: -40, tmax: -15, date },
];

// const initialState = {
// 	countries: [],
// 	countryName: null,
// 	cityName: null,
// };

export default function App() {
	// console.clear();
	// console.log(date);
	// console.log(navigator.languages);

	// const [isLoading, setIsLoading] = useState(false);

	// const [{ countries, status, questionIndex, answer, points }, dispatch] = useReducer(
	// 	reducer,
	// 	initialState
	// );
	const [countries, setCountries] = useState([]);
	const [countryName, setCountryName] = useState(null);
	const [cityName, setCityName] = useState(null);

	useEffect(function () {
		async function fetchCountries() {
			try {
				// setIsLoading(true);
				// let response, data;
				const response = await fetch('../data/countries_cities.min.json'); //
				// const response = await fetch('../data/countries.json');
				// console.log(response);
				if (!response.ok) throw new Error('Something went wrong with fetching data');

				// remove countries without capital and add capital to cities if it isn't there
				const newCountries = (await response.json())
					.filter((country) => country.capital.length !== 0)
					.map((country) => {
						if (country.cities.includes(country.capital)) return country;
						else {
							const newCity = {
								id: crypto.randomUUID(),
								name: country.capital,
								latitude: country.latitude,
								longitude: country.longitude,
							};
							return { ...country, cities: [...country.cities, newCity] };
						}
					});

				// console.log(data);
				// setCountries(data.slice(0, 8))
				// ;
				const initCountry = newCountries.at(0);
				const initCityName = initCountry.capital;
				console.log(initCityName);

				setCountries(newCountries);
				setCountryName(initCountry.name);
				setCityName(initCityName);
				// setCountryName(newCountries.at(0).name);
				// setCurrentCityName(newCountries.at(0).cities.at(0).name);
				// const regions = new Set(data.map((country) => country.region));
				// console.log(regions);

				// console.log(countries);
			} catch (error) {
				console.log(error.message);
				alert(error.message);
			} finally {
				// setIsLoading(false);
			}
		}
		fetchCountries();
	}, []);

	const {
		isLoading,
		position: { lat, lng },
		error,
		getPosition,
	} = useGeolocation();
	// console.log(lat, lng);

	// useEffect(function () {
	// 	console.clear();
	// 	getPosition();
	// }, []);

	return (
		<main className="App">
			<CountrySelector
				countries={countries}
				countryName={countryName}
				setCountryName={setCountryName}
				setCityName={setCityName}
			/>

			<CitySelector
				country={countries?.find((c) => c.name === countryName)}
				cityName={cityName}
				setCityName={setCityName}
				key={countryName}
			/>
			{/* <DaysList days={days} /> */}
			{/* <button onClick={getPosition} disabled={isLoading}>
				Get my position
			</button>
			{error && <p>{error}</p>}
			{!isLoading && !error && lat && lng && (
				<p>
					Your GPS position:{' '}
					<a
						target="_blank"
						rel="noreferrer"
						href={`https://www.openstreetmap.org/#map=16/${lat}/${lng}`}
					>
						{lat}, {lng}
					</a>
				</p>
			)} */}
		</main>
	);
}
