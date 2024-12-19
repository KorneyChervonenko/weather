export default function CitySelector({ country, cityName, setCityName }) {
	if (country === undefined) return;
	// if (countryName === null) return;
	// const country = countries.find((c) => c.name === countryName);
	return (
		<form>
			<h3 className="visually-hidden">City Selector</h3>
			<select
				className="city-selector"
				value={cityName}
				onChange={(e) => setCityName(e.target.value)}
			>
				{country.cities.map((city) => {
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
