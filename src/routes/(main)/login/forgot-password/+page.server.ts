import { dev } from '$app/environment';
import { DEV_URL, PROD_URL } from '$env/static/private';
import { db } from '$lib/server/db';
import { generateEmailLink, sendPasswordReset, stealHash } from '$lib/server/email/send-email';
import type { Actions, PageServerLoad } from '../$types';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const currentUrl = dev ? DEV_URL : PROD_URL;

// Define schema for the form
const schema = z.object({
	username_or_email: z.string().min(1, { message: 'Username or email is required' })
});

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (session) {
		redirect(302, '/');
	}

	const form = await superValidate(zod(schema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		let email;
		const username_or_email = form.data.username_or_email;

		if (username_or_email.includes('@')) {
			email = username_or_email;
		} else {
			email = await db.getPersonEmail(username_or_email);
		}

		if (!email) {
			return setError(form, 'username_or_email', 'User not found');
		}

		try {
			const { data, error } = await stealHash({
				type: 'recovery',
				email: email,
				options: {
					redirectTo: `${url.origin}/auth/password`
				}
			});

			if (error) {
				console.error('Password reset error:', error);
				return fail(500, { form, message: error.message });
			}

			const link = generateEmailLink({
				site_url: url.origin,
				email_action_type: 'recovery',
				redirect_to: `${url.origin}/auth/password`,
				token_hash: data.token_hash
			});

			const resendRes = await sendPasswordReset(email, email, link);
			if (resendRes.error) {
				console.error('Email sending error:', resendRes.error);
				return fail(500, { form, message: 'Failed to send password reset email' });
			}

			return {
				form,
				success: true,
				message: undefined
			};
		} catch (error) {
			console.error('Password reset error:', error);
			return fail(500, { form, message: 'An unexpected error occurred' });
		}
	}
};
