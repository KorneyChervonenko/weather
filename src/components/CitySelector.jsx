import { useContext } from 'react';
import { LocationContext, LocationDispatchContext } from './LocationContext.mjs';

// export default function CitySelector({ countries, countryName, cityName, dispatch })
export default function CitySelector() {
	const locationData = useContext(LocationContext);
	const dispatch = useContext(LocationDispatchContext);
	const { countries, countryName, cityName, geolocation } = locationData;

	if (countries.length === 0 || countryName === null) return;
	const selectedCountry = countries.find((country) => country.name === countryName);
	return (
		<form>
			<h3 className="visually-hidden">City Selector</h3>
			<select
				className="city-selector"
				value={cityName}
				// onChange={(e) => setCityName(e.target.value)}
				onChange={(e) => {
					const selectedCityName = e.target.value;
					dispatch({ type: 'set_city_name', payload: { cityName: selectedCityName } });
					dispatch({
						type: 'set_geolocation',
						payload: {
							geolocation: {
								nearestCountry: countries.find((country) => country.name === countryName),
								nearestCity: selectedCountry.cities.find((city) => city.name === selectedCityName),
							},
						},
					});
				}}
			>
				{selectedCountry.cities.map((city) => {
					return (
						<option value={city.name} key={city.id}>
							{city.name}
						</option>
					);
				})}
			</select>
		</form>
	);
}
