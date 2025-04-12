import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
	blurb: z
		.string()
		.min(1, { message: 'Bio is required' })
		.max(500, { message: 'Bio must be less than 500 characters' })
});

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}

	// Pre-fill the form with existing data if available
	const { data: profile } = await locals.supabase
		.from('person')
		.select('blurb')
		.eq('id', locals.user.id)
		.single();

	console.log('blrubr', profile);
	const form = await superValidate(profile, zod(schema));
	return { form };
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

		// Update the user's profile in the database
		const { error } = await locals.supabase
			.from('person')
			.update({ blurb: form.data.blurb })
			.eq('id', locals.user.id);

		if (error) {
			console.error('Error updating profile:', error);
			return fail(500, { form });
		}

		throw redirect(302, '/setup/profile-photo');
	}
};
