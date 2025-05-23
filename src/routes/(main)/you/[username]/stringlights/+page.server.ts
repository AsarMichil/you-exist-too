import { client, db } from '$lib/server/db';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	getThoughts: async ({ request, locals: { safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (!user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const url = new URL(request.url);
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '40');

		// Calculate offset based on page number and limit
		const offset = (page - 1) * limit;

		const { data: person, error: personError } = await client
			.from('person')
			.select('username')
			.eq('id', user.id)
			.single();
		if (personError) {
			return fail(500, { message: 'Database error' });
		}

		// Get paginated thoughts
		const {
			data: thoughts,
			error,
			count
		} = await client
			.from('thought')
			.select(
				'id, about, thinker, created_at, person!thought_thinker_fkey(id, username, given_name, preferred_name)',
				{
					count: 'exact'
				}
			)
			.eq('about', person.username)
			.not('thinker', 'is', null)
			.range(offset, offset + limit - 1);

		if (error) {
			return fail(500, { message: 'Database error' });
		}
		
		return {
			thoughts,
			pagination: {
				page,
				limit,
				total: count,
				pages: Math.ceil((count || 0) / limit)
			},
			openStringLights: true
		};
	}
}; 