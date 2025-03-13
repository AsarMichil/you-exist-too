import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export async function POST({ request, locals: { safeGetSession } }) {
	const { user } = await safeGetSession();
	if (!user) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		// Get the blob data from the request
		const blob = await request.blob();

		// Get the person data to check if they already have a profile photo
		const { data: personData, error } = await db.getPersonById(user.id);
		if (error) {
			return json({ error: 'Database error' }, { status: 500 });
		}
		if (!personData || personData.length === 0) {
			return json({ error: 'Person not found' }, { status: 404 });
		}

		let { profile_photo_id } = personData[0];

		// If user already has a profile photo, delete it first
		if (profile_photo_id) {
			const deleted = await db.deleteProfilePhoto(profile_photo_id, user.id);
			if (!deleted || deleted.error) {
				return json({ error: 'Failed to delete existing profile photo' }, { status: 500 });
			}
		}

		// Generate a new ID for the profile photo
		profile_photo_id = nanoid();

		// Upload the new profile photo
		const { error: uploadError } = await db.uploadProfilePhoto(
			user.id,
			new File([blob], 'profile.jpg', { type: 'image/jpeg' }),
			profile_photo_id
		);

		if (uploadError) {
			return json({ error: 'Failed to upload profile photo' }, { status: 500 });
		}

		return json({
			message: 'Profile photo updated',
			profile_photo_id
		});
	} catch (error) {
		console.error('Error uploading profile photo:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
