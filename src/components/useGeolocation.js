import { useState } from 'react';

export function useGeolocation() {
	const [isLoading, setIsLoading] = useState(false);
	const [position, setPosition] = useState({});
	const [error, setError] = useState(null);

	function getPosition() {
		if (!navigator.geolocation) return setError('Your browser does not support geolocation');
		setIsLoading(true);
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setPosition({
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
				});
				console.log(position);
				setIsLoading(false);
			},
			(error) => {
				setError(error.message);
				setIsLoading(false);
			},
			{
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0,
			}
		);
	}
	return { isLoading, position, error, getPosition };
}
