// todo translate countries name

import { useEffect, useState, useReducer } from 'react';
// import { useGeolocation } from './useGeolocation';
import DaysList from './DaysList.jsx';
import CountrySelector from './CountrySelector.jsx';
import CitySelector from './CitySelector.jsx';
import getNearestCity from './utils/getNearestCity.mjs';
import CircularProgress from '@mui/material/CircularProgress';
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

const initialData = {
	countries: [],
	countryName: null,
	cityName: null,
	geolocation: null,
	geolocationSource: null,
};

const initialStatus = {
	isCountriesListLoading: true,
	isDetecting: true,
};

function reducer(state, action) {
	switch (action.type) {
		case 'set_countries':
			const countries = action.payload.countries; // structuredClone() ???
			// const initCountry = countries.at(0);
			// const countryName = initCountry.name;
			// const cityName = initCountry.capital;
			return {
				...state,
				countries,
				countryName: countries.at(0).name,
				cityName: countries.at(0).capital,
			};
		// return { ...state, countries, countryName, cityName };

		case 'set_country_name':
			const country = state.countries.find((c) => c.name === action.payload.countryName);
			return { ...state, countryName: country.name, cityName: country.capital };
		// return { ...state, countryName: action.payload.countryName };

		case 'set_city_name':
			return { ...state, cityName: action.payload.cityName };

		case 'set_geolocation':
			return {
				...state,
				geolocation: action.payload.geolocation,
				geolocationSource: action.payload.geolocationSource,
			};

		default:
			throw new Error('Unknown action type');
	}
}

export default function App() {
	// console.clear();
	// console.log(date);
	// console.log(navigator.languages);

	// const [isCountriesListLoading, setisCountriesListLoading] = useState(false);

	const [{ countries, countryName, cityName, geolocation, geolocationSource }, dispatch] =
		useReducer(reducer, initialData);
	// const [geolocation, setGeolocation] = useState(null);
	const [{ isCountriesListLoading, isDetecting }, setStatus] = useState(initialStatus);

	const inProcess = isCountriesListLoading || isDetecting;
	// useEffect(function () {}, []);

	// select geolocated country + city in selector as start values
	useEffect(
		function () {
			// console.clear();
			if (
				countries.length === 0 ||
				geolocation === undefined ||
				geolocation === null ||
				geolocationSource === 'default'
			)
				return;
			// console.log('countries:', countries.length);
			// console.log(geolocation);
			dispatch({
				type: 'set_country_name',
				payload: { countryName: geolocation.nearestCountry.name },
			});
			dispatch({ type: 'set_city_name', payload: { cityName: geolocation.nearestCity.name } });
		},
		[countries, geolocation, geolocationSource]
	);

	// get geolocation with navigator.geolocation and find nearest city
	useEffect(
		function () {
			function getPosition() {
				if (countries.length === 0) return;
				if (geolocationSource === 'navigator' || geolocationSource === 'manual') return;
				if (!navigator.geolocation) {
					// setGeolocation(undefined);
					dispatch({
						type: 'set_geolocation',
						payload: { geolocation: undefined, geolocationSource: 'navigator' },
					});
					return;
				}
				// setisCountriesListLoading(true);
				setStatus((currStatus) => ({ ...currStatus, isDetecting: true }));
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const { latitude, longitude } = position.coords;
						// getNearestCity({ latitude, longitude}, countries);
						const detectedLocation = getNearestCity({ latitude, longitude }, countries);
						// setGeolocation(detectedLocation);
						dispatch({
							type: 'set_geolocation',
							payload: { geolocation: detectedLocation, geolocationSource: 'navigator' },
						});

						setStatus((currStatus) => ({ ...currStatus, isDetecting: false }));
					},
					(error) => {
						// setError(error.message);
						// setisCountriesListLoading(false);
						setStatus((currStatus) => ({ ...currStatus, isDetecting: false }));
					},
					{
						enableHighAccuracy: true,
						timeout: 5000,
						maximumAge: 0,
					}
				);
			}
			// console.clear();
			getPosition();
			// console.log(lat, lng);
		},
		[countries, geolocationSource]
	);

	// get countries with cities from local file at app start
	useEffect(function () {
		async function fetchCountries() {
			try {
				// setisCountriesListLoading(true);
				setStatus((currStatus) => ({ ...currStatus, isCountriesListLoading: true }));
				// let response, data;
				// const response = await fetch('../data/countries_cities.min.json');
				const response = await fetch('../data/countries_cities.min.json.gz');

				const ds = new DecompressionStream('gzip');
				const decompressed_stream = response.body.pipeThrough(ds);
				const decompressed_json = await new Response(decompressed_stream).json();

				// const response = await fetch('../data/countries.json');
				// console.log(response);
				if (!response.ok) throw new Error('Something went wrong with fetching data');

				// remove countries without capital and add capital to cities if it isn't there
				const newCountries = decompressed_json
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
				// const newCountries = (await response.json())
				// 	.filter((country) => country.capital.length !== 0)
				// 	.map((country) => {
				// 		if (country.cities.includes(country.capital)) return country;
				// 		else {
				// 			const newCity = {
				// 				id: crypto.randomUUID(),
				// 				name: country.capital,
				// 				latitude: country.latitude,
				// 				longitude: country.longitude,
				// 			};
				// 			return { ...country, cities: [...country.cities, newCity] };
				// 		}
				// 	});

				// console.log(data);
				dispatch({ type: 'set_countries', payload: { countries: newCountries } });
				// const defaultCountry = newCountries.at(0);
				// const defaultCity = defaultCountry.cities.find(
				// 	(city) => city.name === defaultCountry.capital
				// );

				/////////////////////////////////////////////
				if (geolocationSource === null) {
					const defaultCountry = newCountries.at(0);
					const defaultCity = defaultCountry.cities.find(
						(city) => city.name === defaultCountry.capital
					);
					dispatch({
						type: 'set_geolocation',
						payload: {
							geolocation: { nearestCountry: defaultCountry, nearestCity: defaultCity },
							geolocationSource: 'default',
						},
					});
				}
				// console.log(countries);
			} catch (error) {
				console.log(error.message);
				alert(error.message);
			} finally {
				// setisCountriesListLoading(false);
				setStatus((currStatus) => ({ ...currStatus, isCountriesListLoading: false }));
			}
		}
		fetchCountries();
	}, []);

	return (
		<main className="App">
			{inProcess && <CircularProgress style={{ color: 'yellow' }} />}
			{!inProcess && (
				<>
					<CountrySelector
						countries={countries}
						countryName={countryName}
						dispatch={dispatch}
						// setCountryName={setCountryName}
						// setCityName={setCityName}
					/>

					<CitySelector
						country={countries.find((c) => c.name === countryName)}
						cityName={cityName}
						// setCityName={setCityName}
						dispatch={dispatch}
						key={countryName}
					/>
				</>
			)}

			{/* <DaysList days={days} /> */}

			{/* <button onClick={getPosition} disabled={isCountriesListLoading}>
				Get my position
			</button>
			{error && <p>{error}</p>}
			{!isCountriesListLoading && !error && lat && lng && (
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
