import { db } from '$lib/server/db';
import type { PersonWithId } from '$lib/server/db/types';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

// The load function is no longer needed as we're using the layout data
// All data is now loaded in +layout.server.ts

export const actions: Actions = {
	uploadProfilePhoto: async ({ request, locals: { safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (!user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const id = user.id;
		const formData = await request.formData();
		const profile_photo = formData.get('profile_photo');

		if (!profile_photo || !(profile_photo instanceof File)) {
			return fail(400, { message: 'No profile photo provided' });
		}

		// Get the person data to check if they already have a profile photo
		const { data: personData, error } = await db.getPersonById(id);
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
		const { error: uploadError } = await db.uploadProfilePhoto(id, profile_photo, profile_photo_id);

		if (uploadError) {
			return fail(500, { message: 'Failed to upload profile photo' });
		}

		return {
			status: 200,
			body: {
				message: 'Profile photo updated'
			}
		};
	}
};
