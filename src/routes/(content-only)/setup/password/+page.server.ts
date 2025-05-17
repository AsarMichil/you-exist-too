import { client, db } from '$lib/server/db/index.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
	password: z
		.string()
		.min(8, { message: 'Password must be at least 8 characters' })
		.max(255, { message: 'Password must be 255 characters or less' })
});

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}
	return { form: await superValidate(zod(schema)) };
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			console.log('bruh');
		}

		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Update the user's password
		const { error: updatePasswordError } = await locals.supabase.auth.updateUser({
			password: form.data.password
		});

		if (updatePasswordError) {
			console.error('Password update error:', updatePasswordError);
            console.log(updatePasswordError.code)
			if (updatePasswordError.code === 'same_password') {
                console.log("same password  yay")
				// this is a success right???
				return redirect(302, '/setup/name');
			}
			form.errors.password = ['Error updating password. Please try again.'];
			return fail(500, { form });
		}

		// Redirect to the next step
		return redirect(302, '/setup/name');
	}
};
