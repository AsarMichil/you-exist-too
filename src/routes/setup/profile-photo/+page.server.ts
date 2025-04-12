import { db } from '$lib/server/db/index.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

// const schema = z.object({
// 	username: z
// 		.string()
// 		.min(3, { message: 'Username must be at least 3 characters' })
// 		.max(30, { message: 'Username must be 30 characters or less' })
// 		.regex(/^[a-z0-9_-]+$/, {
// 			message: 'Username can only contain lowercase letters, numbers, hyphens, and underscores'
// 		})
// });

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}

	// Pre-fill the form with existing data if available
	const { data: person } = await locals.supabase
		.from('person')
		.select('profile_photo_id')
		.eq('id', locals.user.id)
		.single();
	let profile_photo_uri = undefined;
	if (person?.profile_photo_id) {
		profile_photo_uri = db.getProfilePhotoById(person.profile_photo_id) + '.jpeg';
	}

	return { profile_photo_uri };
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/');
		}

		// const form = await superValidate(request, zod(schema));

		// if (!form.valid) {
		// 	return fail(400, { form });
		// }
		throw redirect(302, '/');
	}
};
