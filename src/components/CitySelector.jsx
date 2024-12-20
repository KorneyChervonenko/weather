export default function CitySelector({ country, cityName, dispatch }) {
	if (country === undefined) return;
	return (
		<form>
			<h3 className="visually-hidden">City Selector</h3>
			<select
				className="city-selector"
				value={cityName}
				// onChange={(e) => setCityName(e.target.value)}
				onChange={(e) => dispatch({ type: 'set_city_name', payload: { cityName: e.target.value } })}
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
