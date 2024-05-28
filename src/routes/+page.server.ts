import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Person } from '$lib/server/db/types';
import { db } from '$lib/server/db';

const results = new Map() as Map<string, Person[]>;

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { user, session } = await safeGetSession();
	if (!user) return { status: 302, redirect: '/login', results: results };

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
		results: results,
		session: session
	};
	return { status: 302, redirect: '/login', results: results };
};

export const actions: Actions = {
	signout: async ({ locals: { supabase, safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (session) {
			await supabase.auth.signOut();
		}
	},
	search: async (event) => {
		return fail(400, { status: 400, message: 'No search input' });
		// const data = await event.request.formData();
		// const searchInput = data.get('search');
		// if (!searchInput || searchInput?.toString() == '') {
		// 	return fail(400, { message: 'No search input, please enter a name below' });
		// }
		// const names = String(searchInput).split(' ');
		// let returnData;
		// if (results.has(String(searchInput))) {
		// 	return results.get(String(searchInput));
		// } else {
		// 	results.clear();
		// }
		// if (names.length < 2) {
		// 	returnData = await db.getPersonByGivenOrFamilyOrPreferredName(names[0]);
		// } else {
		// 	returnData = await db.getPersonByGivenAndFamilyName(names[0], names[1]);
		// }
		// if (returnData.rows.length === 0) {
		// 	return { status: 404, results: results, message: 'No results found' };
		// } else {
		// 	results.set(String(searchInput), returnData.rows);
		// 	return { results: results.get(String(searchInput)), message: 'Success' };
		// }
	}
};
