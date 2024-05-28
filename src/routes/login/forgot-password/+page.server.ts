import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import { db, client } from '$lib/server/db';
import { dev } from '$app/environment';
import { DEV_URL, PROD_URL } from '$env/static/private';
import { sendPasswordReset } from '$lib/server/email/send-email';

const currentUrl = dev ? DEV_URL : PROD_URL;

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (session) {
		redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		let email;
		const formData = await request.formData();
		const username_or_email = formData.get('username_or_email');
		if (typeof username_or_email !== 'string') {
			return fail(400, {
				message: 'Invalid username or email'
			});
		}
		if (username_or_email && username_or_email.includes('@')) {
			email = username_or_email;
		} else {
			email = await db.getPersonEmail(username_or_email);
		}
		if (!email) {
			return fail(400, {
				message: 'User not found'
			});
		}

		const { data, error } = await client.auth.admin.generateLink({
			type: 'recovery',
			email: email,
			options: {
				redirectTo: currentUrl + '/auth/password'
			}
		});
		if (error) {
			return fail(500, {
				message: error.message
			});
		}

		const link =
			currentUrl +
			'/auth/confirm?token_hash=' +
			data.properties.hashed_token +
			'&type=' +
			data.properties.verification_type +
			'&next=' +
			data.properties.redirect_to;
		const resendRes = await sendPasswordReset(email, email, link);
		if (resendRes.error) {
			return fail(500, {
				message: resendRes.error
			});
		}
		return { success: true, message: 'Email sent! Check your inbox!' };
	}
};
