import { Server } from '$lib/server/db/db';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { username } = params;

	if (!username) {
		error(404, 'Username is required');
	}

	// Check if the user exists
	const { data: personData, error: personError } = await Server.client
		.from('person')
		.select('id, username, preferred_name, given_name, thoughts_thought')
		.eq('username', username.toLowerCase())
		.single();

	if (personError || !personData) {
		error(404, 'User not found');
	}

	return {
		person: {
			username: personData.username,
			displayName: personData.preferred_name || personData.given_name,
			thoughtCount: personData.thoughts_thought || 0
		}
	};
};
