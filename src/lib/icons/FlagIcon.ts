/**
 * The regional indicators go from 0x1F1E6 (A) to 0x1F1FF (Z).
 * This is the A regional indicator value minus 65 decimal so
 * that we can just add this to the A-Z char
 **/
const REGIONAL_INDICATOR_OFFSET = 0x1f1a5;

export function flagEmoji(countryCode: string) {
	const countryCodeUpper = countryCode.toUpperCase();
	const flag = String.fromCodePoint(
		REGIONAL_INDICATOR_OFFSET + countryCodeUpper.charCodeAt(0),
		REGIONAL_INDICATOR_OFFSET + countryCodeUpper.charCodeAt(1)
	);
	return flag;
}
