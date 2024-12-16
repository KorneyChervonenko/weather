import Day from './Day.jsx';
import './DaysList.scss';

export default function DaysList({ days }) {
	return (
		<ol className="days-list">
			{days.map((dayData) => (
				<Day dayData={dayData} key={dayData.name} />
			))}
		</ol>
	);
}
