import { client, db } from '$lib/server/db';
import type { Person, PersonWithId } from '$lib/server/db/types';
import type { LayoutServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params, locals: { safeGetSession } }) => {
	const { data, error } = await client.from('person').select('*').eq('username', params.username);

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

	return {
		props: {
			person: person as Person,
			profile_photo_uri: profile_photo_uri,
			own: user?.id === person.id
		}
	};
};
