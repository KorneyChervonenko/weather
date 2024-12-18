import { useEffect } from 'react';
import { useGeolocation } from './useGeolocation';
import DaysList from './DaysList.jsx';

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

export default function App() {
	console.clear();
	// console.log(date);
	// console.log(navigator.languages);

	const {
		isLoading,
		position: { lat, lng },
		error,
		getPosition,
	} = useGeolocation();
	// console.log(lat, lng);

	// useEffect(function () {
	// 	console.clear();
	// 	getPosition();
	// }, []);

	return (
		<main className="App">
			<DaysList days={days} />
			{/* <button onClick={getPosition} disabled={isLoading}>
				Get my position
			</button>
			{error && <p>{error}</p>}
			{!isLoading && !error && lat && lng && (
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
