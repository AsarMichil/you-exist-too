import { client, db } from '$lib/server/db';
import type { SupportedCountries } from '$lib/types/person';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const profileSchema = z.object({
	given_name: z.string().min(1, 'First name is required'),
	family_name: z.string().optional(),
	preferred_name: z.string().optional(),
	blurb: z.string().max(200, 'Bio must be less than 200 characters').optional(),
	country: z.string().optional()
});

const socialLinksSchema = z.object({
	instagram: z.string()
});

export const load: PageServerLoad = async ({ parent, params, locals: { safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) {
		return redirect(303, `/you/${params.username}`);
	}
	const { data: personData, error } = await db.getPersonById(user.id);
	if (error) {
		console.error(error);
		return redirect(303, `/you/${params.username}`);
	}
	if (!personData || personData.length === 0) {
		console.error(`Person with id ${user.id} not found`);
		return redirect(303, `/you/${params.username}`);
	}
	if (personData[0].username !== params.username) {
		return redirect(303, `/you/${params.username}`);
	}
	const { data: socialLinksData, error: socialLinksError } = await client
		.from('social_links')
		.select('*')
		.eq('user_id', user.id)
		.single();
	if (socialLinksError) {
		console.error(socialLinksError);
	}

	const parentData = await parent();
	const person = parentData.props?.person || {};
	// Pre-populate the form with the user's current data
	const form = await superValidate(person, zod(profileSchema));
	let socialLinksForm;
	if (socialLinksData) {
		// transform the data to the schema
		const transformedData = {
			instagram: socialLinksData.username //TODO: add other platforms
		};
		socialLinksForm = await superValidate(transformedData, zod(socialLinksSchema));
	} else {
		socialLinksForm = await superValidate(zod(socialLinksSchema));
	}

	return { form, socialLinksForm };
};

export const actions: Actions = {
	update_profile: async ({ request, params, locals: { safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (!user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const form = await superValidate(request, zod(profileSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const { error } = await db.updatePerson(user.id, {
				...form.data,
				country: form.data.country as SupportedCountries
			});

			if (error) {
				console.error(error);
				return fail(500, { form, message: 'Failed to update profile' });
			}

			// Redirect back to the profile page
		} catch (error) {
			if (error instanceof Response) throw error;
			console.error(error);
			return fail(500, { form, message: 'An unexpected error occurred' });
		}
		return redirect(303, `/you/${params.username}`);
	},
	social_links: async ({ request, params, locals: { safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (!user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const form = await superValidate(request, zod(socialLinksSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const { error } = await client.from('social_links').upsert({
				user_id: user.id,
				platform: 'instagram',
				username: form.data.instagram
			});

			if (error) {
				console.error(error);
				return fail(500, { form, message: 'Failed to update social links' });
			}

			return redirect(303, `/you/${params.username}`);
		} catch (error) {
			console.error(error);
			return fail(500, { form, message: 'An unexpected error occurred' });
		}
	}
};
