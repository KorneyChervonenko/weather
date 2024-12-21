// import COUNTRIES from './countries.mjs';
import getDistance from './getDistance.mjs';

function getNearestCity(position, countries) {
	let nearestCountry, nearestCity;
	let shortestDistance = Infinity;

	// console.log('current position:', position);

	countries.forEach((country) => {
		country.cities.forEach((city) => {
			const [latitude, longitude] = [city.latitude, city.longitude].map(Number);
			const distance = getDistance(position, { latitude, longitude });
			if (distance < shortestDistance) {
				shortestDistance = distance;
				nearestCity = city;
				nearestCountry = country;
			}
		});
	});
	// console.log(nearestCountry.name, nearestCity.name, shortestDistance);
	return { country: nearestCountry, city: nearestCity };
}

export default getNearestCity;

// {
// 	let { country, city } = getNearestCity({ latitude: 50.45466, longitude: 30.5238 }, COUNTRIES);
// 	console.log(country.name, city.name);
// }

// {
// 	let { country, city } = getNearestCity({ latitude: 48.34493, longitude: 33.50374 }, COUNTRIES);
// 	console.log(country.name, city.name);
// }
