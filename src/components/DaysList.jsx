import Day from './Day.jsx';
import './DaysList.scss';

export default function DaysList({ weatherData }) {
	return (
		<ol className="days-list">
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
		</ol>
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
