import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
	given_name: z.string().optional(),
	family_name: z.string().optional(),
	preferred_name: z.string().min(1, { message: 'Name is required' })
});

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}

	// Pre-fill the form with existing data if available
	const { data: profile } = await locals.supabase
		.from('person')
		.select('preferred_name, given_name, family_name')
		.eq('id', locals.user.id)
		.single();
	console.log('balls', profile);
	if (profile && profile.preferred_name) {
		const prefilled = await superValidate(profile, zod(schema));
		console.log('prefilled', prefilled);
		return { form: prefilled };
	}

	return { form: await superValidate(zod(schema)) };
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/');
		}

		const form = await superValidate(request, zod(schema));
		console.log(form);
		if (!form.valid) {
			return fail(400, { form });
		}

		// Update the user's profile in the database
		const { error } = await locals.supabase
			.from('person')
			.update({
				preferred_name: form.data.preferred_name,
				given_name: form.data.given_name,
				family_name: form.data.family_name
			})
			.eq('id', locals.user.id);

		if (error) {
			console.error('Error updating profile:', error);
			return fail(500, { form });
		}

		// Redirect to the next step
		return redirect(302, '/setup/origin');
	}
};
