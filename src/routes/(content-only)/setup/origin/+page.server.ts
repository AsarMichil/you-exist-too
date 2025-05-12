import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
	country: z
		.string()
		.min(1, { message: 'Origin is required' })
		.max(2, { message: 'Origin must be less than 2 characters' })
});

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const { data: profile } = await locals.supabase
		.from('person')
		.select('country')
		.eq('id', locals.user.id)
		.single();
	if (profile?.country) {
		return {
			form: await superValidate(profile, zod(schema))
		};
	}

	return {
		form: await superValidate(zod(schema))
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		console.log("bro3");
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const form = await superValidate(request, zod(schema));
		console.log("bro4", form);
		if (!form.valid) {
			return fail(400, { form });
		}

		const { error } = await locals.supabase
			.from('person')
			.update({ country: form.data.country })
			.eq('id', locals.user.id);

		if (error) {
			console.error('Error updating profile:', error);
			return fail(500, { form });
		}

		return redirect(302, '/setup/blurb');
	}
};
