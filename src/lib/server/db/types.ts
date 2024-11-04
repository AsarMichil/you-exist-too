import type { Person } from '$lib/types/person';
export * from '$lib/types/person';
export interface DatabaseUser {
	id: string;
	username: string;
	hashed_password: string;
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
