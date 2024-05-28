export interface DatabaseUser {
	id: string;
	username: string;
	hashed_password: string;
}

export interface Person {
	given_name: string;
	family_name: string;
	preferred_name: string;
	country_id: number;
	profile_photo_id: string;
	blurb: string;
	username: string;
	social_media_handles: object;
	birthdate: Date;
}
export interface PersonWithId extends Person {
	id: string;
}

export interface DatabaseUserAttributes {
	username: string;
	email: string;
	email_verified: number;
}
export interface EmailVerificationCode {
	code_id: number;
	code: number;
	user_id: string;
	email: string;
	expires_at: string;
}
