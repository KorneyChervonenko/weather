import getWeatherIcon from './utils/getWeatherIcon';
import getLocalWeatherDescription from './utils/getLocalWeatherDescription.mjs';

import './Day.scss';

export default function Day({ dayData }) {
	return (
		<li className="day">
			<h3 className="day-name">{dayData.name}</h3>
			<div className="date">{dayData.date}</div>
			<div className="weather-icon" title={getLocalWeatherDescription(dayData.wmoCode)}>
				{getWeatherIcon(dayData.wmoCode)}
			</div>
			<div className="temperature">
				{dayData.tmin}...{dayData.tmax}℃
			</div>
		</li>
	);
}
