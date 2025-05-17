import { db } from '$lib/server/db/index.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
	username: z
		.string()
		.min(3, { message: 'Username must be at least 3 characters' })
		.max(30, { message: 'Username must be 30 characters or less' })
		.regex(/^[a-z0-9_-]+$/, {
			message: 'Username can only contain lowercase letters, numbers, hyphens, and underscores'
		})
});

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}

	// Pre-fill the form with existing data if available
	const { data: profile } = await locals.supabase
		.from('person')
		.select('username')
		.eq('id', locals.user.id)
		.single();

	if (profile) {
		// redirect to root setup
		throw redirect(302, '/setup');
	}

	return { form: await superValidate(zod(schema)) };
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/');
		}

		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Check if the username is already taken
		const { data: existingUser, error: userCheckError } = await locals.supabase
			.from('person')
			.select('username')
			.eq('username', form.data.username.toLowerCase())
			.single();

		// PGRST116 means no rows returned, which is good
		if (userCheckError && userCheckError.code !== 'PGRST116') {
			console.error('User check error:', userCheckError);
			return fail(500, { form, message: 'Error checking username' });
		}

		if (existingUser) {
			// Use setError from superForm to set the error directly on the field
			form.errors.username = ['This username is already taken. Please choose another one.'];
			return fail(400, { form });
		}

		// Create the user's profile in the database
		const person = await db.insertPersonEntry(form.data.username.toLowerCase(), locals.user.id);
		console.log('yayyy', person);
		return redirect(302, '/setup/password');
	}
};
