import { db } from '$lib/server/db';
import type { Person, PersonWithId } from '$lib/server/db/types';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async ({ params, locals: { safeGetSession } }) => {
	const { data, error } = await db.getPersonByUsername(params.username);
	const { user } = await safeGetSession();

	if (error) {
		console.error(error);
		return fail(500, { error: error });
	}
	if (!data) {
		return fail(404, { message: 'Person not found' });
	}

	const { ...person } = data[0] as PersonWithId;
	let profile_photo_uri = '';
	if (person.profile_photo_id) {
		profile_photo_uri = db.getProfilePhotoById(person.profile_photo_id) + '.jpeg';
	}
	// profile_photo_uri = 'https://d1deenjh0g4q0v.cloudfront.net/ebtsDFGw5MnD0MDz6wDo2.jpeg';
	return {
		props: {
			person: person as Person,
			profile_photo_uri: profile_photo_uri,
			own: user?.id === person.id
		}
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (!session) {
			return fail(401, { message: 'Unauthorized' });
		}
		const data = await request.formData();
	},
	setProfilePhoto: async ({ request, locals: { safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (!session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const { id } = session.user;
		const profile_photo = formData.get('profile_photo') as File;
		if (!profile_photo || profile_photo.size === 0) {
			return fail(400, { message: 'No profile photo provided' });
		}
		const { error, data: personData } = await db.getPersonById(id);

		if (error) {
			return fail(500, { message: 'Database error' });
		}
		if (!personData || personData.length === 0) {
			return fail(404, { message: 'Person not found' });
		}
		let { profile_photo_id } = personData[0] as PersonWithId;

		if (profile_photo_id) {
			const deleted = await db.deleteProfilePhoto(profile_photo_id, id);

			if (!deleted || deleted.error) {
				return fail(500, { message: 'Database error' });
			}
		}
		profile_photo_id = nanoid();
		const { error: uploadError, image_id: image_id } = await db.uploadProfilePhoto(
			id,
			profile_photo,
			profile_photo_id
		);
		return {
			status: 200,
			body: {
				message: 'Profile photo updated'
			}
		};
	}
};
