import { client, db } from '$lib/server/db';
import type { Person, PersonWithId } from '$lib/server/db/types';
import { nullsToUndefined } from '$lib/types/utils';
import type { LayoutServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';

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

	const { ...nulledPerson } = data[0];
	const person = nullsToUndefined(nulledPerson);
	let profile_photo_uri = '';
	if (person.profile_photo_id) {
		profile_photo_uri = db.getProfilePhotoById(person.profile_photo_id) + '.jpeg';
	}
	// todo make this not a waterfalled query
	const { data: socialLinksData, error: socialLinksError } = await client
		.from('social_links')
		.select('*')
		.eq('user_id', person.id);
	if (socialLinksError) {
		console.error(socialLinksError);
	}

	const { count, error: thoughtCountError } = await client
		.from('thought')
		.select('*', { count: 'exact', head: true })
		.eq('about', params.username.toLowerCase());

	if (thoughtCountError) {
		console.error(thoughtCountError);
	}
	return {
		props: {
			person,
			profile_photo_uri: profile_photo_uri,
			own: user?.id === person.id,
			thoughtCount: count,
			socialLinks: socialLinksData
		}
	};
};
