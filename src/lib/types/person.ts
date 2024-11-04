export type SupportedCountries = 'CA' | 'US';
export interface Person {
	given_name: string;
	family_name: string;
	preferred_name: string;
	country: SupportedCountries;
	profile_photo_id: string;
	blurb: string;
	username: string;
	social_media_handles: object;
	birthdate: Date;
}
