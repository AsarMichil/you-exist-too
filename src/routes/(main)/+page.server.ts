import { db } from '$lib/server/db';
import type { Person } from '$lib/server/db/types';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const searchSchema = z.object({
	search: z.string().min(1, 'Please enter a search term')
});

export const load: PageServerLoad = async ({ locals: { safeGetSession }, url }) => {
	const { user, session } = await safeGetSession();
	const form = await superValidate(zod(searchSchema));

	const searchQuery = url.searchParams.get('q');
	let results: Person[] = [];

	if (searchQuery) {
		form.data.search = searchQuery;
		try {
			const searchResult = await db.searchPerson(searchQuery);
			if (searchResult.data && searchResult.data.length > 0) {
				results = searchResult.data as Person[];
			} else {
				results = [];
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
	// if no person but valid session, redirect to setup
	console.log('root server fuck', person);
	if (!person.data || person.data.length === 0) {
		return redirect(302, '/setup');
	}
	let username;
	if (person.data.length === 0) {
		username = undefined;
	} else {
		username = person.data[0].username;
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
		return redirect(302, '/');
	}
};
