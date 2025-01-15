import { LocationContext } from './LocationContext.mjs';
import Day from './Day.jsx';
import './DaysList.scss';
import { useContext } from 'react';

export default function DaysList() {
	const { locationData, dispatch, weatherData, inProcess } = useContext(LocationContext);
	if (inProcess) return;
	if (!weatherData) return;
	return (
		<ul className="days-list">
			{weatherData.time.map((date, i) => {
				const dayData = {
					date: new Date(date).toLocaleDateString(navigator.languages, {
						day: '2-digit',
						month: 'long',
						year: 'numeric',
					}),
					name: new Intl.DateTimeFormat(navigator.languages, {
						weekday: 'long',
					}).format(new Date(date)),
					wmoCode: weatherData.weathercode.at(i),
					tmax: Math.ceil(weatherData.temperature_2m_max.at(i)),
					tmin: Math.floor(weatherData.temperature_2m_min.at(i)),
				};
				return <Day dayData={dayData} key={dayData.name} />;
			})}
		</ul>
	);
}

// export default function DaysList({ days }) {
// 	return (
// 		<ol className="days-list">
// 			{days.map((dayData) => (
// 				<Day dayData={dayData} key={dayData.name} />
// 			))}
// 		</ol>
// 	);
// }
