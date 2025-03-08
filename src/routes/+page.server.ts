import { db } from '$lib/server/db';
import type { Person } from '$lib/server/db/types';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';

const searchSchema = z.object({
	search: z.string().min(1, 'Please enter a search term')
});

export const load: PageServerLoad = async ({ locals: { safeGetSession }, url }) => {
	const { user, session } = await safeGetSession();
	const form = await superValidate(zod(searchSchema));

	const searchQuery = url.searchParams.get('q');
	const results = new Map<string, Person[]>();

	if (searchQuery) {
		form.data.search = searchQuery;
		try {
			const searchResult = await db.searchPerson(searchQuery);
			console.log(searchResult);
			if (searchResult.data && searchResult.data.length > 0) {
				results.set(searchQuery, searchResult.data);
			}
		} catch (error) {
			console.error('Search error:', error);
		}
	}

	if (!user) {
		return {
			status: 200,
			user: user,
			results,
			session: session,
			form
		};
	}

	const person = await db.getPersonById(user.id);
	let username;
	if (person.count === 0) {
		username = undefined;
	} else {
		username = person.data![0].username;
	}

	return {
		status: 200,
		username: username,
		user: user,
		results,
		session: session,
		form
	};
};

export const actions = {
	signout: async ({ locals: { supabase, safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (session) {
			await supabase.auth.signOut();
		}
	}
};
