export default function CountrySelector({ countries, countryName, dispatch }) {
	if (countries.length === 0) return;
	return (
		<form>
			<h3 className="visually-hidden">Country Selector</h3>
			<select
				className="country-selector"
				value={countryName}
				onChange={(e) => {
					// const countryName = e.target.value;
					dispatch({ type: 'set_country_name', payload: { countryName: e.target.value } });
					// setCountryName(countryName);
					// const country = countries.find((c) => c.name === countryName);
					// dispatch({ type: 'set_city_name', payload: { cityName: country.capital } });
					// setCityName(country.capital);
				}}
			>
				{countries.map((country) => {
					return (
						<option value={country.name} key={country.id}>
							{country.name}
						</option>
					);
				})}
			</select>
		</form>
	);
}
