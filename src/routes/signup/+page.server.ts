// import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { client, db } from '$lib/server/db';
import type { Actions } from './$types';
import { sendSignupLink } from '$lib/server/email/send-email';
import type { PageServerLoad } from './$types';
import { DEV_URL, PROD_URL } from '$env/static/private';
import { dev } from '$app/environment';
export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (session) {
		return redirect(302, '/');
	}
	return {};
};

const currentUrl = dev ? DEV_URL : PROD_URL;

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		// const password = formData.get('password');
		const email = formData.get('email') as string;
		// username must be between 3 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
		// keep in mind some database (e.g. mysql) are case insensitive
		if (
			typeof username !== 'string' ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-z0-9_-]+$/.test(username)
		) {
			return fail(400, {
				message: 'Invalid username, please use a username between 3 and 31 characters!'
			});
		}
		// if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
		// 	return fail(400, {
		// 		message: 'Invalid password, please use a password longer than 6 characters!'
		// 	});
		// }

		// const userId = generateId(15);
		// const hashedPassword = await new Argon2id().hash(password);

		if (await db.personExists(username)) {
			return fail(409, {
				message: 'This username is already taken!',
				username: username
			});
		}

		const user = await client.auth.admin.generateLink({
			type: 'invite',
			email: email,
			options: {
				redirectTo: currentUrl + '/auth/password'
			}
		});
		console.log('User:', user);
		if (user.data.user) {
			await db.insertShadowPerson(username, user.data.user.id);
		} else {
			return fail(500, {
				message: 'Internal Server Error'
			});
		}

		const link =
			currentUrl +
			'/auth/confirm?token_hash=' +
			user.data.properties.hashed_token +
			'&type=invite' +
			'&next=' +
			user.data.properties.redirect_to;
		// "{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email"
		// console.log('Verification code:', code);
		console.log('Link:', link);
		const { error } = await sendSignupLink(email, username, link);
		console.error('Error:', error);
		// TODO: check if username is already used

		// const session = await lucia.createSession(userId, {});
		// const sessionCookie = lucia.createSessionCookie(session.id);
		// event.cookies.set(sessionCookie.name, sessionCookie.value, {
		// 	path: '.',
		// 	...sessionCookie.attributes
		// });

		return { success: true, message: 'Email sent!' };
	}
};

// async function generateEmailVerificationCode(userId: string, email: string): Promise<string> {
// 	db.deleteAllVerificationCodes(userId);
// 	const code = generateRandomString(5, alphabet('0-9'));
// 	const fiveMinutesFromNow = createDate(new TimeSpan(5, 'm'));
// 	console.log('5 minutes from now:', fiveMinutesFromNow);
// 	db.insertVerificationCode({
// 		user_id: userId,
// 		email,
// 		code,
// 		expires_at: createDate(new TimeSpan(5, 'm')).toISOString().slice(0, 19).replace('T', ' ') // 5 minutes
// 	});
// 	return code;
// }
