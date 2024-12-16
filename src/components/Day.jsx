import getWeatherIcon from './utils/getWeatherIcon';

import './Day.scss';

export default function Day({ dayData }) {
	return (
		<li className="day">
			<h3>{dayData.name}</h3>
			<div className="weather-icon">{getWeatherIcon(dayData.wmoCode)}</div>
		</li>
	);
}
