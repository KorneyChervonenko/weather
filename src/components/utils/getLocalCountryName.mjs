// const translations = {
// 	ko: '우크라이나',
// 	'pt-BR': 'Ucrânia',
// 	pt: 'Ucrânia',
// 	nl: 'Oekraïne',
// 	hr: 'Ukrajina',
// 	fa: 'وکراین',
// 	de: 'Ukraine',
// 	es: 'Ucrania',
// 	fr: 'Ukraine',
// 	ja: 'ウクライナ',
// 	it: 'Ucraina',
// 	'zh-CN': '乌克兰',
// 	tr: 'Ukrayna',
// 	ru: 'Украина',
// 	uk: 'Україна',
// 	pl: 'Ukraina',
// };

export default function getLocalCountryName(translations) {
	const languages = navigator.languages;
	// const languages = ['uk', 'ru-RU', 'ru', 'en-US', 'en', 'uk', 'en'];
	// const languages = ['en', 'ru-RU'];
	const language = languages
		.find((language) => translations[language.split('-').at(0)] !== undefined)
		.split('-')
		.at(0);
	// console.log(language);
	return translations[language];
}

// console.log(getLocalCountryName(translations));
