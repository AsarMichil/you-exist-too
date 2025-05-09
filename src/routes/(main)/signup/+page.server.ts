import { generateEmailLink, sendEmailConfirmation, stealHash } from '$lib/server/email/send-email';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

// Define outside the load function so the adapter can be cached
const schema = z.object({
	username: z.string().min(3).max(30),
	email: z.string().email()
});

export const load = async ({ locals }) => {
	// If user is already logged in, redirect to home
	if (locals.user) {
		throw redirect(302, '/');
	}

	const form = await superValidate(zod(schema));

	// Always return { form } in load functions
	return { form };
};

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// Check if the username is already taken
			const { data: existingUser, error: userCheckError } = await locals.supabase
				.from('person')
				.select('username')
				.eq('username', form.data.username)
				.single();

			console.log('existingUser', existingUser);
			if (userCheckError && userCheckError.code !== 'PGRST116') {
				// PGRST116 means no rows returned
				console.error('User check error:', userCheckError);
				return fail(500, { form, message: 'Error checking username' });
			}

			if (existingUser) {
				return setError(form, 'username', 'Sorry! That username is already taken.');
			}
			console.log('redirect url', `${new URL(request.url).origin}/setup`);
			// Attempt to create a new user with Supabase Auth
			const { data, error } = await stealHash({
				type: 'signup',
				email: form.data.email,
				password: crypto.randomUUID(), // Generate a random password for passwordless auth
				options: {
					redirectTo: `${new URL(request.url).origin}/setup`
				}
			});

			if (error) {
				console.error('Auth error:', error);
				return fail(500, { form, message: error.message });
			}

			sendEmailConfirmation(
				form.data.email,
				form.data.username,
				generateEmailLink({
					site_url: new URL(request.url).origin,
					email_action_type: 'signup',
					redirect_to: `${request.url}/setup`,
					token_hash: data.token_hash
				})
			);

			// Create a profile record in the person table

			const { error: profileError } = await locals.supabase.from('person').insert({
				id: data.user.id,
				username: form.data.username
			});

			if (profileError) {
				console.error('Profile creation error:', profileError);
				return fail(500, { form, message: 'Failed to create profile' });
			}

			// Redirect to the verify email page
		} catch (error) {
			console.error('Signup error:', error);
			return fail(500, { form, message: 'An unexpected error occurred' });
		}

		return redirect(302, '/verify');
	}
};
