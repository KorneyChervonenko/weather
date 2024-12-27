import wmoCodes from './wmoCodes.mjs';

export default function getLocalWeatherDescription(wmoCode) {
	const languages = navigator.languages;
	// const languages = ['uk', 'ru-RU', 'ru', 'en-US', 'en', 'uk', 'en'];
	// const languages = ['pl'];
	const wmoCodeDesriptions = wmoCodes[wmoCode];
	if (wmoCodeDesriptions === undefined) return undefined;
	let language = languages.find(
		(language) => wmoCodeDesriptions[language.split('-').at(0)] !== undefined
	);
	language = language === undefined ? 'en' : language.split('-').at(0);
	return wmoCodeDesriptions[language];
}

// console.log(getLocalWeatherDescription(99));
