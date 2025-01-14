import { useContext } from 'react';
// import { LocationContext, LocationDispatchContext } from './LocationContext.mjs';
import { LocationContext } from './LocationContext.mjs';
import getLocalCountryName from './utils/getLocalCountryName.mjs';

// export default function CountrySelector({ countries, countryName, dispatch })
export default function CountrySelector() {
	const { locationData, dispatch, inProcess } = useContext(LocationContext);
	// const dispatch = useContext(LocationDispatchContext);
	const { countries, countryName, cityName, geolocation } = locationData;

	if (countries.length === 0) return;
	if (inProcess) return;
	return (
		<form>
			<h3 className="visually-hidden">Country Selector</h3>
			<select
				className="country-selector"
				value={countryName}
				onChange={(e) => {
					// const countryName = e.target.value;
					dispatch({ type: 'set_country_name', payload: { countryName: e.target.value } });
					const country = countries.find((country) => country.name === e.target.value);
					// console.log(country.name);

					dispatch({ type: 'set_city_name', payload: { cityName: country.capital } });
					dispatch({
						type: 'set_geolocation',
						payload: {
							geolocation: {
								nearestCountry: country,
								nearestCity: country.cities.find((city) => city.name === country.capital),
							},
						},
					});
				}}
			>
				{countries.map((country) => {
					return (
						<option value={country.name} key={country.id}>
							{getLocalCountryName(country.translations) || country.name}
						</option>
					);
				})}
			</select>
		</form>
	);
}
