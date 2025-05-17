import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	console.log('locals', locals);

	if (!locals.user) {
		throw redirect(302, '/');
	}

	// If we're at the root setup path, redirect to the appropriate step
	if (url.pathname === '/setup') {
		console.log('penisadinaiosd');
		// First check if email is verified
		if (locals.user && !locals.user.email_confirmed_at) {
			throw redirect(302, '/setup/verify-email');
		}

		// We'll need to query the database to check which steps are completed
		const { data: person, error } = await locals.supabase
			.from('person')
			.select('preferred_name, country, blurb, username, profile_photo_id')
			.eq('id', locals.user.id)
			.single();
		// if there is an error fetching the person, if it is a not found error, redirect to the username setup page
		if (error) {
			if (error.code === 'PGRST116') {
				throw redirect(302, '/setup/username');
			}
			console.error('Error fetching person:', error);
			throw redirect(302, '/setup/username');
		}
		// if no password no real way to check this... maybe TODO

		if (!person.preferred_name) {
			throw redirect(302, '/setup/name');
		}

		if (!person.country) {
			throw redirect(302, '/setup/origin');
		}

		if (!person.blurb) {
			throw redirect(302, '/setup/blurb');
		}

		if (!person.profile_photo_id) {
			throw redirect(302, '/setup/profile-photo');
		}

		// If all steps are completed, redirect to the main app
		throw redirect(302, '/');
	}

	return {
		user: locals.user
	};
};
