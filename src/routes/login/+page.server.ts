import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (session) {
		redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		if (typeof username !== 'string' || typeof password !== 'string') {
			return fail(400, {
				message: 'Invalid username or password'
			});
		}
		console.log('username', username);
		console.log('password', password);
		let email = await db.getPersonEmail(username);
		console.log('email', email);
		if (!email) {
			email = 'na';
		}
		const existingUser = await supabase.auth.signInWithPassword({
			email: email,
			password: password
		});
		// console.log('existingUser', existingUser);
		if (existingUser.error) {
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}
		console.log('existingUser', existingUser);
		redirect(302, '/');
	}
};
