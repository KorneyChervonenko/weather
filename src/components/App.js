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
};

const initStatus = { isCountriesListLoading: false, isGeoLocationDetecting: false };

function reducer(state, action) {
	switch (action.type) {
		case 'set_countries':
			return { ...state, countries: action.payload.countries };

		case 'set_country_name':
			return { ...state, countryName: action.payload.countryName };

		case 'set_city_name':
			return { ...state, cityName: action.payload.cityName };

		case 'set_geolocation':
			return { ...state, geolocation: action.payload.geolocation };

		default:
			throw new Error('Unknown action type');
	}
}

export default function App() {
	// console.clear();
	// console.log(date);
	// console.log(navigator.languages);

	// const [isCountriesListLoading, setisCountriesListLoading] = useState(false);

	const [{ countries, countryName, cityName, geolocation }, dispatch] = useReducer(
		reducer,
		initialData
	);
	// const [geolocation, setGeolocation] = useState(null);
	const [{ isCountriesListLoading, isGeoLocationDetecting }, setStatus] = useState(initStatus);
	const inProcess = isCountriesListLoading || isGeoLocationDetecting;
	// useEffect(function () {}, []);

	// // select geolocated country + city in selector as start values
	// useEffect(
	// 	function () {
	// 		// console.clear();
	// 		if (
	// 			countries.length === 0 ||
	// 			geolocation === undefined ||
	// 			geolocation === null ||
	// 			geolocationSource === 'default'
	// 		)
	// 			return;
	// 		// console.log('countries:', countries.length);
	// 		// console.log(geolocation);
	// 		dispatch({
	// 			type: 'set_country_name',
	// 			payload: { countryName: geolocation.nearestCountry.name },
	// 		});
	// 		dispatch({ type: 'set_city_name', payload: { cityName: geolocation.nearestCity.name } });
	// 	},
	// 	[countries, geolocation, geolocationSource]
	// );

	// get countries with cities from local file at app start
	useEffect(function () {
		// let newCountries;

		async function fetchCountries() {
			try {
				// setisCountriesListLoading(true);
				// setIsLoading(true);
				// setStatus(currStatus=>currStatus.isCountriesListLoading:true)
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

				dispatch({ type: 'set_countries', payload: { countries: newCountries } });

				if (!navigator.geolocation) {
					console.log('geolocation is OFF');

					const defaultCountry = newCountries.at(0);
					const defaultCity = defaultCountry.cities.find(
						(city) => city.name === defaultCountry.capital
					);
					const defaultGeoLocation = { nearestCountry: defaultCountry, nearestCity: defaultCity };
					dispatch({ type: 'set_country_name', payload: { countryName: defaultCountry.name } });
					dispatch({ type: 'set_city_name', payload: { cityName: defaultCity.name } });
					dispatch({ type: 'set_geolocation', payload: { geolocation: defaultGeoLocation } });
					return;
				}

				setStatus((currStatus) => ({ ...currStatus, isGeoLocationDetecting: true }));
				navigator.geolocation.getCurrentPosition(
					(position) => {
						console.log('detect geolocation in progress...');

						const { latitude, longitude } = position.coords;
						const detectedLocation = getNearestCity({ latitude, longitude }, newCountries);
						console.log(latitude, longitude);
						const { nearestCountry, nearestCity } = detectedLocation;
						console.log(detectedLocation);

						dispatch({ type: 'set_country_name', payload: { countryName: nearestCountry.name } });
						dispatch({ type: 'set_city_name', payload: { cityName: nearestCity.name } });
						dispatch({ type: 'set_geolocation', payload: { geolocation: detectedLocation } });

						// setIsLoading(false);
						setStatus((currStatus) => ({ ...currStatus, isGeoLocationDetecting: false }));
					},
					(error) => {
						// setError(error.message);
						// setisCountriesListLoading(false);
						// setIsLoading(false);
						setStatus((currStatus) => ({ ...currStatus, isGeoLocationDetecting: false }));
					},
					{
						enableHighAccuracy: true,
						timeout: 5000,
						maximumAge: 0,
					}
				);
			} catch (error) {
				console.log(error.message);
				alert(error.message);
			} finally {
				// setisCountriesListLoading(false);
				setStatus((currStatus) => ({ ...currStatus, isCountriesListLoading: false }));
			}
		}
		// setIsLoading(true);
		fetchCountries();
		// setIsLoading(false);
	}, []);

	return (
		<main className="App">
			{inProcess && <CircularProgress style={{ color: 'yellow' }} />}
			{!inProcess && (
				<>
					{/* <CountrySelector
						countries={countries}
						countryName={countryName}
						dispatch={dispatch}
						// setCountryName={setCountryName}
						// setCityName={setCityName}
					/> */}

					{/* <CitySelector
						country={countries.find((c) => c.name === countryName)}
						cityName={cityName}
						// setCityName={setCityName}
						dispatch={dispatch}
						key={countryName}
					/> */}
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
