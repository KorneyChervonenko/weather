import { useContext } from 'react';
import { LocationContext } from './LocationContext.mjs';
import CircularProgress from '@mui/material/CircularProgress';

export default function ProcessIndicator(params) {
	const { locationData, dispatch, inProcess } = useContext(LocationContext);

	// return <CircularProgress style={{ color: 'yellow' }} />;
	return <>{inProcess ? <CircularProgress style={{ color: 'yellow' }} /> : null}</>;
}
