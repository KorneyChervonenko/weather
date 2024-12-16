import { useEffect } from 'react';
import { useGeolocation } from './useGeolocation';
import DaysList from './DaysList.jsx';

import './App.scss';

const days = [
	{ name: 'Sunday', wmoCode: 1 },
	{ name: 'Monday', wmoCode: 0 },
	{ name: 'Tuesday', wmoCode: 95 },
	{ name: 'Wednesday', wmoCode: 2 },
	{ name: 'Thursday', wmoCode: 55 },
	{ name: 'Friday', wmoCode: 99 },
	{ name: 'Saturday', wmoCode: 3 },
];

export default function App() {
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
