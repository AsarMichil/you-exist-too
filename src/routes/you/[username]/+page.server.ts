import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import type { Person, PersonWithId } from '$lib/server/db/types';
import { nanoid } from 'nanoid';
import { invalidate } from '$app/navigation';
export const load: PageServerLoad = async ({ params }) => {
	const { data, error } = await db.getPersonByUsername(params.username);
	error && console.error(error);
	if (data) {
		// console.log('data', data);

		const { id, ...person } = data[0] as PersonWithId;
		let profile_photo_uri = '';
		if (person.profile_photo_id) {
			profile_photo_uri = db.getProfilePhotoById(person.profile_photo_id) + '.jpeg';
		}
		// profile_photo_uri = 'https://d1deenjh0g4q0v.cloudfront.net/ebtsDFGw5MnD0MDz6wDo2.jpeg';
		console.log('profile_photo_uri', profile_photo_uri);
		return {
			props: {
				person: person as Person,
				profile_photo_uri: profile_photo_uri
			}
		};
	}
	return fail(404, { message: 'Person not found' });
};

export const actions: Actions = {
	updateProfile: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (!session) {
			return fail(401, { message: 'Unauthorized' });
		}
		const data = await request.formData();
	},
	setProfilePhoto: async ({ request, locals: { supabase, safeGetSession } }) => {
		console.log('setProfilePhoto');
		const { session } = await safeGetSession();
		if (!session) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = await request.formData();
		const { id } = session.user;
		const profile_photo = formData.get('profile_photo') as File;
		console.log('profile_photo', profile_photo);
		if (!profile_photo || profile_photo.size === 0) {
			return fail(400, { message: 'No profile photo provided' });
		}
		const { error, data: personData } = await db.getPersonById(id);

		console.log('a', personData);
		if (error) {
			return fail(500, { message: 'Database error' });
		}
		if (!personData || personData.length === 0) {
			return fail(404, { message: 'Person not found' });
		}
		let { profile_photo_id } = personData[0] as PersonWithId;
		console.log('b');
		console.log('profile_photo_id', profile_photo_id);

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
