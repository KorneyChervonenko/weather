export default function CountrySelector({ countries, countryName, setCountryName, setCityName }) {
	return (
		<form>
			<h3 className="visually-hidden">Country Selector</h3>
			<select
				className="country-selector"
				value={countryName}
				onChange={(e) => {
					const countryName = e.target.value;
					setCountryName(countryName);
					const country = countries.find((c) => c.name === countryName);
					setCityName(country.capital);
				}}
			>
				{countries.map((country) => {
					if (country.capital.length === 0) return;
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