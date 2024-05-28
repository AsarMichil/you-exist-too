import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';

export const load = async ({ locals }) => {
	const { supabase } = locals;
	const {
		data: { user },
		error
	} = await supabase.auth.getUser();
	if (error) {
		redirect(302, '/login');
		// return { session: null, user: null };
	}
	const personData = await db.getPersonById(user!.id);
	console.log('personData', personData);
	if (!personData || personData.count == 0) {
		console.log('No person data found! SHOULD NOT HAPPEN');
		redirect(302, '/login');
	}
	return { username: personData.data![0].username };
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const {
			locals: { supabase }
		} = event;
		const password = formData.get('password');
		// username must be between 3 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
		// keep in mind some database (e.g. mysql) are case insensitive
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password, please use a password longer than 6 characters!'
			});
		}
		const { error } = await event.locals.supabase.auth.getUser();
		if (error) {
			return fail(400, {
				message: 'No User Session Found!'
			});
		}
		const updatedUser = await supabase.auth.updateUser({
			password: password
		});
		console.log('updatedUser', updatedUser.data);
		return { success: 'Nice!', user: updatedUser.data.user };
	}
};
