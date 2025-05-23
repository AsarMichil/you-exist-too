import { client, db } from '$lib/server/db';
import type { PersonWithId } from '$lib/server/db/types';
import type { Actions } from './$types';
import type { ReturnType } from '@sinclair/typebox';
import { fail } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

export const load = async ({ params, locals: { safeGetSession }, parent, url }) => {
	const { props } = await parent();
	if (!props || !props.own) {
		return {
			props
		};
	}
	let page: number;
	let limit: number;
	const pageParam = url.searchParams.get('page');
	const limitParam = url.searchParams.get('limit');
	page = pageParam ? parseInt(pageParam) : 1;
	limit = limitParam ? parseInt(limitParam) : 40;

	const thoughts = getPaginatedThoughts(params.username, page, limit);
	return {
		props,
		thoughts
	};
};

async function getPaginatedThoughts(username: string, page: number, limit: number) {
	const { data: person, error: personError } = await client
		.from('person')
		.select('username')
		.eq('username', username)
		.single();
	if (personError) {
		return { error: personError };
	}
	const offset = (page - 1) * limit;
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
		return { error: error };
	}

	return {
		thoughts,
		pagination: {
			page,
			limit,
			total: count,
			pages: Math.ceil((count || 0) / limit)
		},
		error: null
	};
}

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
		let { profile_photo_id } = personData[0];

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
	},
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
		console.log('thoughts', thoughts);
		return {
			thoughts,
			pagination: {
				page,
				limit,
				total: count,
				pages: Math.ceil((count || 0) / limit)
			}
		};
	}
};
