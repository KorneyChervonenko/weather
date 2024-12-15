import { useEffect } from 'react';
import { useGeolocation } from './useGeolocation';

import './App.scss';

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
		<div className="App">
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
		</div>
	);
}
