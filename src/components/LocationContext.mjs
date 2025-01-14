import { createContext, useEffect, useReducer, useState } from 'react';
import getNearestCity from './utils/getNearestCity.mjs';

const locationInitData = {
	countries: [],
	countryName: null,
	cityName: null,
	geolocation: null,
};

const initStatus = { isCountriesListLoading: false, isGeoLocationDetecting: false };

function locationReducer(state, action) {
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

const LocationContext = createContext(null);

function LocationProvider({ children }) {
	const [locationData, dispatch] = useReducer(locationReducer, locationInitData);
	const { countries, countryName, cityName, geolocation } = locationData;

	const [{ isCountriesListLoading, isGeoLocationDetecting }, setStatus] = useState(initStatus);
	const inProcess = isCountriesListLoading || isGeoLocationDetecting;
	// useEffect(function () {}, []);
	const [weatherData, setWeatherData] = useState(undefined);

	useEffect(
		function () {
			async function getWeather() {
				// return if geolocation = null
				if (geolocation === null) {
					// console.log('geolocation not detected');
					return;
				}
				try {
					const { latitude, longitude } = geolocation.nearestCity;
					const weatherURL =
						'https://api.open-meteo.com/v1/forecast?' +
						`latitude=${latitude}` +
						'&' +
						`longitude=${longitude}` +
						'&daily=weathercode,temperature_2m_max,temperature_2m_min';

					const weatherRes = await fetch(weatherURL);
					const weatherData = await weatherRes.json();
					// console.log(weatherData.daily);
					setWeatherData(weatherData.daily);
				} catch (err) {
					alert(err);
				} finally {
				}
				// console.log(geoData);
			}

			getWeather();
		},
		[geolocation]
	);

	// get countries with cities from local file at app start
	useEffect(function () {
		// let newCountries;

		async function fetchCountries() {
			function setDefaultLocation(countries) {
				const defaultCountry = countries.at(0);
				const defaultCity = defaultCountry.cities.find(
					(city) => city.name === defaultCountry.capital
				);
				const defaultGeoLocation = { nearestCountry: defaultCountry, nearestCity: defaultCity };
				dispatch({ type: 'set_country_name', payload: { countryName: defaultCountry.name } });
				dispatch({ type: 'set_city_name', payload: { cityName: defaultCity.name } });
				dispatch({ type: 'set_geolocation', payload: { geolocation: defaultGeoLocation } });
			}

			try {
				// console.log('start loading countries list');

				// setisCountriesListLoading(true);
				// setIsLoading(true);
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
						country.translations['en'] = country.name;
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
					// console.log('geolocation is OFF');
					setDefaultLocation(newCountries);
					return;
				}

				setStatus((currStatus) => ({ ...currStatus, isGeoLocationDetecting: true }));

				navigator.geolocation.getCurrentPosition(
					(position) => {
						console.log('detect geolocation in progress...');

						const { latitude, longitude } = position.coords;
						const detectedLocation = getNearestCity({ latitude, longitude }, newCountries);
						// console.log(latitude, longitude);
						const { nearestCountry, nearestCity } = detectedLocation;
						// console.log(detectedLocation);

						dispatch({ type: 'set_country_name', payload: { countryName: nearestCountry.name } });
						dispatch({ type: 'set_city_name', payload: { cityName: nearestCity.name } });
						dispatch({ type: 'set_geolocation', payload: { geolocation: detectedLocation } });

						// setIsLoading(false);
						setStatus((currStatus) => ({ ...currStatus, isGeoLocationDetecting: false }));
					},
					(error) => {
						// console.log(`detecting geolocation error ${error} ${error.code}`);
						setDefaultLocation(newCountries);
						// setError(error.message);
						// setisCountriesListLoading(false);
						// setIsLoading(false);
						setStatus((currStatus) => ({ ...currStatus, isGeoLocationDetecting: false }));
					},
					{
						enableHighAccuracy: true,
						timeout: 20000,
						maximumAge: 0,
					}
				);
			} catch (error) {
				console.log(error.message);
				// alert(error.message);
			} finally {
				// setisCountriesListLoading(false);
				setStatus((currStatus) => ({ ...currStatus, isCountriesListLoading: false }));
				// console.log('finish loading countries list');
			}
		}
		// setIsLoading(true);
		fetchCountries();
		// setIsLoading(false);
	}, []);

	return (
		<LocationContext.Provider value={{ locationData, dispatch, weatherData, inProcess }}>
			{children}
		</LocationContext.Provider>
	);
}

// export const LocationDispatchContext = createContext(null);
export { LocationContext, LocationProvider };
