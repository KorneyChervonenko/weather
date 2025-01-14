// todo
// card bg color accordingly with temperature
// change background and colors accordingly with year seasons
// light and dark theme fit to browser setup
// material ui

import DaysList from './DaysList.jsx';
import CountrySelector from './CountrySelector.jsx';
import CitySelector from './CitySelector.jsx';

import CircularProgress from '@mui/material/CircularProgress';

import './App.scss';
import { LocationProvider } from './LocationContext.mjs';

export default function App() {
	console.clear();
	return (
		<main className="App">
			<LocationProvider>
				<CountrySelector />
				<CitySelector />
				<DaysList />
			</LocationProvider>
		</main>
	);
}

// const date = new Date().toLocaleDateString(navigator.languages, {
// 	day: '2-digit',
// 	month: 'long',
// 	year: 'numeric',
// });

// const date = new Intl.DateTimeFormat(navigator.languages).format(new Date());

// const days = [
// 	{ name: 'Sunday', wmoCode: 1, tmin: -40, tmax: 40, date },
// 	{ name: 'Monday', wmoCode: 0, tmin: -4, tmax: 4, date },
// 	{ name: 'Tuesday', wmoCode: 95, tmin: 0, tmax: 5, date },
// 	{ name: 'Wednesday', wmoCode: 2, tmin: -1, tmax: 1, date },
// 	{ name: 'Thursday', wmoCode: 55, tmin: 40, tmax: 47, date },
// 	{ name: 'Friday', wmoCode: 99, tmin: 0, tmax: 1, date },
// 	{ name: 'Saturday', wmoCode: 3, tmin: -40, tmax: -15, date },
// ];
