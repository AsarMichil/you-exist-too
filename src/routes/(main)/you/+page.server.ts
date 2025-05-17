import { client, db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}
	const currentUser = locals.user;

	const { data: profile } = await client
		.from('person')
		.select('username')
		.eq('id', currentUser.id)
		.single();

	console.log('profile yuh', profile);
	if (!profile) {
		throw redirect(302, '/setup');
	}
	return redirect(302, `/you/${profile.username}`);
};
