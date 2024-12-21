// function getDistance(position1, position2) {
// 	const { latitude: lat1, longitude: lon1 } = position1;
// 	const { latitude: lat2, longitude: lon2 } = position2;

// 	const R = 6371; // Radius of the Earth in kilometers
// 	const dLat = ((lat2 - lat1) * Math.PI) / 180;
// 	const dLon = ((lon2 - lon1) * Math.PI) / 180;
// 	const a =
// 		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
// 		Math.cos((lat1 * Math.PI) / 180) *
// 			Math.cos((lat2 * Math.PI) / 180) *
// 			Math.sin(dLon / 2) *
// 			Math.sin(dLon / 2);
// 	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// 	const distance = R * c; // Distance in kilometers
// 	return distance;
// }

function getDistance(position1, position2) {
	const { latitude: lat1, longitude: lon1 } = position1;
	const { latitude: lat2, longitude: lon2 } = position2;
	const r = 6371; // km
	const p = Math.PI / 180;

	const a =
		0.5 -
		Math.cos((lat2 - lat1) * p) / 2 +
		(Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lon2 - lon1) * p))) / 2;
	return 2 * r * Math.asin(Math.sqrt(a));
}

export default getDistance;

// Example usage:
// {
// 	const pos1 = { latitude: 48.858844, longitude: 2.294351 };
// 	const pos2 = { latitude: 51.5074, longitude: -0.1278 };

// 	const distance = getDistance(pos1, pos2);
// 	console.log(`Distance: ${distance.toFixed(2)} km`);
// }

// {
// 	const Donetsk = { latitude: 48.33962, longitude: 39.95948 };
// 	const Kyiv = { latitude: 50.45466, longitude: 30.5238 };

// 	const distance = getDistance(Donetsk, Kyiv);
// 	console.log(`Distance: ${distance.toFixed(2)} km`);
// }
